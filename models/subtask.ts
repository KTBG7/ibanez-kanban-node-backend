const connectToDb = require('../util/database');

class Subtask{
    title: string;
    isCompleted: boolean;
    constructor(title: string, isCompleted= false) {
        this.title = title;
        this.isCompleted = isCompleted;
    }

    save
}