import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables.");
    process.exit(1);
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connetToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };


        console.log("Mongo URI exists:", !!process.env.MONGO_URI);
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => console.log("MongoDB connected ✅"))
            .catch((err) => console.log("MongoDB connection error ❌", err));

    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connetToDatabase;