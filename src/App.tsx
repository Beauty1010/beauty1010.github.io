import { useEffect, useState } from 'react';
import { brand, offer, percentLabel } from './config/brand';
import { Logo } from './components/Logo';
import { Coupon } from './components/Coupon';
import { Legal } from './components/Legal';
import { renderCouponPng } from './lib/couponImage';

const base = import.meta.env.BASE_URL;
const img = (name: string) => ({
  srcSet: `${base}img/${name}-640.webp 640w, ${base}img/${name}-1280.webp 1280w`,
  src: `${base}img/${name}-1280.jpg`,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function useHash() {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return hash;
}

function BookButton({ children, variant = 'solid' }: { children: string; variant?: 'solid' | 'light' }) {
  return (
    <a className={`btn btn--${variant}`} href={brand.bookingUrl} target="_blank" rel="noopener">
      {children}
      <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </a>
  );
}

export default function App() {
  useReveal();
  const hash = useHash();
  const [showCoupon, setShowCoupon] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!showCoupon) return;
    document.body.style.overflow = 'hidden';
    const t = setInterval(() => setNow(new Date()), 1000);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowCoupon(false);
    addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      clearInterval(t);
      removeEventListener('keydown', onKey);
    };
  }, [showCoupon]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  async function saveCoupon() {
    setBusy(true);
    try {
      const blob = await renderCouponPng();
      const file = new File([blob], 'Beauty1010-Gutschein.png', { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
        await navigator.share({ files: [file], title: 'Mein Beauty 1010 Gutschein' });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        setToast('Gutschein gespeichert.');
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setToast('Speichern nicht möglich – mach einfach einen Screenshot.');
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const data = {
      title: `${brand.salonName} – ${percentLabel} Rabatt`,
      text: `${percentLabel} Rabatt ${offer.scope} bei ${brand.salonName} in Wien.`,
      url: brand.publicUrl,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(brand.publicUrl);
        setToast('Link kopiert.');
      }
    } catch {
      /* abgebrochen */
    }
  }

  const legalOpen = hash === '#impressum' || hash === '#datenschutz';

  return (
    <>
      {/* ───────── HERO ───────── */}
      <header className="hero">
        <div className="hero__media">
          <picture>
            <source type="image/webp" srcSet={img('salon-interior').srcSet} sizes="100vw" />
            <img src={img('salon-interior').src} alt="Der helle Salon von Beauty 1010 in der Kleeblattgasse" {...{ fetchpriority: "high" }} />
          </picture>
        </div>
        <div className="hero__badge" data-reveal>
          <Logo size={132} color="var(--graphite)" disc="var(--sage)" />
        </div>
        <div className="hero__copy">
          <h1 data-reveal>
            Willkommen bei <span className="nowrap">Beauty 1010</span>
          </h1>
          <p className="lede" data-reveal>
            Schönheit beginnt mit einem Moment für dich.
          </p>
          <p className="body" data-reveal>
            Gönn dir eine kleine Auszeit und entdecke unsere Beauty-Behandlungen im Herzen von Wien.
          </p>
          <div className="hero__actions" data-reveal>
            <a className="btn btn--solid" href="#angebot">
              Dein {percentLabel} Gutschein
              <svg className="btn__arrow btn__arrow--down" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v13M6 12l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
            <a className="link" href={brand.bookingUrl} target="_blank" rel="noopener">
              Direkt Termin buchen
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ───────── ANGEBOT ───────── */}
        <section className="offer" id="angebot" aria-labelledby="offer-title">
          <h2 id="offer-title" className="offer__title" data-reveal>
            {offer.eyebrow}
          </h2>
          <p className="offer__sub" data-reveal>
            {offer.thanks}
          </p>

          <div className="offer__card" data-reveal>
            <Coupon />
          </div>

          <div className="coupon-actions" data-reveal>
            <button className="btn btn--outline btn--block" onClick={() => setShowCoupon(true)}>
              Gutschein anzeigen
            </button>
            <div className="coupon-actions__row">
              <button className="btn-text" onClick={saveCoupon} disabled={busy}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4v11M7 10l5 5 5-5M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                {busy ? 'Einen Moment …' : 'Gutschein speichern'}
              </button>
              <button className="btn-text" onClick={share}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 15V4M8 8l4-4 4 4M6 12v7h12v-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
                Teilen
              </button>
            </div>
            <p className="hint">{offer.redeemHint}</p>
          </div>
        </section>

        {/* ───────── BUCHEN ───────── */}
        <section className="book" aria-labelledby="book-title">
          <h2 id="book-title" className="sr-only">
            Termin buchen
          </h2>
          <div data-reveal>
            <BookButton>Jetzt Termin buchen</BookButton>
          </div>
          <p className="book__note" data-reveal>
            Sichere dir deinen Wunschtermin ganz einfach online.
          </p>
        </section>

        {/* ───────── SALON ───────── */}
        <section className="salon" aria-labelledby="salon-title">
          <div className="salon__photo" data-reveal>
            <picture>
              <source type="image/webp" srcSet={img('nails-nude').srcSet} sizes="(min-width: 900px) 460px, 100vw" />
              <img src={img('nails-nude').src} alt="Nude-Maniküre von Beauty 1010" loading="lazy" />
            </picture>
          </div>
          <div className="salon__info" data-reveal>
            <h2 id="salon-title" className="salon__name">
              Beauty 1010
            </h2>
            <address>
              {brand.address.street}
              <br />
              {brand.address.zip} {brand.address.city}
            </address>
            {brand.openingHours && (
              <dl className="hours">
                {brand.openingHours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
            )}
            {brand.rating && (
              <p className="rating">
                <strong>{brand.rating.value}</strong> von 5 Sternen auf {brand.rating.source}
                <span>{brand.rating.count} Bewertungen</span>
              </p>
            )}
            <a className="btn btn--outline" href={brand.address.mapsUrl} target="_blank" rel="noopener">
              Standort anzeigen
            </a>
          </div>
        </section>

        {/* ───────── ABSCHLUSS ───────── */}
        <section className="closing" aria-labelledby="closing-title">
          <picture className="closing__bg" aria-hidden="true">
            <source type="image/webp" srcSet={`${base}img/salon-exterior-640.webp 640w`} sizes="100vw" media="(max-width: 700px)" />
            <img src={`${base}img/salon-exterior-1280.jpg`} alt="" loading="lazy" />
          </picture>
          <div className="closing__inner" data-reveal>
            <h2 id="closing-title">Wir freuen uns auf dich!</h2>
            <p className="closing__sign">Dein Beauty 1010 Team</p>
            <BookButton variant="light">Jetzt Beauty-Termin buchen</BookButton>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Logo size={56} color="var(--graphite)" />
        <p className="footer__addr">
          {brand.salonName} · {brand.address.street} · {brand.address.zip} {brand.address.city}
        </p>
        <nav className="footer__nav" aria-label="Links">
          <a href={brand.bookingUrl} target="_blank" rel="noopener">
            Treatwell
          </a>
          <a href={brand.instagramUrl} target="_blank" rel="noopener">
            Instagram
          </a>
          <a href="#impressum">Impressum</a>
          <a href="#datenschutz">Datenschutz</a>
        </nav>
      </footer>

      {/* ───────── GUTSCHEIN VOLLBILD ───────── */}
      {showCoupon && (
        <div className="viewer" role="dialog" aria-modal="true" aria-label="Gutschein">
          <button className="viewer__close" onClick={() => setShowCoupon(false)} aria-label="Schließen">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <div className="viewer__body">
            <Coupon large />
            <p className="viewer__hint">Bitte unserem Team zeigen</p>
            <p className="viewer__time" aria-live="off">
              {now.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' })} ·{' '}
              {now.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <button className="btn btn--solid viewer__print" onClick={() => window.print()}>
              Drucken
            </button>
          </div>
        </div>
      )}

      {legalOpen && <Legal kind={hash === '#impressum' ? 'impressum' : 'datenschutz'} />}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      {/* Druckansicht: nur der Gutschein */}
      <div className="print-only">
        <Coupon large />
      </div>
    </>
  );
}
