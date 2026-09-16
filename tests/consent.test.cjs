const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { reactive, readonly } = require('vue')
const { createRouter, createMemoryHistory } = require('vue-router')
const key = 'safarsim:consent:v1'
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
const source = ['src/services/metaPixel.js', 'src/services/consent.js'].map(file =>
  read(file).replace(/^import .*$/gm, '').replace(/export /g, '')).join('\n')
function setup(saved, options = {}) {
  const storage = new Map(saved === undefined ? [] : [[key, saved]])
  const scripts = [], google = [], listeners = {}
  const window = {
    localStorage: {
      getItem: k => { if (options.blockStorage) throw Error('blocked'); return storage.get(k) ?? null },
      setItem: (k, value) => { if (options.blockStorage) throw Error('blocked'); storage.set(k, value) },
    },
    gtag: (...args) => { if (options.blockGoogle) throw Error('blocked'); google.push(args) },
    addEventListener: (type, callback) => { listeners[type] = callback },
  }
  const document = {
    querySelector: () => scripts[0], createElement: () => ({}),
    head: { appendChild: s => scripts.push(s) },
  }
  const context = vm.createContext({ window, document, reactive, readonly })
  vm.runInContext(source, context)
  const hooks = []
  context.installMetaPixelTracking({ afterEach: hook => hooks.push(hook) })
  context.initConsent()
  const state = () => vm.runInContext('consentState', context)
  const navigate = (path, failure) => hooks.forEach(hook => hook({ path }, {}, failure))
  const calls = () => Array.from(window.fbq?.queue || [], args => Array.from(args))
  const events = () => calls().filter(args => args[0] === 'trackSingle')
  return { context, window, state, storage, scripts, google, listeners, navigate, calls, events }
}
const saved = marketing => JSON.stringify({ version: 1, marketing, savedAt: Date.now() })
function assertGoogle(s, permission) {
  assert.deepEqual(JSON.parse(JSON.stringify(s.google.at(-1))), ['consent', 'update', {
    ad_storage: permission, ad_user_data: permission, ad_personalization: permission,
  }])
}
test('first visit stays denied with a visible banner and no Meta library or PageViews', () => {
  const s = setup()
  s.navigate('/fr/')
  assert.equal(s.state().visible, true)
  assert.equal(s.state().choice, null)
  assert.equal(s.window.fbq, undefined)
  assert.equal(s.scripts.length, 0)
  assertGoogle(s, 'denied')
})
test('accepting grants both platforms and sends the current PageView without refresh once', () => {
  const s = setup()
  s.navigate('/fr/')
  s.context.chooseConsent(true)
  s.context.chooseConsent(true)
  s.context.initConsent()
  assert.equal(typeof s.window.fbq, 'function')
  assert.equal(s.scripts.length, 1)
  assert.equal(s.scripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js')
  assert.equal(s.calls().filter(args => args[0] === 'init').length, 1)
  assert.equal(s.events().length, 1)
  assert.equal(s.state().visible, false)
  assert.equal(JSON.parse(s.storage.get(key)).marketing, true)
  assertGoogle(s, 'granted')
  s.navigate('/fr/esim/turkiye')
  s.navigate('/fr/esim/turkiye')
  s.navigate('/fr/esim/egypt', new Error('cancelled'))
  s.navigate('/fr/esim/egypt')
  s.navigate('/nl/esim/morocco')
  assert.equal(s.events().length, 4)
  assert.ok(s.events().every(args => args[2] === 'PageView'))
})
test('rejection hides the banner, persists and never loads Meta', () => {
  const s = setup()
  s.navigate('/fr/')
  s.context.chooseConsent(false)
  s.navigate('/fr/esim/turkiye')
  assert.equal(s.state().visible, false)
  assert.equal(s.window.fbq, undefined)
  assert.equal(JSON.parse(s.storage.get(key)).marketing, false)
  assertGoogle(s, 'denied')
})
test('saved acceptance initializes at startup, before the first resolved route, then sends once', () => {
  const s = setup(saved(true))
  assert.equal(typeof s.window.fbq, 'function')
  assert.equal(s.state().visible, false)
  assert.equal(s.events().length, 0)
  s.navigate('/nl/esim/morocco')
  s.navigate('/nl/esim/morocco')
  assert.equal(s.events().length, 1)
  assertGoogle(s, 'granted')
})
test('saved rejection restores denied without showing the banner', () => {
  const s = setup(saved(false))
  s.navigate('/fr/')
  assert.equal(s.state().visible, false)
  assert.equal(s.state().choice, false)
  assert.equal(s.window.fbq, undefined)
  assertGoogle(s, 'denied')
})
test('settings can reopen; withdrawal stops events and regrant does not duplicate current page', () => {
  const s = setup(saved(true))
  s.navigate('/fr/')
  s.context.openConsentSettings()
  assert.equal(s.state().visible, true)
  assertGoogle(s, 'granted')
  s.context.closeConsentSettings()
  assert.equal(s.state().visible, false)
  s.context.openConsentSettings()
  s.context.chooseConsent(false)
  assertGoogle(s, 'denied')
  assert.ok(s.calls().some(args => args[0] === 'consent' && args[1] === 'revoke'))
  s.context.chooseConsent(true)
  assert.equal(s.events().length, 1)
  s.context.chooseConsent(false)
  s.navigate('/fr/esim/turkiye')
  s.navigate('/fr/esim/egypt')
  assert.equal(s.events().length, 1)
  s.context.chooseConsent(true)
  assert.equal(s.events().length, 2) // current page only, no denied-history replay
  assert.equal(s.scripts.length, 1)
})
test('invalid, expired and future storage fails closed; storage/tag failures do not break choices', () => {
  for (const value of ['bad json', '{}', 'null', saved('true'),
    JSON.stringify({ version: 2, marketing: true, savedAt: Date.now() }),
    JSON.stringify({ version: 1, marketing: true, savedAt: 1 }),
    JSON.stringify({ version: 1, marketing: true, savedAt: Date.now() + 100000 })]) {
    const s = setup(value)
    assert.equal(s.state().visible, true)
    assert.equal(s.window.fbq, undefined)
  }
  const s = setup(undefined, { blockStorage: true, blockGoogle: true })
  s.navigate('/fr/')
  assert.doesNotThrow(() => s.context.chooseConsent(true))
  assert.equal(s.events().length, 1)
  assert.doesNotThrow(() => s.context.chooseConsent(false))
  s.navigate('/fr/esim/turkiye')
  assert.equal(s.events().length, 1)
})
test('consent changes and storage removal in another tab update both platforms', () => {
  const s = setup(saved(true))
  s.navigate('/fr/')
  s.storage.set(key, saved(false))
  s.listeners.storage({ key })
  s.navigate('/fr/esim/egypt')
  assert.equal(s.events().length, 1)
  assertGoogle(s, 'denied')
  s.storage.clear()
  s.listeners.storage({ key: null })
  assert.equal(s.state().visible, true)
  assert.equal(s.state().choice, null)
})
test('real Vue Router resolves redirects and rejects duplicate/hash/query PageViews', async () => {
  const s = setup(saved(true))
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/', redirect: '/fr/' },
    { path: '/:pathMatch(.*)*', component: {} },
  ] })
  s.context.installMetaPixelTracking(router)
  await router.push('/')
  await router.isReady()
  await router.push('/fr/')
  await router.push('/fr/?utm_source=test')
  await router.push('/fr/?utm_source=test#plans')
  assert.equal(s.events().length, 1)
  await router.push('/fr/esim/egypt')
  await router.push('/nl/esim/morocco')
  await router.push('/fr/')
  assert.equal(s.events().length, 4)
})
test('startup connects the actual consent service before async loading and router startup', () => {
  const main = read('src/main.js')
  assert.match(main, /import \{ initConsent \} from "\.\/services\/consent"/)
  assert.ok(main.indexOf('initConsent()') < main.indexOf('await loadCatalog()'))
  assert.ok(main.indexOf('installMetaPixelTracking(router)') < main.indexOf('initConsent()'))
  assert.ok(main.indexOf('initConsent()') < main.indexOf('.use(router)'))
  assert.match(read('src/App.vue'), /<ConsentBanner\s*\/>/)
  assert.match(read('src/components/layout/Footer.vue'), /@click="openConsentSettings"/)
  for (const locale of ['en', 'fr', 'nl', 'ar']) {
    const messages = JSON.parse(read(`src/i18n/${locale}.json`)).consent
    for (const key of ['title', 'description', 'accept', 'reject', 'settings', 'close']) assert.ok(messages[key]?.trim())
  }
})
