import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy – Memoria Eterna</title>
        <meta name="description" content="Informativa sui cookie di Memoria Eterna." />
      </Helmet>
      <Layout>
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          <h1 className="mb-8 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Cookie Policy
          </h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">1. Cosa Sono i Cookie</h2>
              <p>I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti un sito web. Vengono utilizzati per migliorare l'esperienza di navigazione e fornire funzionalità essenziali.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">2. Cookie Utilizzati</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-foreground">Tipo</th>
                      <th className="px-4 py-2 text-left text-foreground">Finalità</th>
                      <th className="px-4 py-2 text-left text-foreground">Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Tecnici (necessari)</td>
                      <td className="px-4 py-2">Autenticazione, sessione utente, preferenze del sito</td>
                      <td className="px-4 py-2">Sessione / 1 anno</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Analitici</td>
                      <td className="px-4 py-2">Statistiche anonime di utilizzo per migliorare il servizio</td>
                      <td className="px-4 py-2">2 anni</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Pubblicitari</td>
                      <td className="px-4 py-2">Google AdSense per mostrare annunci pertinenti (solo piano Free)</td>
                      <td className="px-4 py-2">Variabile</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">3. Gestione dei Cookie</h2>
              <p>Puoi gestire le preferenze sui cookie attraverso le impostazioni del tuo browser. La disattivazione di alcuni cookie potrebbe limitare alcune funzionalità del sito.</p>
              <p>I cookie pubblicitari di Google AdSense vengono automaticamente disattivati per gli utenti con piano Premium o Business.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">4. Cookie di Terze Parti</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Supabase:</strong> cookie di autenticazione per gestire la sessione utente</li>
                <li><strong>Stripe:</strong> cookie necessari per l'elaborazione sicura dei pagamenti</li>
                <li><strong>Google AdSense:</strong> cookie per la personalizzazione degli annunci (solo piano Free)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">5. Consenso</h2>
              <p>Continuando a navigare sul nostro sito, accetti l'utilizzo dei cookie tecnici necessari. Per i cookie analitici e pubblicitari, richiediamo il tuo consenso esplicito conformemente al GDPR e alla Direttiva ePrivacy.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">6. Contatti</h2>
              <p>Per informazioni sui cookie, contattaci tramite la pagina Contatti del sito.</p>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CookiePolicy;
