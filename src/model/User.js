import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
    discordId: {
        type: String
    },
    urls: [{
        url: String,
        sizes: [String]
    }]
});

const User = mongoose.model('User', schema);
export default User;