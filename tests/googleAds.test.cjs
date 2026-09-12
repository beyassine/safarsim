const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const source = fs.readFileSync(require('node:path').join(__dirname, '../src/services/googleAds.js'), 'utf8').replace('export function', 'function')
const paid = (currency = 'eur', amountTotal = 1550) => ({ paid: true, purchase: { transactionId: 'cs_live_verified123', amountTotal, currency, livemode: true } })
function setup(storage = new Map(), options = {}) {
  const calls = [], previews = []
  const window = { localStorage: {
    getItem: key => { if (options.blockStorage) throw Error('blocked'); return storage.get(key) },
    setItem: (key, value) => storage.set(key, value),
  } }
  if (!options.noTag) window.gtag = (...args) => { if (options.throwTag) throw Error('blocked'); calls.push(args) }
  const context = vm.createContext({ window, process: { env: { VUE_APP_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL: options.label } }, console: { info: (...args) => previews.push(args) } })
  vm.runInContext(source, context)
  return { track: context.trackVerifiedPurchase, calls, previews }
}
test('paid revenue and currency come from verified Stripe data; payload contains no personal data', () => {
  for (const currency of ['eur', 'usd', 'mad']) {
    const {track, calls} = setup()
    const result = paid(currency, 1395) // final discounted amount
    result.customerEmail = 'private@example.com'
    assert.equal(track(result), true)
    assert.deepEqual(JSON.parse(JSON.stringify(calls)), [['event', 'conversion', {send_to:'AW-18442061093/fRwyCPHG9_IcEKWK7tIE', value:13.95, currency:currency.toUpperCase(), transaction_id:'cs_live_verified123'}]])
  }
})
test('unverified, unpaid, incomplete, malformed and unsupported payments do not fire', () => {
  for (const result of [undefined, {}, {paid:false}, {paid:true}, {...paid(),paid:false}, paid('jpy'), paid('eur',-1), paid('eur',NaN), paid('eur',1.5), paid('eur',0), paid('eur','650'), {...paid(),paid:'true'}, {...paid(),purchase:{...paid().purchase,transactionId:'cs_live_'}}, {...paid(),purchase:{...paid().purchase,transactionId:'cs_live_bad/id'}}, {...paid(),purchase:{...paid().purchase,transactionId:'cs_test_wrongMode'}}, {...paid(),purchase:{...paid().purchase,livemode:undefined}}, {...paid(),purchase:{...paid().purchase,transactionId:'random'}}]) {
    const {track,calls} = setup();assert.equal(track(result),false);assert.equal(calls.length,0)
  }
})
test('missing or stale build configuration cannot disable or reroute the purchase action', () => {
  for (const label of [undefined, '', ' ', 'old_purchase_label', 'AW-111111111/label']) {
    const { track, calls } = setup(new Map(), { label })
    assert.equal(track(paid()), true)
    assert.equal(calls[0][2].send_to, 'AW-18442061093/fRwyCPHG9_IcEKWK7tIE')
  }
})
test('Netherlands and Morocco orders use their actual charged totals and currencies', () => {
  for (const [currency, amountTotal, value] of [['eur', 650, 6.5], ['mad', 6000, 60]]) {
    const { track, calls } = setup()
    assert.equal(track(paid(currency, amountTotal)), true)
    assert.equal(calls[0][2].value, value)
    assert.equal(calls[0][2].currency, currency.toUpperCase())
  }
})
test('distinct paid orders each send once, including after a reload', () => {
  const storage = new Map()
  const first = paid()
  const second = paid('mad', 6000)
  second.purchase.transactionId = 'cs_live_secondOrder456'
  const original = setup(storage)
  assert.equal(original.track(first), true)
  assert.equal(original.track(second), true)
  assert.equal(original.calls.length, 2)
  const reloaded = setup(storage)
  assert.equal(reloaded.track(first), false)
  assert.equal(reloaded.track(second), false)
  assert.equal(reloaded.calls.length, 0)
})
test('previously recorded transactions retain the same deduplication key', () => {
  const storage = new Map([['safarsim:google-ads:purchase:cs_live_verified123', '1']])
  const { track, calls } = setup(storage)
  assert.equal(track(paid()), false)
  assert.equal(calls.length, 0)
})
test('one global Google tag defaults all Consent Mode v2 signals to denied before config', () => {
  const html = fs.readFileSync(require('node:path').join(__dirname, '../public/index.html'), 'utf8')
  assert.equal((html.match(/src="https:\/\/www.googletagmanager.com\/gtag\/js\?id=/g) || []).length, 1)
  assert.ok(html.includes('js?id=AW-18442061093'))
  const context = vm.createContext({ window: {} })
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('dataLayer.push', 'window.dataLayer.push'), context)
  const commands = JSON.parse(JSON.stringify(context.window.dataLayer.map(args => Array.from(args))))
  assert.deepEqual(commands[0], ['consent', 'default', {
    ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  }])
  assert.deepEqual(commands[2], ['config', 'AW-18442061093'])
})
test('repeat calls, refreshes and locale page changes share persistent deduplication', () => {
  const storage = new Map(), first = setup(storage)
  assert.equal(first.track(paid()),true);assert.equal(first.track(paid()),false)
  const refreshed = setup(storage);assert.equal(refreshed.track(paid()),false);assert.equal(refreshed.calls.length,0)
})
test('missing tag, blocked storage and throwing tag cannot break checkout', () => {
  for (const options of [{noTag:true},{blockStorage:true},{throwTag:true}]) {
    const {track,calls} = setup(new Map(),options);assert.equal(track(paid()),false);assert.equal(calls.length,0)
  }
})
test('test payments produce a deduplicated local preview and never call Google', () => {
  const {track,calls,previews} = setup()
  const result = paid();result.purchase.livemode=false;result.purchase.transactionId='cs_test_verified123'
  assert.equal(track(result),true);assert.equal(track(result),false)
  assert.equal(calls.length,0);assert.equal(previews.length,1)
})
test('all localized success pages wait for a successful verification response', async () => {
  for (const locale of ['en','fr','ar','dutch']) {
    const page = fs.readFileSync(require('node:path').join(__dirname, `../src/pages/${locale}/PaymentSuccess.vue`),'utf8')
    const script = page.split('<script>')[1].split('</script>')[0].replace(/^import .*$/gm,'').replace('export default', 'globalThis.component =')
    for (const scenario of ['missing-session','failed-response','unpaid','verified']) {
      const calls=[]
      const context=vm.createContext({process:{env:{}},fetch:async()=>({ok:scenario!=='failed-response',json:async()=>({...paid(),paid:scenario==='verified'})}),trackVerifiedPurchase:r=>calls.push(r),posthog:{capture(){}},getCart:()=>[],clearCart(){},console:{error(){}}})
      vm.runInContext(script,context)
      await context.component.mounted.call({$route:{query:scenario==='missing-session'?{}:{session_id:'cs_live_verified123'}},paymentCaptured:false})
      assert.equal(calls.length,scenario==='verified'?1:0,`${locale}: ${scenario}`)
    }
  }
})
