export {}


declare global{
    interface Chat{
        id: number;
        word: string;
        word_given: number;
    }
    interface Word{
        word_id: number;
        word: string;
        group_id: number;
    }
    interface User{
        id: number;
        score: number;
        reaction: number;
    }
}

    
