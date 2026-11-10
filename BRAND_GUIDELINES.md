# Beauty 1010: Brand Guidelines (Landingpage & QR-Kampagne)

Quellen (geprüft am 10.11.2026): Treatwell-Seite des Salons, Instagram @beauty1010_vienna (Profilbild, Highlights, Feed), Salonfotos auf Treatwell (Innenraum, Fassade mit Beschilderung, Nageldesign).

## 1. Markenidentität
- **Stil:** modern-minimalistisch, ruhig und hochwertig. Kein verspieltes Rosa, sondern **gedämpftes Salbei-Grau, Graphit und viel Weiß**.
- **Salon:** heller Gewölberaum mit weißen Arbeitsplätzen, Marmorboden, grau gespachtelter Wand und schwarzen Stahlregalen. Altwiener Fassade in der Kleeblattgasse mit schwarzen Schildern und weißem Logo.
- **Arbeiten:** cleane Nude- und Natur-Maniküren mit Hochglanz und präziser Form.
- **Tonalität:** herzlich, per „du“, kurz, ohne Übertreibung. Das deckt sich mit der Treatwell-Beschreibung: „eine kleine Auszeit vom Alltag“.
- **Positionierung (Instagram):** „Nail Experts and Education“, Mani, Pedi, Hair, Brows, Laser.

## 2. Farben
| Rolle | Name | HEX | Herkunft |
|---|---|---|---|
| Primär | Graphit | `#232B30` | Logo-Linien, Beschilderung (aus dem Profilbild gemessen) |
| Primär | Salbei-Grau | `#9AA9A9` | Logo-Hintergrund im Instagram-Profil (gemessen, ±2 %) |
| Sekundär | Stein | `#F5F3EF` | weiße Wände, Marmorboden |
| Sekundär | Papier | `#FBFAF8` | Flächen und Karten |
| Akzent | Salbei tief | `#5F6F70` | kleine Texte auf hellem Grund (Kontrast AA) |
| Akzent | Nude | `#E8D8CE` | Nageldesigns, nur sparsam einsetzen |

Kontraste: Graphit auf Salbei ≈ 5,9 : 1 · Graphit auf Stein ≈ 13,0 : 1 · Salbei tief auf Stein ≈ 4,7 : 1 (alle ≥ WCAG AA 4,5 : 1).

## 3. Typografie
- **Jost** (geometrische Grotesk, Futura-Familie, entspricht der Logo-Schrift): Fließtext, Labels in Versalien mit 0,2–0,3 em Laufweite, große Rabattzahl in Light 300.
- **Cormorant Garamond** (elegante Antiqua): Headlines, kursive Zitate wie „Schönheit beginnt …“. Ziffern immer mit `lining-nums`.
- Beide Schriften liegen **lokal** auf der Seite (kein Google-Fonts-Aufruf, DSGVO-freundlich).

## 4. Logo
- Aufbau: offener quadratischer Rahmen, „1010“ klein über „BEAUTY“. Die linke Rahmenlinie ist zugleich der Schaft des „B“.
- Varianten: Graphit auf Salbei (Kreis wie bei Instagram), Graphit auf Hell und Weiß auf Graphit (Beschilderung).
- Schutzraum: mindestens die Höhe von „1010“ rundum. Nicht verzerren, nicht einfärben (außer Graphit/Weiß), kein Schatten.
- ⚠️ **Status: Vektor-Nachbau.** Öffentlich gibt es das Logo nur als Instagram-Profilbild mit 150 × 150 px. Der Nachbau in `src/components/Logo.tsx` und `public/favicon.svg` ist sehr nah am Original, aber nicht die Originaldatei. **Bitte die Original-Logodatei (SVG, PDF oder AI) beim Salon anfordern** und vor dem professionellen Druck austauschen.

## 5. Bildstil
- Echte Salonfotos: hell, natürliches Licht, viel Weiß und Grau, ruhige Komposition.
- Nahaufnahmen von Händen mit Nude-Tönen und Glanz.
- Keine Stockfotos, keine kräftigen Filter. Wenn es nötig ist, leicht entsättigen oder mit Salbei-Grau abtönen.
- Aktuell verwendet: 3 Fotos von der Treatwell-Salonseite (Innenraum, Maniküre, Fassade). Freigabe durch den Salon bestätigen lassen.

## 6. UI-Richtung
- Viel Weißraum, zentrierte Komposition, feine Linien (1 px, 14 % Graphit).
- Gutschein als „echte“ Karte: Salbei-Grau, weißer Innenrahmen, gestrichelte Abreißlinie mit Kerben.
- Buttons: Pille, Graphit gefüllt oder Graphit-Outline, Versalien mit Laufweite. Höchstens ein Primärbutton pro Abschnitt.
- Animation: nur sanftes Einblenden (0,9 s) und ein langsamer Bild-Zoom im Hero. `prefers-reduced-motion` wird respektiert.
- Icons nur dort, wo sie Bedeutung tragen (Speichern, Teilen, Pfeil).
