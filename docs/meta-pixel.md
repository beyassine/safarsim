# Shared advertising consent and Meta PageViews

One banner controls Google advertising consent and Meta Pixel `1114292477590208`.
It appears on a first visit with Accept all and Reject non-essential buttons,
with English, French, Dutch and Arabic translations and RTL layout. The footer's
Cookie settings button reopens it to change a choice. Opening/closing settings
does not itself change consent. There is no separate Google or Meta banner.

## Storage and startup

`src/services/consent.js` stores `{ version: 1, marketing: boolean, savedAt: number }`
in first-party localStorage under `safarsim:consent:v1`. No identifiers or sensitive
information are stored. Choices expire after 180 days and are checked on startup;
missing, malformed, future-dated or expired records require a new choice.
Storage failures retain the choice only for the current page session. Other tabs
receive changes through the browser storage event, including removal of the choice.

`src/main.js` installs the Meta router hook and restores consent synchronously
before awaiting catalog loading and before router startup. A saved choice hides
the banner; saved acceptance initializes Meta immediately. A first-time visitor
or saved rejection leaves Meta unloaded. Tests exercise the consent service with
the actual Meta service, rather than manually substituting a consent grant.

## Google

The existing inline Google default remains unchanged: ad_storage,
ad_user_data, ad_personalization and analytics_storage are denied. The shared
service issues gtag consent updates for the three advertising signals only:
accepted = granted; rejected, withdrawn or missing choice = denied.
analytics_storage remains denied, preserving the existing behavior. No gtag or
dataLayer functions are replaced. Google Ads purchase tracking and server payment
verification are untouched. PostHog's existing independent behavior is unchanged.

## Meta and PageViews

Granting permission calls setMetaMarketingConsent(true), loads the official
https://connect.facebook.net/en_US/fbevents.js script once and initializes the
pixel once using the standard fbq queue. typeof window.fbq then equals 'function'
and the script appears in document.scripts (delivery can still be blocked).

A grant on an already resolved route sends its PageView immediately without a
refresh. A saved grant loads Meta at startup and sends the first PageView only
when Vue Router resolves the initial route. The successful afterEach hook is the
single owner of PageViews: product/locale path changes and back navigation count;
failed or duplicated navigation and query/hash-only changes do not. Automatic
Meta history tracking and automatic event configuration are disabled. Repeat
consent grants do not duplicate the current PageView or library initialization.
Denied history is never replayed; a later grant counts only the current page.

Withdrawal updates Google advertising consent to denied, calls Meta consent
revoke and blocks further service events. It cannot undo previously sent data,
unload executed JavaScript, or guarantee deletion of existing Meta/Google cookies.
After withdrawal fbq/the script can remain present, but service events are blocked.
After a reload with saved rejection, no Meta script is injected.

## Checkout entry events

The homepage and all 32 localized destination pages open a same-page customer
form after plan selection. Although these handlers currently insert into cart
storage internally, Meta treats the customer action as direct checkout:
InitiateCheckout only, with no synthetic AddToCart. Tracking is called explicitly
after checkoutOpen is set, never from rendering or ordinary page loading. The
homepage restoring an old cart on mount does not emit InitiateCheckout.

The generic Region page adds to the cart without opening checkout; it does not
emit InitiateCheckout. Visiting the standalone Cart page with valid items starts
the customer form and emits InitiateCheckout. Embedded Cart instances do not fire
it again, and payment submission/retries do not emit another entry event.

src/services/metaCheckout.js owns payload validation and deduplication. Direct
checkout reports one unit of the selected plan, using its stored price converted
with the same currency utility used by checkout. It excludes unrelated stored
items. Standalone cart checkout reports all normalized items and quantities.
content_ids use the existing destinationSlug-planKey item identity; contents
contains id, quantity and item_price. num_items, value and currency describe the
selection/order at entry, before any coupon entered later. These are browser
checkout estimates, not verified revenue. No customer information is included.

Each page instance deduplicates successful events by the complete checkout
payload. Re-renders, repeat clicks for the same plan, scrolling, form edits and
payment retries cannot resend it. Selecting a different plan can count once;
a new page visit starts a new scope. Events blocked by consent are not replayed
on grant; a subsequent explicit checkout action can send with permission.

ViewContent and AddToCart remain unwired. Purchase is described below. No
Conversions API is included. Existing cart mutations and PostHog naming remain
unchanged by this tracking integration.

## Verification

Run `node --test tests/*.test.cjs`. Coverage includes first visit, accept/reject,
saved choices, storage failures/expiry, cross-tab changes, withdrawal, Google
updates, actual Vue Router redirects/navigation and existing Google Ads purchases.
The production compilation can be checked locally with Vue CLI; no deployment
is needed. Live Meta delivery must be verified separately after deployment.

## Verified Purchase

Each of the English, French, Arabic and Dutch PaymentSuccess pages calls
trackPurchase(result) immediately after the existing Google trackVerifiedPurchase
call, inside the successful /api/checkout/verify branch. No extra verification
request or server modification was added. The server retrieves the Stripe session,
requires payment_status === "paid", validates the SafarSIM order, and returns
purchase.transactionId, amountTotal, currency and livemode from Stripe.

The Meta service additionally requires paid === true, livemode === true, a valid
cs_live_ session ID, a positive integer amountTotal and EUR/USD/MAD currency.
Stripe test payments are deliberately excluded from live Meta revenue, consistent
with the existing Google live-purchase policy. Meta Events Manager testing should
use an actually verified live payment; no test-payment override was added.

The exact dispatch is the existing pixel-scoped standard-event mechanism:

```js
fbq('trackSingle', '1114292477590208', 'Purchase', {
  value: result.purchase.amountTotal / 100,
  currency: result.purchase.currency.toUpperCase()
})
```

Stripe supplies minor units; all three supported currencies have two decimal
places (1250 EUR minor units = 12.50 EUR, 9000 MAD minor units = 90 MAD). No cart,
URL, customer information or locally calculated total enters the payload. The
verification response does not expose verified storefront product IDs, so optional
content_ids/contents/num_items/content_type are omitted rather than reconstructed
from potentially stale cart contents.

Deduplication uses the VERIFIED purchase.transactionId (Stripe Checkout Session
ID), not the query-string session ID or amount. The first-party localStorage key
is safarsim:meta:purchase:<transactionId>, with value "1" and no automatic expiry.
It persists across refreshes, remounts, locale changes and later visits until the
browser/user clears site storage. Distinct sessions with equal totals still count.
It is separate from all Google Ads keys.

Before dispatch a temporary safarsim:meta:storage-check key checks storage
writability and is removed; it does not mark a transaction tracked. If persistent
storage is inaccessible, Purchase is skipped. The purchase marker is written only
AFTER the tracking service successfully calls fbq. An in-memory set also prevents
repeat calls if that final storage write unexpectedly fails. Such a late failure
cannot guarantee deduplication after reload. Clearing storage, different browsers,
and simultaneous first attempts in different tabs are outside this browser-only
deduplication guarantee.

Denied consent sends nothing and stores no transaction marker. No Purchase is
replayed automatically on consent grant; a later success-page revisit must verify
payment again and may attempt the event if consent is then granted. Missing,
throwing or known-failed Meta tracking returns false silently. Success UI,
fulfillment and the prior Google call continue normally.

A successful fbq call may enqueue the event while the library loads. The marker
records an accepted attempt, not confirmed network delivery; later ad blocking or
network failure can prevent delivery without retrying that recorded transaction.
No CAPI or delivery acknowledgement was implemented. PageView, InitiateCheckout,
Google Ads configuration, conversion label, verification and Google deduplication
are unchanged.
