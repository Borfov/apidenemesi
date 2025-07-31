const express = require('express');
const app = express();
const axios = require('axios');
const nodemailer=require('nodemailer');
const cron=require('node-cron');
const cheerio=require('cheerio');
const puppeteer = require('puppeteer')

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




























/*async function stokontrol() {
  try {
    const url="https://www.gsstore.org/galatasaray-5-yildiz-klasik-logo-polo-t-shirt-e251403-7/?OM.zn=yeni-gelen-urunler&OM.zpc=E251403"
    
    const yanit = await axios.get(url);
    const $ = cheerio.load(yanit.data);

    
    const stokyazisi = $('span.pz-button__text').toArray().some(el => $(el).text().trim() === 'Haber Ver');

        
    if(stokyazisi){
      console.log("ürün stokta yok");
      transporter.sendMail(mailOptions, (error, info) => {
        

         if (error) {
         return console.log(error);
          }
         console.log('E-posta gönderildi: ' + info.response);
    });

    }




  } catch (hata) {
    console.error('Hata oluştu:', hata.message);
  }
}*/



/*cron.schedule("* * * * *",async()=>{
  await stokontrol();
  
  if(x>25)
  transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('E-posta gönderildi: ' + info.response);
});
  
})*/









