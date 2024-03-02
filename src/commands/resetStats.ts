import TelegramBot, { Message } from "node-telegram-bot-api";
import { resetScore } from '../db.js'

export async function resetStats(bot: TelegramBot, message: Message) {
    const userId = message.from.id
    const chatId = message.chat.id

    await resetScore(userId)
    await bot.sendMessage(chatId, 'Статистика сброшена!')
}