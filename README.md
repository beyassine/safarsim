# datasafar

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Google Ads purchases

The single global Google tag is initialized in `public/index.html` with
`gtag('config', 'AW-18442061093')`. Do not add a second Google tag or GTM container.
`src/services/googleAds.js` uses the Purchase conversion destination
`AW-18442061093/fRwyCPHG9_IcEKWK7tIE`. This public configuration is explicit in
source; no conversion-label environment variable is required or used.

All four localized payment success pages call `trackVerifiedPurchase` after
`/api/checkout/verify` succeeds. Revenue, currency and transaction ID come from
the backend's retrieved, paid Stripe session. EUR/USD/MAD minor units are divided
by 100. Live purchases use persistent localStorage deduplication and the Stripe
session ID as Google's `transaction_id`; Stripe test purchases only log previews.
The existing session ID and storage key are retained so previously tracked
transactions remain deduplicated. For example, Stripe `amount_total: 650` with
`currency: 'eur'` sends `value: 6.5, currency: 'EUR'`; `6000` with `'mad'` sends
`value: 60, currency: 'MAD'`. Neither cart totals nor URL amounts are trusted.
The server's `processPaidSession` retrieves Stripe Checkout and rejects any
session whose `payment_status` is not `paid`; creating a checkout or loading the
confirmation page alone never sends a conversion. Verification currently also
performs fulfillment recovery, so fulfillment errors can delay verification.
Storage failures skip tracking. Client tracking cannot guarantee delivery when
customers close the page or block the tag, and clearing storage can allow another
event with the same transaction ID.

Consent Mode v2 defaults ad_storage, analytics_storage, ad_user_data and
ad_personalization to denied before tag configuration. There is currently no
consent banner/CMP in this project, so no consent is automatically granted.
This is advanced consent mode: Google may send cookieless pings while denied.
A future consent UI must call `gtag('consent', 'update', ...)` with the user's
explicit choices, including withdrawals; these defaults do not collect consent.

Run tracking checks with `node --test tests/googleAds.test.cjs`.

### Destination prerendering

`npm run build` must prerender all eight popular destination landing pages in
English, French, and Arabic. The build fails if a page lacks its heading, plans,
structured data, locale, or canonical URL. Each generated page is also loaded
with JavaScript disabled to verify that its content is present in the HTML.

Vercel Linux builds use `@sparticuz/chromium`; local builds use Puppeteer's
browser. Do not skip the prerender step in deployment. `vercel.json` serves
existing static files before falling back to the SPA entry point. Deploy the
whole `dist` directory, including nested destination `index.html` files.
Prerendering uses the bundled catalog and blocks external requests to keep
builds reproducible; the live application refreshes the catalog on startup.

After deployment, check a destination URL with JavaScript disabled (or inspect
its HTTP response source), including `/fr/esim/morocco` and `/ar/esim/europe`.
Local build verification does not verify production routing or Google indexing.
