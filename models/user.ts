import { Schema } from 'mongoose';
import {BoardType} from "../types/GlobalTypes";

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    boards: Array
});

module.exports = userSchema;
