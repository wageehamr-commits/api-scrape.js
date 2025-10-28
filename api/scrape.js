import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL parameter");

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Extract the NAV from the page using text search or regex
    const html = await page.content();
    await browser.close();

    // Example: regex to extract the value like 832.457
    const navMatch = html.match(/(\d{1,3}\.\d{1,3})/);
    const nav = navMatch ? navMatch[0] : "NAV not found";

    res.status(200).json({ nav });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error running Puppeteer: " + err.message);
  }
}
