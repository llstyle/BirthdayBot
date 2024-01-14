import "dotenv/config.js";
import express from 'express'
import TelegramBot from "node-telegram-bot-api";
import cron from 'node-cron';
import axios from "axios";
import * as cheerio from 'cheerio';

const TOKEN = process.env.TOKEN
const URL = process.env.URL
const userId = process.env.USER_ID
const PORT = 3000

const app = express();
const bot = new TelegramBot(TOKEN, {webHook: {
    port: 443
}});

app.use(express.json())

app.post(`/api/${TOKEN}`, (req, res) =>{
    console.log(req.body)
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log('SERVER STARTED ON PORT ' + PORT)
    bot.setWebHook(`${URL}/api/${TOKEN}`)
})

cron.schedule('*/30 * * * *', async () => {
    try {
        const response = await axios.get(`https://www.rada.zp.ua/pozdravleniya/pozdravleniya-s-dnem-rozhdeniya/s-dnem-rozhdeniya-svoimi-slovami`)
        const $ = cheerio.load(response.data)
        const text = $("p").eq(count).text()
        count++
        bot.sendMessage(userId, text)
    } catch(e) {
        console.log(e)
    }
})