import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    totalSeconds:{ 
        type: Number, 
        default: 0 
    },
    updatedAt:{ 
        type: Date, 
        default: Date.now 
    },
    stripeAccountId:{ 
        type: String, 
        default: null 
    } // optional for later payouts
});
export const UserStat = mongoose.model('UserStat', schema);
