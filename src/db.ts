import { AsyncDatabase } from "promised-sqlite3";

export const db = await AsyncDatabase.open('./words.db')

export async function getRandomWord(){
    return await db.get<Word>('SELECT * FROM dictionary ORDER BY RANDOM() LIMIT 1')
}

export async function createChat(chatId: number, word: string){
    return await db.run('INSERT INTO chats (id, word) VALUES (?, ?)', chatId, word)
}

export async function getChat(chatId: number){
    return await db.get<Chat>('SELECT * FROM chats WHERE id = ?', [chatId])
}

export async function updateChatWord(chatId: number, word: string){
    return await db.run('UPDATE chats SET word = ?, word_given = ? WHERE id = ?', [word, Date.now(), chatId])
}

export async function relativeWords(word: string, searchingWord: string){
    const searchWord = await db.get<Word>('SELECT group_id FROM dictionary WHERE word = ?', searchingWord)

    return await db.all<Word>(`SELECT * FROM dictionary WHERE group_id = ? and word <> ?`, [searchWord.group_id, searchWord.group_id])
}

export async function deleteChat(chatId: number){
    return await db.run('DELETE FROM chats WHERE id = ?', chatId)
}

export async function updateScore(userId: number, time: number){
    return await db.run('UPDATE users SET score = score + 1, reaction = (reaction + ?) / 2 WHERE id = ?', [time, userId])
}

export async function resetScore(userId: number){
    return await db.run('UPDATE users SET score = 0, reaction = 0 WHERE id = ?', userId)
}

export async function getUser(userId: number){
    return await db.get<User>('SELECT * FROM users WHERE id = ?', userId)
}

export async function registerUser(userId: number){
    const user = await getUser(userId)

    if(!user){
        return await db.run('INSERT INTO users (id, score, reaction) VALUES (?, ?, ?)', [userId, 0, 0])
    }
}