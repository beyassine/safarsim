const test = require('node:test')
const assert = require('node:assert/strict')
const puppeteer = require('puppeteer')
const { serverlessLaunchOptions } = require('../scripts/prerender-browser.cjs')

test('Vercel launch options resolve Puppeteer arguments before launch', async () => {
  const { default: chromium } = await import('@sparticuz/chromium')
  const options = await serverlessLaunchOptions(puppeteer, {
    args: chromium.args,
    executablePath: async () => '/tmp/chromium',
  })
  assert.ok(Array.isArray(options.args))
  assert.ok(options.args.every(arg => typeof arg === 'string'))
  assert.ok(options.args.includes('--no-sandbox'))
  assert.equal(options.executablePath, '/tmp/chromium')
  assert.equal(options.headless, 'shell')
  // This is the operation in ChromeLauncher that failed when args was a Promise.
  assert.doesNotThrow(() => options.args.filter(arg => arg.startsWith('--')))
})
