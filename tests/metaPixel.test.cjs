const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const source = fs.readFileSync(path.join(__dirname, '../src/services/metaPixel.js'), 'utf8')
  .replace(/export /g, '')
function setup(options = {}) {
  const scripts = [], hooks = []
  const window = {}
  const document = {
    querySelector: () => scripts[0],
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  }
  const context = vm.createContext(options.noWindow ? {} : { window, document })
  vm.runInContext(source, context)
  const router = { afterEach: hook => hooks.push(hook) }
  context.installMetaPixelTracking(router)
  const navigate = (path, failure) => hooks.forEach(hook => hook({ path }, {}, failure))
  const calls = () => Array.from(window.fbq?.queue || [], args => Array.from(args))
  const events = () => calls().filter(args => args[0] === 'trackSingle')
  return { context, window, scripts, router, hooks, navigate, calls, events }
}
test('denied by default: no script, init or events, including commerce helpers', () => {
  const s = setup()
  s.navigate('/fr/esim/turkiye')
  assert.equal(s.context.initMetaPixel(), false)
  assert.equal(vm.runInContext('trackPurchase({ value: 10, currency: "EUR" })', s.context), false)
  assert.equal(s.window.fbq, undefined)
  assert.equal(s.scripts.length, 0)
})
test('grant sends current page once; initialization and hook installation are idempotent', () => {
  const s = setup()
  s.navigate('/fr/esim/turkiye')
  s.context.setMetaMarketingConsent(true)
  s.context.setMetaMarketingConsent(true)
  s.context.initMetaPixel()
  s.context.installMetaPixelTracking(s.router)
  s.context.trackPageView()
  assert.equal(s.hooks.length, 1)
  assert.equal(s.scripts.length, 1)
  assert.equal(s.scripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js')
  assert.equal(s.calls().filter(args => args[0] === 'init').length, 1)
  assert.deepEqual(s.calls().find(args => args[0] === 'init'), ['init', '1114292477590208'])
  assert.equal(s.window.fbq.disablePushState, true)
  assert.equal(s.events().length, 1)
  assert.equal(s.events()[0][2], 'PageView')
})
test('initial resolved route, product, locale and back navigation each count once', () => {
  const s = setup()
  s.context.setMetaMarketingConsent(true)
  s.navigate('/fr/esim/turkiye')
  s.navigate('/fr/esim/turkiye') // query/hash only
  s.navigate('/fr/esim/egypt', new Error('aborted'))
  s.navigate('/fr/esim/egypt')
  s.navigate('/nl/esim/morocco')
  s.navigate('/fr/esim/egypt')
  assert.equal(s.events().length, 4)
  assert.ok(s.events().every(args => args[2] === 'PageView'))
})
test('consent grant never replays history; revoke stops events and regrant deduplicates', () => {
  const s = setup()
  s.navigate('/fr/esim/turkiye')
  s.navigate('/fr/esim/egypt')
  s.context.setMetaMarketingConsent(true)
  assert.equal(s.events().length, 1)
  s.context.setMetaMarketingConsent(false)
  s.context.setMetaMarketingConsent(true)
  assert.equal(s.events().length, 1)
  s.context.setMetaMarketingConsent(false)
  s.navigate('/nl/esim/morocco')
  assert.equal(s.events().length, 1)
  s.context.setMetaMarketingConsent(true)
  assert.equal(s.events().length, 2)
  assert.ok(s.calls().some(args => args[0] === 'consent' && args[1] === 'revoke'))
})
test('missing browser, unavailable/throwing fbq and blocked script fail silently', () => {
  const server = setup({ noWindow: true })
  assert.doesNotThrow(() => { server.context.setMetaMarketingConsent(true); server.navigate('/') })
  for (const replacement of [undefined, {}, () => { throw Error('blocked') }]) {
    const s = setup()
    s.navigate('/')
    s.context.setMetaMarketingConsent(true)
    s.window.fbq = replacement
    assert.doesNotThrow(() => s.navigate('/fr'))
    assert.equal(s.context.trackPageView(), false)
  }
  const s = setup()
  s.context.setMetaMarketingConsent(true)
  s.navigate('/')
  s.scripts[0].onerror()
  assert.doesNotThrow(() => s.navigate('/fr'))
  assert.equal(s.context.trackPageView(), false)
  assert.equal(s.scripts.length, 1)
})
test('Meta is installed before router startup and components do not call the pixel directly', () => {
  const main = fs.readFileSync(path.join(__dirname, '../src/main.js'), 'utf8')
  assert.ok(main.indexOf('installMetaPixelTracking(router)') < main.indexOf('.use(router)'))
  const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8')
  assert.ok(!html.includes('fbq'))
  for (const file of fs.readdirSync(path.join(__dirname, '../src'), { recursive: true })) {
    if (!file.endsWith('.vue')) continue
    const component = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8')
    assert.ok(!component.includes('metaPixel'), file)
    assert.ok(!/track(ViewContent|AddToCart|Purchase)\s*\(/.test(component), file)
  }
})
