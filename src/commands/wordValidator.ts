import TelegramBot, { Message } from "node-telegram-bot-api";
import { getChat, relativeWords, getRandomWord, updateChatWord, resetScore, registerUser, updateScore } from "../db.js";

export async function validateWord(bot: TelegramBot, message: Message){
    const chatId = message.chat.id;
    const userId = message.from.id
    const messageText = message.text?.split(' ')[0].trim().toLowerCase()!;

    //пропускаем сообщения без возможных паронимов 
    if(!/^[а-яА-ЯёЁ]+$/u.test(messageText)){
        return;
    }

    //получаем чат
    const chat = await getChat(chatId)

    //если чата нет, то и игра не начата, поэтому игнорируем
    if(!chat){
        return;
    }

    //игнорируем заданное слово
    if(chat.word == messageText){
        return;
    }

    //проверяем есть ли паронимы у этого слова 
    const words = await relativeWords(messageText, chat.word)

    if(words.length == 0 || !words.map(word => word.word).includes(messageText)){
        bot.sendMessage(chatId, `Слово <b>${messageText}</b> не является паронимом для слова <b>${chat.word}</b>...`, {parse_mode: 'HTML'})
        return;
    }

    //задаем новое слово
    const newWord = await getRandomWord()

    await updateChatWord(chatId, newWord.word)

    //на всякий случай
    await registerUser(userId)

    await updateScore(userId, Date.now() - chat.word_given)

    bot.sendMessage(chatId, `Правильно!\n\nСлово <b>${messageText}</b> является паронимом для слова <b>${chat.word}</b>.\n\nНайдите пароним для слова <b>${newWord.word}</b>.`, {parse_mode: 'HTML'})
}

