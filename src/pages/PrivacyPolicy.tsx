import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – Eternal Memory</title>
        <meta name="description" content="Eternal Memory privacy policy. How we collect, use, and protect your personal data." />
      </Helmet>
      <Layout>
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          <h1 className="mb-8 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Privacy Policy
          </h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US")}</p>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">1. Data Controller</h2>
              <p>Eternal Memory ("we", "our", "Platform") is the data controller for personal data collected through the website. We are committed to protecting our users' privacy in compliance with the General Data Protection Regulation (GDPR – EU Regulation 2016/679) and the California Consumer Privacy Act (CCPA).</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">2. Data Collected</h2>
              <p>We collect the following categories of personal data:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Registration data:</strong> name, email address, password (encrypted)</li>
                <li><strong>Memorial data:</strong> names, dates, locations, photos, videos, biographies of commemorated individuals</li>
                <li><strong>Payment data:</strong> processed securely via Stripe. We do not store credit card data</li>
                <li><strong>Browsing data:</strong> IP address, browser type, pages visited, technical cookies</li>
                <li><strong>User contributions:</strong> guestbook messages, virtual tributes</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">3. Purpose of Processing</h2>
              <p>We use personal data to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and manage the digital memorial service</li>
                <li>Process payments for virtual tributes and premium subscriptions</li>
                <li>Send notifications related to accounts and memorials</li>
                <li>Moderate content to ensure community respect</li>
                <li>Improve the service through aggregated and anonymized analytics</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">4. Legal Basis</h2>
              <p>Data processing is based on: user consent, performance of the service contract, legitimate interest of the controller, and legal obligations.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">5. Data Sharing</h2>
              <p>We do not sell personal data. We share data only with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Supabase:</strong> database hosting and authentication</li>
                <li><strong>Stripe:</strong> payment processing</li>
                <li><strong>Google AdSense:</strong> advertising (Free plan users only, with option to disable via upgrade)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">6. User Rights (GDPR/CCPA)</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access:</strong> request a copy of your personal data</li>
                <li><strong>Rectification:</strong> correct inaccurate data</li>
                <li><strong>Deletion:</strong> delete your account and all associated data via the "Delete Account" feature</li>
                <li><strong>Portability:</strong> receive your data in a structured format</li>
                <li><strong>Objection:</strong> object to processing for marketing purposes</li>
                <li><strong>Withdraw consent:</strong> at any time</li>
              </ul>
              <p className="mt-2">For California residents (CCPA): you also have the right to know what data we collect, request its deletion, and not be discriminated against for exercising your rights.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
              <p>Personal data is retained for the duration of the active account. Upon account deletion, all data is removed within 30 days, unless required by law.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">8. Security</h2>
              <p>We implement appropriate technical and organizational measures, including data encryption in transit (TLS), Row Level Security at the database level, and secure authentication.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">9. Contact</h2>
              <p>To exercise your rights or for privacy inquiries, contact us at the email address provided on the Contact page.</p>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
