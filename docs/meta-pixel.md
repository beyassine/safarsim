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

The pre-existing commerce helper interfaces remain unused. No ViewContent,
AddToCart, InitiateCheckout or Purchase callers were added. Future Purchase work
must use an actually paid /api/checkout/verify result and transaction deduplication.
No Conversions API is included.

## Verification

Run `node --test tests/*.test.cjs`. Coverage includes first visit, accept/reject,
saved choices, storage failures/expiry, cross-tab changes, withdrawal, Google
updates, actual Vue Router redirects/navigation and existing Google Ads purchases.
The production compilation can be checked locally with Vue CLI; no deployment
is needed. Live Meta delivery must be verified separately after deployment.
