const fs = require('fs')
const http = require('http')
const path = require('path')
const puppeteer = require('puppeteer')

const distDir = path.resolve(__dirname, '..', 'dist')
const port = 4177
const routes = ['/esim/egypt', '/fr/esim/egypt', '/ar/esim/egypt', '/esim/europe', '/fr/esim/europe', '/ar/esim/europe', '/esim/turkiye', '/fr/esim/turkiye', '/ar/esim/turkiye', '/esim/spain', '/fr/esim/spain', '/ar/esim/spain', '/esim/france', '/fr/esim/france', '/ar/esim/france', '/esim/saudi-arabia', '/fr/esim/saudi-arabia', '/ar/esim/saudi-arabia', '/esim/united-arab-emirates', '/fr/esim/united-arab-emirates', '/ar/esim/united-arab-emirates']
const mimeTypes = { '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2' }

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname)
  const requestedFile = path.join(distDir, pathname.replace(/^\//, ''))
  const file = fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()
    ? requestedFile
    : path.join(distDir, 'index.html')
  response.setHeader('Content-Type', mimeTypes[path.extname(file)] || 'application/octet-stream')
  fs.createReadStream(file).pipe(response)
})

async function run() {
  // Vercel's build image does not include all of the shared libraries required
  // by Puppeteer's downloaded Chromium (for example, libnspr4). The Vue build
  // is already complete at this point, so skip this optional SEO enhancement
  // there instead of failing the entire deployment.
  if (process.env.VERCEL) {
    console.log('Skipping Puppeteer prerender on Vercel')
    return
  }

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve))
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })

  try {
    for (const route of routes) {
      const page = await browser.newPage()
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForSelector('.europe-page h1', { timeout: 60000 })
      await page.waitForFunction(() => document.querySelectorAll('.europe-plan-card').length > 0, { timeout: 60000 })
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const html = await page.content()
      const outputDir = path.join(distDir, route.replace(/^\//, ''))
      fs.mkdirSync(outputDir, { recursive: true })
      fs.writeFileSync(path.join(outputDir, 'index.html'), html)
      await page.close()
      console.log(`Prerendered ${route}`)
    }
  } finally {
    await browser.close()
    server.close()
  }
}

run().catch((error) => {
  server.close()
  console.error(error)
  process.exitCode = 1
})
