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
  const context = vm.createContext({ window, console: { info: (...args) => previews.push(args) } })
  vm.runInContext(source, context)
  return { track: context.trackVerifiedPurchase, calls, previews }
}
test('paid revenue and currency come from verified Stripe data; payload contains no personal data', () => {
  for (const currency of ['eur', 'usd', 'mad']) {
    const {track, calls} = setup()
    const result = paid(currency, 1395) // final discounted amount
    result.customerEmail = 'private@example.com'
    assert.equal(track(result), true)
    assert.deepEqual(JSON.parse(JSON.stringify(calls)), [['event', 'conversion', {send_to:'AW-10976721001/G_taCLrGvPIcEOnwjfIo', value:13.95, currency:currency.toUpperCase(), transaction_id:'cs_live_verified123'}]])
  }
})
test('unverified, unpaid, incomplete, malformed and unsupported payments do not fire', () => {
  for (const result of [undefined, {}, {paid:false}, {paid:true}, {...paid(),paid:false}, paid('jpy'), paid('eur',-1), paid('eur',NaN), paid('eur',1.5), {...paid(),purchase:{...paid().purchase,livemode:undefined}}, {...paid(),purchase:{...paid().purchase,transactionId:'random'}}]) {
    const {track,calls} = setup();assert.equal(track(result),false);assert.equal(calls.length,0)
  }
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
  for (const locale of ['en','fr','ar']) {
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
