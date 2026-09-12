const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const en = require('../src/i18n/en.json')
const nl = require('../src/i18n/nl.json')

function flatten(value, prefix = '') {
  return Object.entries(value).flatMap(([key, item]) => {
    const name = prefix ? `${prefix}.${key}` : key
    return typeof item === 'string' ? [[name, item]] : flatten(item, name)
  })
}

test('Dutch covers every shared message and preserves interpolation variables', () => {
  const english = Object.fromEntries(flatten(en))
  const dutch = Object.fromEntries(flatten(nl))
  assert.deepEqual(Object.keys(dutch).sort(), Object.keys(english).sort())
  for (const [key, value] of Object.entries(dutch)) {
    assert.ok(value.trim(), key)
    assert.deepEqual(value.match(/\{[^}]+\}/g) || [], english[key].match(/\{[^}]+\}/g) || [], key)
  }
})

test('Dutch page files cover the same destinations, guides and policies as English', () => {
  const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? pages(path.join(dir, entry.name)).map((name) => `${entry.name}/${name}`) : [entry.name]
  ).sort()
  assert.deepEqual(pages(path.join(__dirname, '../src/pages/dutch')), pages(path.join(__dirname, '../src/pages/en')))
})

test('Dutch names work for catalog entries without Dutch translations', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/utils/localizedNames.js'), 'utf8')
    .replace(/^import .*$/m, '').replaceAll('export function', 'function')
  const context = vm.createContext({ Intl, i18n: { global: { locale: 'nl' } } })
  vm.runInContext(source, context)
  assert.equal(context.getLocalizedName({ iso: 'DE', names: { en: 'Germany', fr: 'Allemagne' } }), 'Duitsland')
  assert.equal(context.getLocalizedName({ slug: 'asie', names: { en: 'Asia' } }), 'Azië')
  assert.equal(context.getLocalizedName({ iso: 'FR', names: { nl: 'Frankrijk' } }), 'Frankrijk')
  assert.ok(context.getLocalizedSearchValues({ iso: 'DE', name: 'Allemagne' }).includes('Duitsland'))
})

test('Dutch browser preference and remembered selection are supported', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/i18n/index.js'), 'utf8')
    .replace(/^import .*$/gm, '').replaceAll('export function', 'function').replace('export default i18n', '')
  const storage = new Map()
  const context = vm.createContext({
    Intl, navigator: { languages: ['nl-NL'], language: 'nl-NL' },
    fr: {}, en: {}, ar: {}, nl: {}, createI18n: (options) => ({ global: options }),
    localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    sessionStorage: { setItem() {} },
  })
  vm.runInContext(source, context)
  assert.equal(context.getDefaultLanguage(), 'nl')
  context.rememberLanguage('nl')
  assert.equal(context.getPreferredLanguage(), 'nl')
})
