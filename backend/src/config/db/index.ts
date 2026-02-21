import 'dotenv/config';
import mongoose from 'mongoose';
const db_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/newsdb';

const connectDB = async () => {
    await mongoose.connect(db_uri);
}

export default connectDB