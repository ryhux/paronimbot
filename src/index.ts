/// <reference path="types/interfaces.d.ts" />

import TelegramBot from "node-telegram-bot-api"
import "dotenv/config.js";

import { newGame } from "./commands/newGame.js";
import { finishGame } from "./commands/finishGame.js";
import { validateWord } from "./commands/wordValidator.js";
import { getStats } from './commands/stats.js'
import { resetStats } from './commands/resetStats.js'

const bot = new TelegramBot(process.env.token, {
    polling: true
})

bot.addListener('text', async (message) => {
    if(message.text?.startsWith('/new') || message.text?.startsWith('/start')){
        //запускаем новую игру
        await newGame(bot, message)
    }else if(message.text?.startsWith('/finish')){
        //завершаем игру (если начата)
        await finishGame(bot, message)
    }else if(message.text?.startsWith('/stats')){
        //картинка со статистикой
        await getStats(bot, message)
    }else if(message.text?.startsWith('/resetStats') || message.text?.startsWith('/resetstats')){
        //сброс статистики
        await resetStats(bot, message)
    }else{
        //проверяем слова
        await validateWord(bot, message)
    }
})