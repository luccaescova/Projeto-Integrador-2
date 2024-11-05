import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    balance: number;
}

const userSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 }
});

export default mongoose.model<IUser >('User ', userSchema);