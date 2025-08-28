const puppeteer = require('puppeteer');

async function search(query, type) {
  const url = 'https://www.medicinanet.com/busqueda?q=' + query; // Replace with your target website

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Wait for the search results to load
  await page.waitForSelector('.result-item');

  const results = await page.evaluate(() => {
    const articleElements = Array.from(document.querySelectorAll('.result-item'));
    return articleElements.map(element => {
      const title = element.querySelector('.result-title')?.textContent || 'N/A';
      const description = element.querySelector('.result-description')?.textContent || 'N/A';
      const link = element.querySelector('a')?.href || '#';
      return { type: 'medicamento', name: title, description: description, source: link };
    });
  });

  await browser.close();
  return results;
}

module.exports = { search };
