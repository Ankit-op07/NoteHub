import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Compound index to ensure unique user-note pairs and fast queries
favoriteSchema.index({ user: 1, note: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);