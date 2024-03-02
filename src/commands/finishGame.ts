import TelegramBot, { Message } from 'node-telegram-bot-api'
import { getChat, deleteChat, registerUser } from '../db.js';

export async function finishGame(bot: TelegramBot, message: Message){
    const chatId = message.chat.id;
    const userId = message.from.id;
    
    const chat = await getChat(chatId)

    await registerUser(userId)

    if(chat){
        await deleteChat(chatId)
        bot.sendMessage(chatId, `Тренировка завершена!\n\nЧтобы продолжить тренировку используй /new`, {parse_mode: 'HTML'})
    }
}