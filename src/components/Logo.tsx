/**
 * Vektor-Nachbau des Beauty 1010 Logos (offener Rahmen, „1010" über „BEAUTY").
 * Vorlage: Instagram-Profilbild @beauty1010_vienna (nur 150 px verfügbar).
 * Sobald der Salon die Original-Logodatei liefert, diese Komponente ersetzen.
 */
type Props = {
  size?: number;
  color?: string;
  /** Kreisfläche wie im Instagram-Profil */
  disc?: string | null;
  title?: string;
  className?: string;
};

export function Logo({ size = 120, color = 'currentColor', disc = null, title = 'Beauty 1010', className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label={title}
    >
      {disc && <circle cx="120" cy="120" r="120" fill={disc} />}
      <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="square">
        {/* linke Rahmenlinie = Schaft des B */}
        <path d="M38.5 46 V184.5" />
        {/* oben + rechts + Fußlinie */}
        <path d="M38.5 46 H204 V196 H172" />
      </g>
      <g fill={color} fontFamily="Jost, 'Futura', 'Century Gothic', sans-serif">
        <text x="186" y="151" fontSize="22" fontWeight="400" textAnchor="end" letterSpacing="0.5">
          1010
        </text>
        <text x="33" y="185" fontSize="37" fontWeight="400" textLength="155" lengthAdjust="spacing">
          BEAUTY
        </text>
      </g>
    </svg>
  );
}
