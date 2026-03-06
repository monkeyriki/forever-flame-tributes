import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – Memoria Eterna</title>
        <meta name="description" content="Informativa sulla privacy di Memoria Eterna. Come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali." />
      </Helmet>
      <Layout>
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          <h1 className="mb-8 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Informativa sulla Privacy
          </h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">1. Titolare del Trattamento</h2>
              <p>Memoria Eterna ("noi", "nostro", "Piattaforma") è il titolare del trattamento dei dati personali raccolti attraverso il sito web. Ci impegniamo a proteggere la privacy dei nostri utenti in conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR – Regolamento UE 2016/679) e il California Consumer Privacy Act (CCPA).</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">2. Dati Raccolti</h2>
              <p>Raccogliamo le seguenti categorie di dati personali:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Dati di registrazione:</strong> nome, indirizzo email, password (criptata)</li>
                <li><strong>Dati dei memoriali:</strong> nomi, date, luoghi, foto, video, biografie delle persone commemorate</li>
                <li><strong>Dati di pagamento:</strong> elaborati in modo sicuro tramite Stripe. Non memorizziamo i dati della carta di credito</li>
                <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate, cookie tecnici</li>
                <li><strong>Contributi degli utenti:</strong> messaggi nel guestbook, tributi virtuali</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">3. Finalità del Trattamento</h2>
              <p>Utilizziamo i dati personali per:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fornire e gestire il servizio di memoriali digitali</li>
                <li>Elaborare pagamenti per tributi virtuali e abbonamenti premium</li>
                <li>Inviare notifiche relative all'account e ai memoriali</li>
                <li>Moderare i contenuti per garantire il rispetto della community</li>
                <li>Migliorare il servizio attraverso analisi aggregate e anonimizzate</li>
                <li>Adempiere agli obblighi legali</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">4. Base Giuridica</h2>
              <p>Il trattamento dei dati si basa su: consenso dell'utente, esecuzione del contratto di servizio, legittimo interesse del titolare, e obblighi di legge.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">5. Condivisione dei Dati</h2>
              <p>Non vendiamo i dati personali. Condividiamo i dati solo con:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Supabase:</strong> hosting del database e autenticazione</li>
                <li><strong>Stripe:</strong> elaborazione dei pagamenti</li>
                <li><strong>Google AdSense:</strong> pubblicità (solo per utenti Free, con possibilità di disattivazione tramite upgrade)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">6. Diritti dell'Utente (GDPR/CCPA)</h2>
              <p>Hai il diritto di:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Accesso:</strong> richiedere una copia dei tuoi dati personali</li>
                <li><strong>Rettifica:</strong> correggere dati inesatti</li>
                <li><strong>Cancellazione:</strong> eliminare il tuo account e tutti i dati associati tramite la funzione "Elimina Account"</li>
                <li><strong>Portabilità:</strong> ricevere i tuoi dati in formato strutturato</li>
                <li><strong>Opposizione:</strong> opporti al trattamento per finalità di marketing</li>
                <li><strong>Revoca del consenso:</strong> in qualsiasi momento</li>
              </ul>
              <p className="mt-2">Per i residenti in California (CCPA): hai inoltre il diritto di sapere quali dati raccogliamo, richiederne la cancellazione e non essere discriminato per l'esercizio dei tuoi diritti.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">7. Conservazione dei Dati</h2>
              <p>I dati personali vengono conservati per la durata dell'account attivo. Alla cancellazione dell'account, tutti i dati vengono eliminati entro 30 giorni, salvo obblighi di legge.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">8. Sicurezza</h2>
              <p>Implementiamo misure tecniche e organizzative adeguate, tra cui crittografia dei dati in transito (TLS), Row Level Security a livello di database e autenticazione sicura.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">9. Contatti</h2>
              <p>Per esercitare i tuoi diritti o per domande sulla privacy, contattaci all'indirizzo email indicato nella pagina Contatti.</p>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
