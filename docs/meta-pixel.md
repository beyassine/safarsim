# Meta Pixel browser tracking

Pixel: `1114292477590208`. Implementation: `src/services/metaPixel.js`.

`src/main.js` installs one Vue Router `afterEach` hook before `app.use(router)`.
The first successful resolved route and subsequent path changes send PageView
when marketing consent is granted. Failed/duplicate navigations and query/hash-only
changes do not count. Returning to a previously visited path counts again.
There is no PageView in HTML or components. Automatic Meta history tracking and
automatic event configuration are disabled; the router owns PageViews.

## Consent integration requirement

The existing HTML defaults Google Consent Mode signals to denied. No consent
banner, persisted marketing permission, or consent-grant implementation exists
in this repository. Meta therefore remains disabled in the current application:
no script request, initialization, or events occur before an explicit grant.
This change does not alter or intercept gtag/dataLayer or infer permission from it.

When a consent manager is added, its actual marketing decision must call:

```js
import { setMetaMarketingConsent } from '@/services/metaPixel'
setMetaMarketingConsent(true) // only after confirmed marketing permission
setMetaMarketingConsent(false) // when denied or withdrawn
```

A grant loads the official async fbevents.js library and initializes the pixel
once, then sends the current resolved page once. Earlier denied visits are never
replayed. Withdrawal blocks subsequent service events and tells Meta to revoke
consent. Regrant on the same already-counted page does not duplicate its event.
Permission is not persisted by this service; a future consent manager owns it.
Do not grant unconditionally at startup.

The standard fbq queue supports asynchronous loading. Failed or blocked tracking
returns false without interrupting the app; successful enqueueing is not proof
of delivery. Browser delivery has not been verified against a live Meta account.

## Future commerce

`trackViewContent`, `trackAddToCart`, `trackInitiateCheckout`, and `trackPurchase`
accept standard event parameter objects. They are interfaces only and have no
component callers. Purchase must later be connected exclusively to a paid
`/api/checkout/verify` result with transaction deduplication, never a success URL.
No Conversions API is included. Google Ads and its existing verified-purchase
behavior are unchanged.

Run regression checks with `node --test tests/*.test.cjs`.
