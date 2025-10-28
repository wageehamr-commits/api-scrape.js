import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).send("Missing URL");
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  const html = await page.content();
  await browser.close();

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

