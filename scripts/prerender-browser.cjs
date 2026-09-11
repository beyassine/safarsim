async function serverlessLaunchOptions(puppeteer, chromium) {
  return {
    args: await puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' }),
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  }
}

module.exports = { serverlessLaunchOptions }
