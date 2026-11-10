/**
 * BEAUTY 1010 — zentrale Konfiguration
 * ------------------------------------------------------------
 * Alles, was sich später ändern kann (Rabatt, Bedingungen, Links,
 * Farben, Adresse, öffentliche URL), steht NUR hier.
 *
 * Werte, die vom Salon noch NICHT bestätigt wurden, sind `null`.
 * Ein `null`-Wert wird auf der Seite einfach nicht angezeigt —
 * es wird nichts erfunden.
 */

export const brand = {
  salonName: 'Beauty 1010',

  /** Öffentliche Adresse der Landingpage. Der QR-Code zeigt hierhin. */
  publicUrl: 'https://zwolfros-debug.github.io/beauty1010/',

  /** Offizielle Buchungsseite (Treatwell). */
  bookingUrl: 'https://www.treatwell.at/ort/beauty-1010/',
  instagramUrl: 'https://www.instagram.com/beauty1010_vienna/',

  address: {
    street: 'Kleeblattgasse 11',
    zip: '1010',
    city: 'Wien',
    district: '1. Bezirk',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Beauty+1010%2C+Kleeblattgasse+11%2C+1010+Wien',
  },

  /** Öffnungszeiten laut Treatwell (geprüft am 10.11.2026). */
  openingHours: [
    { days: 'Montag – Samstag', time: '09:00 – 19:00' },
    { days: 'Sonntag', time: 'geschlossen' },
  ] as { days: string; time: string }[] | null,

  /** Treatwell-Bewertung (geprüft am 10.11.2026). `null` = ausblenden. */
  rating: { value: '4,7', count: '7.562', source: 'Treatwell' } as
    | { value: string; count: string; source: string }
    | null,

  /** Markenfarben (aus Logo, Beschilderung und Salonfotos abgeleitet). */
  colors: {
    graphite: '#232B30', // Logo-Linien, Schrift, Beschilderung
    sage: '#9AA9A9', // Logo-Hintergrund (Instagram-Profil)
    sageDeep: '#5F6F70', // Akzent für Text auf hellem Grund
    stone: '#F5F3EF', // Seitenhintergrund (Wände, Marmorboden)
    nude: '#E8D8CE', // Nude-Töne der Nageldesigns
    white: '#FFFFFF',
  },
} as const;

/**
 * Gutschein / Angebot
 * Rabatt ändern: nur `discountPercent` anpassen.
 */
export const offer = {
  discountPercent: 10,
  eyebrow: 'Exklusives Angebot',
  voucherTitle: 'Dein Beauty-Gutschein',
  scope: 'auf jede Behandlung',
  voucherLine: 'Rabatt auf deine nächste Behandlung.',
  thanks: 'Als kleines Dankeschön für deinen Besuch bei Beauty 1010.',
  redeemHint: 'Einfach beim nächsten Besuch im Salon vorzeigen.',

  /** Gutscheincode — nur eintragen, wenn der Salon einen festlegt. */
  code: null as string | null,
  /** z. B. '31.12.2026' — nur nach Bestätigung durch den Salon. */
  validUntil: null as string | null,
  /** z. B. ['Nicht mit anderen Aktionen kombinierbar.'] — nur nach Bestätigung. */
  conditions: [] as string[],
};

/**
 * Impressum (Pflicht für Unternehmenswebsites in Österreich, § 5 ECG / § 25 MedienG).
 * Diese Angaben MUSS der Salon liefern. Nichts davon wird erfunden.
 */
export const legal = {
  companyName: null as string | null, // z. B. Firmenname laut Firmenbuch
  owner: null as string | null,
  address: 'Kleeblattgasse 11, 1010 Wien',
  email: null as string | null,
  phone: null as string | null,
  uid: null as string | null, // UID-Nummer
  firmenbuch: null as string | null, // FN + Gericht, falls eingetragen
  authority: null as string | null, // Gewerbebehörde, z. B. Magistratisches Bezirksamt
  chamber: null as string | null, // z. B. Kammerzugehörigkeit
};

export const percentLabel = `${offer.discountPercent} %`;
