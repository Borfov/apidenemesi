
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import puppeteer from 'puppeteer';
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
console.log(puppeteer.executablePath());
app.get('/', (req, res) => {
  res.send('API çalışıyor!');
});

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aaaaaaaaaa@gmail.com',
    pass: " "
  }
});
//                                       Mail tanımlama ve ayarlama bölümü.
const mailOptions = {
  from: 'aaaaaaaaaaa@gmail.com',
  to: 'xxxxxxxxxxx@gmail.com',
  
  subject: "Gs Store'daki Bordo Polo Yaka 🟥🟨🟥🟨🟥🟨",
  text: 'Stoğu yokmuş \nhttps://www.gsstore.org/galatasaray-5-yildiz-klasik-logo-polo-t-shirt-e251403-7/'
};






async function stokontrol() {
  const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
                                                     //  Stok kontrolü fonksiyonu

  const url = "https://www.gsstore.org/galatasaray-5-yildiz-klasik-logo-polo-t-shirt-e251403-7/";

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const inStock = await page.evaluate(() => {
      return window.GLOBALS?.in_stock ?? false;
    });

    console.log(`[${new Date().toLocaleTimeString()}] Stok durumu:`, inStock ? "STOKTA VAR" : " Yok");

    
    if (inStock) {
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
   //                                     Node-cron ile oluşturulan zamanlayıcı.
});

stokontrol();


