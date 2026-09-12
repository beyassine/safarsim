const fs = require('fs')
const http = require('http')
const path = require('path')
const puppeteer = require('puppeteer')
const { serverlessLaunchOptions } = require('./prerender-browser.cjs')

const distDir = path.resolve(__dirname, '..', 'dist')
const port = 4177
const routes = ['/esim/morocco', '/fr/esim/morocco', '/ar/esim/morocco', '/esim/egypt', '/fr/esim/egypt', '/ar/esim/egypt', '/esim/europe', '/fr/esim/europe', '/ar/esim/europe', '/esim/turkiye', '/fr/esim/turkiye', '/ar/esim/turkiye', '/esim/spain', '/fr/esim/spain', '/ar/esim/spain', '/esim/france', '/fr/esim/france', '/ar/esim/france', '/esim/saudi-arabia', '/fr/esim/saudi-arabia', '/ar/esim/saudi-arabia', '/esim/united-arab-emirates', '/fr/esim/united-arab-emirates', '/ar/esim/united-arab-emirates']
routes.push(...routes.filter((route) => route.startsWith('/esim/')).map((route) => `/nl${route}`))
const mimeTypes = { '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2' }

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname)
  const requestedFile = path.join(distDir, pathname.replace(/^\//, ''))
  const indexFile = path.join(requestedFile, 'index.html')
  const file = fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()
    ? requestedFile
    : fs.existsSync(indexFile) ? indexFile : path.join(distDir, 'index.html')
  response.setHeader('Content-Type', mimeTypes[path.extname(file)] || 'application/octet-stream')
  fs.createReadStream(file).pipe(response)
})

async function run() {
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
  let browser

  try {
    const options = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    if (process.env.VERCEL && process.platform === 'linux') {
      const { default: chromium } = await import('@sparticuz/chromium')
      Object.assign(options, await serverlessLaunchOptions(puppeteer, chromium))
    }
    browser = await puppeteer.launch(options)
    for (const route of routes) {
      const page = await browser.newPage()
      // Keep the build deterministic and avoid analytics/payment side effects.
      await page.setRequestInterception(true)
      page.on('request', (request) => {
        const url = new URL(request.url())
        if (url.origin === `http://127.0.0.1:${port}` || ['data:', 'blob:'].includes(url.protocol)) request.continue()
        else request.abort()
      })
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForSelector('.europe-page h1', { timeout: 60000 })
      await page.waitForFunction(() => document.querySelectorAll('.europe-plan-card').length > 0, { timeout: 60000 })
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      await page.waitForFunction(() => !!document.querySelector('script[type="application/ld+json"]'), { timeout: 15000 })
      const content = await page.evaluate(() => ({
        title: document.title,
        heading: document.querySelector('h1')?.textContent.trim(),
        plans: document.querySelectorAll('.europe-plan-card').length,
        text: document.querySelector('.europe-page')?.textContent.length || 0,
        lang: document.documentElement.lang,
      }))
      const locale = route.startsWith('/nl/') ? 'nl' : route.startsWith('/fr/') ? 'fr' : route.startsWith('/ar/') ? 'ar' : 'en'
      if (!content.heading || content.plans < 1 || content.text < 1000 || content.lang !== locale) {
        throw new Error(`Incomplete prerender for ${route}: ${JSON.stringify(content)}`)
      }
      // The destination content is available without JS; the SPA-only notice is misleading here.
      await page.evaluate(() => document.querySelectorAll('noscript').forEach(node => node.remove()))
      const html = await page.content()
      const outputDir = path.join(distDir, route.replace(/^\//, ''))
      fs.mkdirSync(outputDir, { recursive: true })
      fs.writeFileSync(path.join(outputDir, 'index.html'), html)
      await page.close()
      const crawler = await browser.newPage()
      await crawler.setJavaScriptEnabled(false)
      await crawler.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded' })
      const rendered = await crawler.evaluate(() => ({
        heading: document.querySelector('h1')?.textContent.trim(),
        plans: document.querySelectorAll('.europe-plan-card').length,
        titles: document.querySelectorAll('head title').length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      }))
      if (rendered.titles !== 1 || rendered.heading !== content.heading || rendered.plans !== content.plans || rendered.canonical !== `https://safarsim.net${route}`) {
        throw new Error(`JavaScript-disabled crawl failed for ${route}: ${JSON.stringify(rendered)}`)
      }
      await crawler.close()
      console.log(`Prerendered ${route}`)
    }
  } finally {
    if (browser) await browser.close()
    server.close()
  }
}

run().catch((error) => {
  server.close()
  console.error(error)
  process.exitCode = 1
})
