const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
const paid = (currency = 'eur', amountTotal = 1250, transactionId = 'cs_live_verified123') => ({
  paid: true, customerEmail: 'customer@example.com',
  purchase: { transactionId, amountTotal, currency, livemode: true },
})
function setup(storage = new Map(), options = {}) {
  const calls = [], order = []
  const window = { localStorage: {
    getItem: key => { if (options.blockStorage) throw Error('blocked'); return storage.get(key) ?? null },
    setItem: (key, value) => {
      if (options.blockStorage || (options.failMarker && key.startsWith('safarsim:meta:purchase:'))) throw Error('blocked')
      order.push(['storage', key]); storage.set(key, value)
    },
    removeItem: key => storage.delete(key),
  }, gtag: (...args) => order.push(['google', ...args]) }
  const context = vm.createContext({ window,
    document: { querySelector: () => ({}), createElement: () => ({}), head: { appendChild() {} } },
    console: { info() {}, error() {} }, process: { env: {} },
  })
  vm.runInContext(read('src/services/metaPixel.js').replace(/export /g, ''), context)
  vm.runInContext(read('src/services/googleAds.js').replace(/export /g, ''), context)
  context.setMetaMarketingConsent(options.denied !== true)
  window.fbq = (...args) => {
    if (options.throwTag) throw Error('blocked')
    if (args[2] === 'Purchase') {
      assert.equal(storage.has(`safarsim:meta:purchase:${options.transactionId || 'cs_live_verified123'}`), false)
      order.push(['meta', ...args]); calls.push(args)
    }
  }
  if (options.noTag) window.fbq = undefined
  return { context, window, calls, order, storage }
}
test('verified Stripe amount and ISO currency alone supply Purchase, in normal units', () => {
  for (const [currency, amount, value] of [['mad', 9000, 90], ['eur', 1250, 12.5], ['usd', 1395, 13.95]]) {
    const s = setup()
    assert.equal(s.context.trackPurchase({ ...paid(currency, amount), cart: [{ price: 9999 }], value: 9999 }), true)
    assert.deepEqual(JSON.parse(JSON.stringify(s.calls)), [['trackSingle', '1114292477590208', 'Purchase', { value, currency: currency.toUpperCase() }]])
    assert.ok(s.order.findIndex(x => x[0] === 'meta') < s.order.findIndex(x => x[1] === 'safarsim:meta:purchase:cs_live_verified123'))
  }
})
test('unpaid, unverified, malformed and Stripe test payments cannot produce Purchase', () => {
  for (const result of [undefined, {}, { paid: false }, { paid: true }, { ...paid(), paid: 'true' },
    paid('DH'), paid('jpy'), paid('eur', 0), paid('eur', -1), paid('eur', 1.5), paid('eur', '1250'), paid('eur', NaN),
    paid('eur', 1250, 'cs_live_'), paid('eur', 1250, 'cs_test_test123'),
    { ...paid(), purchase: { ...paid().purchase, livemode: false } },
    { ...paid(), purchase: { ...paid().purchase, livemode: undefined } }]) {
    const s = setup()
    assert.equal(s.context.trackPurchase(result), false)
    assert.equal(s.calls.length, 0)
    assert.equal(s.storage.size, 0)
  }
})
test('refresh/revisit deduplicates by verified transaction, not equal amounts', () => {
  const storage = new Map(), first = setup(storage)
  assert.equal(first.context.trackPurchase(paid()), true)
  assert.equal(first.context.trackPurchase(paid()), false)
  const revisited = setup(storage, { transactionId: 'cs_live_second123' })
  assert.equal(revisited.context.trackPurchase(paid()), false)
  assert.equal(revisited.context.trackPurchase(paid('eur', 1250, 'cs_live_second123')), true)
  assert.equal(revisited.calls.length, 1)
  assert.equal(storage.get('safarsim:meta:purchase:cs_live_verified123'), '1')
  assert.equal(storage.get('safarsim:meta:purchase:cs_live_second123'), '1')
})
test('denied, missing/throwing Meta and blocked storage fail silently without marking tracked', () => {
  for (const options of [{ denied: true }, { noTag: true }, { throwTag: true }, { blockStorage: true }]) {
    const s = setup(new Map(), options)
    assert.equal(s.context.trackPurchase(paid()), false)
    assert.equal(s.storage.has('safarsim:meta:purchase:cs_live_verified123'), false)
    assert.equal(s.calls.length, 0)
  }
  const s = setup(new Map(), { denied: true })
  s.context.trackPurchase(paid())
  s.context.setMetaMarketingConsent(true)
  assert.equal(s.calls.length, 0) // no automatic replay
  assert.equal(s.context.trackPurchase(paid()), true) // subsequent verified revisit
})
test('a late storage failure does not break success or repeat within the current document', () => {
  const s = setup(new Map(), { failMarker: true })
  assert.equal(s.context.trackPurchase(paid()), false)
  assert.equal(s.calls.length, 1)
  assert.equal(s.context.trackPurchase(paid()), false)
  assert.equal(s.calls.length, 1)
})
test('blocked library and server rendering cannot send or throw', () => {
  const s = setup()
  vm.runInContext('loadFailed = true', s.context)
  assert.equal(s.context.trackPurchase(paid()), false)
  assert.equal(s.storage.size, 0)
  const server = vm.createContext({})
  vm.runInContext(read('src/services/metaPixel.js').replace(/export /g, ''), server)
  assert.equal(server.trackPurchase(paid()), false)
})
test('every localized success flow waits for verification, preserves Google, then calls Meta', async () => {
  for (const locale of ['en', 'fr', 'ar', 'dutch']) {
    const page = read(`src/pages/${locale}/PaymentSuccess.vue`)
    const script = page.split('<script>')[1].split('</script>')[0].replace(/^import .*$/gm, '').replace('export default', 'globalThis.component =')
    for (const scenario of ['missing-session', 'http-failure', 'network-failure', 'json-failure', 'unpaid', 'paid', 'meta-blocked', 'consent-denied']) {
      const s = setup(new Map(), { noTag: scenario === 'meta-blocked', denied: scenario === 'consent-denied' })
      let release, cleared = 0, requests = 0
      const pending = new Promise(resolve => { release = resolve })
      Object.assign(s.context, {
        fetch: async () => {
          requests++; await pending
          if (scenario === 'network-failure') throw Error('offline')
          return { ok: scenario !== 'http-failure', json: async () => {
            if (scenario === 'json-failure') throw Error('invalid json')
            return { ...paid(), paid: scenario !== 'unpaid' }
          } }
        },
        getCart: () => [{ currency: 'MAD', price: 9999, quantity: 99 }],
        clearCart: () => { cleared++ }, posthog: { capture() {} },
      })
      vm.runInContext(script, s.context)
      const instance = { $route: { query: scenario === 'missing-session' ? {} : { session_id: 'cs_live_URLvalue456' } }, paymentCaptured: false }
      const mounted = s.context.component.mounted.call(instance)
      assert.equal(s.calls.length, 0, `${locale}/${scenario}: before verification`)
      release(); await mounted
      const verified = ['paid', 'meta-blocked', 'consent-denied'].includes(scenario)
      const google = s.order.filter(x => x[0] === 'google')
      assert.equal(google.length, verified ? 1 : 0, `${locale}/${scenario}: Google`)
      assert.equal(s.calls.length, scenario === 'paid' ? 1 : 0, `${locale}/${scenario}: Meta`)
      assert.equal(cleared, verified ? 1 : 0)
      assert.equal(requests, scenario === 'missing-session' ? 0 : 1)
      if (scenario === 'paid') {
        assert.equal(s.calls[0][3].value, 12.5)
        assert.ok(s.order.findIndex(x => x[0] === 'google') < s.order.findIndex(x => x[0] === 'meta'))
        assert.equal(s.storage.get('safarsim:meta:purchase:cs_live_verified123'), '1')
        assert.equal(s.storage.has('safarsim:meta:purchase:cs_live_URLvalue456'), false)
        await s.context.component.mounted.call({ ...instance, paymentCaptured: false })
        assert.equal(s.calls.length, 1)
        assert.equal(s.order.filter(x => x[0] === 'google').length, 1)
      }
    }
  }
})
