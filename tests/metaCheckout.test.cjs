const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
function setup(currency = 'EUR', granted = true) {
  let cart = []
  const window = {}
  const context = vm.createContext({
    window,
    document: { querySelector: () => ({}), getElementById: () => null },
    process: { env: { VUE_APP_DEFAULT_COUNTRY: { EUR: 'FR', MAD: 'MA', USD: 'US' }[currency] } },
    getCart: () => cart,
    addToCart: item => { cart.push(item) },
    posthog: { capture() {} },
    setTimeout() {},
  })
  for (const file of ['src/utils/currency.js', 'src/services/metaPixel.js', 'src/services/metaCheckout.js']) {
    vm.runInContext(read(file).replace(/^import .*$/gm, '').replace(/export /g, ''), context)
  }
  context.setMetaMarketingConsent(granted)
  const events = () => Array.from(window.fbq?.queue || [], args => Array.from(args)).filter(args => args[0] === 'trackSingle')
  return { context, events, setCart: value => { cart = value } }
}
const item = { destinationSlug: 'maroc', planKey: '1GB_7days', price: 60, currency: 'MAD', quantity: 1 }
test('real selected plan IDs, quantities, value and visitor currency are sent without customer data', () => {
  for (const currency of ['EUR', 'USD', 'MAD']) {
    const s = setup(currency)
    const amount = currency === 'MAD' ? 60 : 6
    assert.equal(s.context.trackCheckoutEntry({}, [{ ...item, email: 'private@example.com' }]), true)
    const payload = JSON.parse(JSON.stringify(s.events()[0][3]))
    assert.deepEqual(payload, {
      content_type: 'product', content_ids: ['maroc-1GB_7days'],
      contents: [{ id: 'maroc-1GB_7days', quantity: 1, item_price: amount }],
      num_items: 1, value: amount, currency,
    })
    assert.equal(s.events()[0][2], 'InitiateCheckout')
  }
})
test('direct checkout reports only the selected plan, independently of accumulated cart items', () => {
  const s = setup()
  s.setCart([{ ...item, quantity: 4 }, { ...item, planKey: '5GB_30days', price: 120 }])
  const owner = {}
  s.context.trackDirectCheckoutEntry(owner, 'maroc', '1GB_7days')
  s.context.trackDirectCheckoutEntry(owner, 'maroc', '1GB_7days')
  assert.equal(s.events().length, 1)
  assert.equal(s.events()[0][3].num_items, 1)
  assert.equal(s.events()[0][3].value, 6)
  s.context.trackDirectCheckoutEntry(owner, 'maroc', '5GB_30days')
  assert.equal(s.events().length, 2)
  assert.equal(s.events()[1][3].value, 12)
})
test('standalone cart checkout uses all actual line quantities and the total', () => {
  const s = setup()
  s.context.trackCheckoutEntry({}, [ { ...item, quantity: 2 }, { ...item, planKey: '5GB_30days', price: 120 } ])
  assert.equal(s.events()[0][3].num_items, 3)
  assert.equal(s.events()[0][3].value, 24)
})
test('repeat calls and renders deduplicate within a page instance; a new visit can count again', () => {
  const s = setup(), owner = {}
  s.context.trackCheckoutEntry(owner, [item])
  s.context.trackCheckoutEntry(owner, [item])
  assert.equal(s.events().length, 1)
  s.context.trackCheckoutEntry({}, [item])
  assert.equal(s.events().length, 2)
})
test('no consent or withdrawn consent blocks checkout events, with no replay on grant', () => {
  const s = setup('EUR', false)
  assert.equal(s.context.trackCheckoutEntry({}, [item]), false)
  s.context.setMetaMarketingConsent(true)
  assert.equal(s.events().length, 0)
  s.context.trackCheckoutEntry({}, [item])
  s.context.setMetaMarketingConsent(false)
  assert.equal(s.context.trackCheckoutEntry({}, [item]), false)
  assert.equal(s.events().length, 1)
})
test('missing or malformed data never produces invented totals or crashes checkout', () => {
  const s = setup()
  for (const items of [[], null, [null], [{ ...item, price: NaN }], [{ ...item, price: -5 }],
    [{ ...item, currency: 'XYZ' }], [{ ...item, planKey: '' }], [{ ...item, quantity: 0 }]]) {
    assert.equal(s.context.trackCheckoutEntry({}, items), false)
  }
  assert.equal(s.context.trackDirectCheckoutEntry({}, 'missing', 'missing'), false)
  assert.equal(s.events().length, 0)
})
test('all 32 localized destination handlers fire only after selection opens same-page checkout', () => {
  let count = 0
  for (const locale of ['en', 'fr', 'ar', 'dutch']) {
    for (const file of fs.readdirSync(path.join(__dirname, `../src/pages/${locale}/esim`))) {
      const source = read(`src/pages/${locale}/esim/${file}`)
      if (!source.includes('this.checkoutOpen = true')) continue
      count++
      const slug = source.match(/if \(this.region.slug === '([^']+)'\) \{\s*this.checkoutOpen/)[1]
      const handler = source.match(/handleAddToCart\(plan\) \{([\s\S]*?)\n    \},/)[1]
      const s = setup()
      vm.runInContext(`function select(plan) {${handler}\n}`, s.context)
      const owner = { region: { slug }, $nextTick: callback => callback() }
      assert.equal(s.events().length, 0, `${locale}/${file}: page load`)
      s.context.select.call(owner, { key: '1GB_7days', price: 60 })
      s.context.select.call(owner, { key: '1GB_7days', price: 60 })
      assert.equal(owner.checkoutOpen, true)
      assert.equal(s.events().length, 1, `${locale}/${file}`)
      assert.equal(s.events()[0][2], 'InitiateCheckout')
    }
  }
  assert.equal(count, 32)
})
test('homepage selection fires but restored checkout does not; embedded Cart does not double count', async () => {
  const home = read('src/pages/Home.vue')
  const s = setup()
  const body = home.match(/async function buySelectedPlan\(\) \{([\s\S]*?)\n\}/)[1]
  Object.assign(s.context, { selectedDestination: { value: { slug: 'maroc' } }, selectedPlan: { value: { key: '1GB_7days', price: 60 } }, destinationName: () => 'Morocco', checkoutOpen: { value: false }, snackbar: { value: false }, checkoutTrackingOwner: {}, nextTick: async () => {}, scrollToCheckout() {} })
  vm.runInContext(`async function buy() {${body}\n}`, s.context)
  await s.context.buy()
  await s.context.buy()
  assert.equal(s.events().length, 1)
  assert.ok(!home.match(/onMounted\(\(\) => \{([\s\S]*?)\n\}\)/)[1].includes('trackDirectCheckoutEntry'))
  const cart = read('src/pages/Cart.vue')
  const mounted = cart.match(/async mounted\(\) \{([\s\S]*?)\n  \},/)[1]
  const calls = []
  const context = vm.createContext({ trackCheckoutEntry: (...args) => calls.push(args), window: { addEventListener() {} }, CART_UPDATED_EVENT: 'cart-updated' })
  vm.runInContext(`async function mount() {${mounted}\n}`, context)
  await context.mount.call({ showStepNumbers: true, refreshCart() {}, cart: [item] })
  assert.equal(calls.length, 0)
  await context.mount.call({ showStepNumbers: false, refreshCart() {}, cart: [item] })
  assert.equal(calls.length, 1)
  assert.ok(!read('src/pages/Region.vue').includes('metaCheckout'))
})
