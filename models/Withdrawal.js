import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending','paid','rejected'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    processedAt: { type: Date }
});

export const Withdrawal = mongoose.model('Withdrawal', schema);
