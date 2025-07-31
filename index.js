import express from 'express';
import axios from 'axios';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});


const PORT = 3001;
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API çalışıyor!');
});
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
app.post('/test', (req, res) => {
  console.log(req.body); 
  res.json({ message: 'Veri alındı', data: req.body });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akcanboray@gmail.com',
    pass: 'bswq hbjt kxpa coug'
  }
});

const mailOptions = {
  from: 'akcanboray@gmail.com',
  to: 'borayakcann@gmail.com',
  
  subject: "Gs Store'daki Bordo Polo Yaka 🟥🟨🟥🟨🟥🟨",
  text: 'Stoğu yokmuş \nhttps://www.gsstore.org/galatasaray-5-yildiz-klasik-logo-polo-t-shirt-e251403-7/'
};


async function stokontrol() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = "https://www.gsstore.org/galatasaray-5-yildiz-klasik-logo-polo-t-shirt-e251403-7/";

  try {
    
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const inStock = await page.evaluate(() => {
      return window.GLOBALS?.in_stock ?? false;
    });

    console.log(`[${new Date().toLocaleTimeString()}] Stok durumu:`, inStock ? "STOKTA VAR" : " Yok");

    
    if (inStock==false) {
      await transporter.sendMail(mailOptions);
      console.log("Mail yollandı");
    }
  } catch (error) {
    console.error("Hata oluştu:", error.message);
  } finally {
    await browser.close();
  }
}




cron.schedule("0 12 * * *",async () =>{
  console.log("Calısıyo");
  await stokontrol();
  
});

stokontrol();


