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

The global Google tag uses `AW-18442061093`. Set
`VUE_APP_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL` to this account's purchase
conversion action label in Vercel, then rebuild/redeploy (Vue embeds it at build
time). This is public configuration, not a secret. An absent/invalid label
disables purchase events; the previous account's label is not reused.

All localized payment success pages already call `trackVerifiedPurchase` after
`/api/checkout/verify` succeeds. Revenue, currency and transaction ID come from
the backend's retrieved, paid Stripe session. EUR/USD/MAD minor units are divided
by 100. Live purchases use persistent localStorage deduplication and the Stripe
session ID as Google's `transaction_id`; Stripe test purchases only log previews.
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
