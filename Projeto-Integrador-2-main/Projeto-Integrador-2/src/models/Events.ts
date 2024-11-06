import mongoose, { Document, Schema } from 'mongoose';

interface IEvent extends Document {
    name: string;
    status: string;
    date: Date;
    owner: mongoose.Schema.Types.ObjectId;
    bets: Array<{ user: mongoose.Schema.Types.ObjectId; amount: number }>;
}

const eventSchema: Schema = new Schema({
    name: { type: String, required: true },
    status: { type: String, default: 'pending' }, // 'pending', 'approved', 'finished'
    date: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
    bets: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' }, amount: Number }]
});

export default mongoose.model<IEvent>('Event', eventSchema);