import Stripe from "https://esm.sh/stripe@17.7.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2025-04-30.basil" });
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map Stripe product IDs to plan names
const PRODUCT_TO_PLAN: Record<string, string> = {
  "prod_U71fHmvktOBUbq": "premium",
  "prod_U71guBVwU3pjGw": "premium",
  "prod_U71i7jaxAId6re": "business",
  "prod_U71rbrWJHacqKi": "business",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    if (endpointSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tributeId = session.metadata?.tribute_id;
    const memorialId = session.metadata?.memorial_id;
    const userId = session.metadata?.supabase_user_id;

    if (tributeId) {
      // === TRIBUTE PAYMENT ===
      // Look up the tribute to check its tier
      const { data: tributeRow } = await supabase
        .from("tributes")
        .select("tier")
        .eq("id", tributeId)
        .single();

      const isPremiumTribute = tributeRow?.tier === "premium";
      const expiresAt = isPremiumTribute
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error: updateError } = await supabase
        .from("tributes")
        .update({
          is_paid: true,
          status: "approved",
          stripe_session_id: session.id,
          ...(expiresAt ? { expires_at: expiresAt } : {}),
        })
        .eq("id", tributeId);

      if (updateError) console.error("Failed to update tribute:", updateError);

      const amount = (session.amount_total || 0) / 100;
      await supabase.from("transactions").insert({
        type: "tribute",
        amount,
        tribute_id: tributeId,
        memorial_id: memorialId || null,
        description: `Paid tribute`,
      });

      console.log(`Tribute ${tributeId} marked as paid ($${amount})`);
    } else if (userId) {
      // === PLAN UPGRADE ===
      // Determine which plan was purchased
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
      let planName = "premium";

      for (const item of lineItems.data) {
        const productId = item.price?.product as string;
        if (productId && PRODUCT_TO_PLAN[productId]) {
          planName = PRODUCT_TO_PLAN[productId];
        }
      }

      // Update all user's memorials to the new plan
      const { error: memError } = await supabase
        .from("memorials")
        .update({ plan: planName })
        .eq("user_id", userId);

      if (memError) console.error("Failed to update memorials plan:", memError);

      // Record transaction
      const amount = (session.amount_total || 0) / 100;
      await supabase.from("transactions").insert({
        type: "plan_upgrade",
        amount,
        user_id: userId,
        description: `Plan upgrade to ${planName}`,
      });

      console.log(`User ${userId} upgraded to ${planName} ($${amount})`);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
