import TelegramBot, { Message } from "node-telegram-bot-api";
import { getUser, registerUser } from "../db.js";
import { createCanvas, Image } from "canvas";

export async function getStats(bot: TelegramBot, message: Message){
    const chatId = message.chat.id;
    const userId = message.from.id;

    //на всякий случай
    await registerUser(userId)

    const user = await getUser(userId)
    
    const stats = await getStatsImage(message.from.first_name, user.score, user.reaction)

    await bot.sendPhoto(chatId, stats, {
        caption: `${message.from.first_name}, вот твоя статистика`
    })
}

//создание картинки со статистикой
function getStatsImage(first_name: string, score: number, reaction: number){
    return new Promise<Buffer>((resolve, reject) => {
        const canvas = createCanvas(600, 300);
    
        const context = canvas.getContext('2d');
        context.fillStyle = '#212121';
        context.fillRect(0, 0, 600, 300);

        context.fillStyle = '#fff'
        context.font = '24px sans-serif';
        context.textAlign = 'start'
        context.fillText(first_name, 10, 30);

        context.fillStyle = 'rgba(255, 255, 255, 0.8)'
        context.font = '20px sans-serif';
        context.textAlign = 'end'
        context.fillText('@paronimbot', 590, 30);
    
        context.fillStyle = '#fff';
        context.font = '36px sans-serif';
        context.textAlign = 'start';
        context.fillText(String(score), 10, 200);
    
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.font = '24px sans-serif';
        context.textAlign = 'start';
        context.fillText('Счет', 10, 150);

        context.fillStyle = '#fff';
        context.font = '36px sans-serif';
        context.textAlign = 'end';
        context.fillText(`${(reaction / 1000).toFixed(2)}с`, 590, 200);
    
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.font = '24px sans-serif';
        context.textAlign = 'end';
        context.fillText('Среднее время ответа', 590, 150);

        resolve(canvas.toBuffer())
    })
  }