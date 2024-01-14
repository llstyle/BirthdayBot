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
const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${URL}/api/${TOKEN}`)

cron.schedule('0 * * * *', async () => {
    try {
        const response = await axios.get(`https://www.rada.zp.ua/pozdravleniya/pozdravleniya-s-dnem-rozhdeniya/s-dnem-rozhdeniya-svoimi-slovami`)
        const $ = cheerio.load(response.data)
        const l = $("p").eq(count).text()
        count++
        bot.sendMessage(userId, l)
    } catch(e) {
        console.log(e)
    }
})

app.post(`/api/${TOKEN}` ,(req, res) =>{
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))

