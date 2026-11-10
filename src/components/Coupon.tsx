import { offer, percentLabel } from '../config/brand';
import { Logo } from './Logo';

/** Der Gutschein als „physische" Karte. Wird auf der Seite und im Vollbild verwendet. */
export function Coupon({ large = false }: { large?: boolean }) {
  return (
    <div className={`coupon${large ? ' coupon--large' : ''}`} aria-label={`Gutschein: ${percentLabel} Rabatt ${offer.scope}`}>
      <div className="coupon__inner" data-artifact="voucher">
        <div className="coupon__top">
          <Logo size={large ? 64 : 52} color="var(--graphite)" />
          <span className="coupon__kicker">{offer.voucherTitle}</span>
        </div>

        <div className="coupon__value">
          <span className="coupon__num">{offer.discountPercent}</span>
          <span className="coupon__unit">
            <span className="coupon__pct">%</span>
            <span className="coupon__rabatt">Rabatt</span>
          </span>
        </div>
        <p className="coupon__scope">{offer.scope}</p>

        <div className="coupon__rule" aria-hidden="true">
          <span />
          <i className="coupon__notch coupon__notch--l" />
          <i className="coupon__notch coupon__notch--r" />
        </div>

        <p className="coupon__line">
          {percentLabel} {offer.voucherLine}
        </p>
        {offer.code && (
          <p className="coupon__code">
            Code <strong>{offer.code}</strong>
          </p>
        )}
        {offer.validUntil && <p className="coupon__meta">Gültig bis {offer.validUntil}</p>}
        {offer.conditions.map((c) => (
          <p className="coupon__meta" key={c}>
            {c}
          </p>
        ))}
      </div>
    </div>
  );
}
