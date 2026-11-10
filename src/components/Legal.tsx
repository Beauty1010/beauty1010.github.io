import { brand, legal } from '../config/brand';

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
}

export function Legal({ kind }: { kind: 'impressum' | 'datenschutz' }) {
  const close = () => {
    history.replaceState(null, '', location.pathname + location.search);
    dispatchEvent(new HashChangeEvent('hashchange'));
  };
  const missing = !legal.companyName && !legal.owner;

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <div className="sheet__panel">
        <button className="viewer__close" onClick={close} aria-label="Schließen">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        {kind === 'impressum' ? (
          <>
            <h2 id="legal-title">Impressum</h2>
            <p className="sheet__small">Informationen gemäß § 5 ECG und § 25 MedienG</p>
            <p>
              <strong>{legal.companyName ?? brand.salonName}</strong>
              {legal.owner && (
                <>
                  <br />
                  {legal.owner}
                </>
              )}
              <br />
              {legal.address}
            </p>
            <Row label="E-Mail" value={legal.email} />
            <Row label="Telefon" value={legal.phone} />
            <Row label="UID-Nummer" value={legal.uid} />
            <Row label="Firmenbuch" value={legal.firmenbuch} />
            <Row label="Gewerbebehörde" value={legal.authority} />
            <Row label="Mitglied der" value={legal.chamber} />
            {missing && <p className="sheet__small">Weitere Angaben werden in Kürze ergänzt.</p>}
          </>
        ) : (
          <>
            <h2 id="legal-title">Datenschutz</h2>
            <p>
              Diese Seite verwendet <strong>keine Cookies</strong>, keine Analyse- oder Tracking-Werkzeuge und
              speichert keine personenbezogenen Daten. Es gibt keine Formulare und keine Registrierung.
            </p>
            <p>
              <strong>Hosting.</strong> Die Seite wird über GitHub Pages (GitHub Inc., USA) ausgeliefert. Beim Aufruf
              verarbeitet der Hosting-Anbieter technisch notwendige Verbindungsdaten (z.&nbsp;B. IP-Adresse), um die
              Seite anzuzeigen und die Sicherheit des Dienstes zu gewährleisten. Schriftarten und Bilder werden direkt
              von dieser Seite geladen, nicht von Drittanbietern.
            </p>
            <p>
              <strong>Externe Links.</strong> Erst wenn du auf „Termin buchen", „Standort anzeigen" oder „Instagram"
              tippst, wirst du zu Treatwell, Google Maps bzw. Instagram weitergeleitet. Dort gelten die
              Datenschutzbestimmungen des jeweiligen Anbieters.
            </p>
            <p>
              <strong>Gutschein speichern.</strong> Das Gutscheinbild wird ausschließlich auf deinem Gerät erzeugt und
              nicht übertragen.
            </p>
            <p>
              <strong>Deine Rechte.</strong> Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung,
              Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei der österreichischen
              Datenschutzbehörde (dsb.gv.at).
            </p>
            <p>
              <strong>Verantwortlich:</strong> {legal.companyName ?? brand.salonName}, {legal.address}
              {legal.email ? `, ${legal.email}` : ''}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
