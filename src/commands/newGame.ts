import TelegramBot, { Message } from 'node-telegram-bot-api'
import { getChat, getRandomWord, updateChatWord, createChat, registerUser } from '../db.js';

export async function newGame(bot: TelegramBot, message: Message){
    const chatId = message.chat.id;
    const userId = message.from.id;
    
    const chat = await getChat(chatId)
    
    await registerUser(userId)

    const word = await getRandomWord()

    //проверяем чат в базе
    if(chat){
        await updateChatWord(chatId, word.word)
    }else{
        await createChat(chatId, word.word)
    }

    bot.sendMessage(chatId, `Тренировка начата!\n\nНайдите пароним для слова <b>${word.word}</b>`, {parse_mode: 'HTML'})
}