import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//     console.error("MONGODB_URI is not defined in environment variables.");
//     process.exit(1);
// }

// let cached = global.mongoose;

// if (!cached) {
//     cached = global.mongoose = { conn: null, promise: null };
// }

// async function connetToDatabase() {
//     if (cached.conn) {
//         return cached.conn;
//     }

//     if (!cached.promise) {
//         const opts = {
//             bufferCommands: true,
//             maxPoolSize: 10,
//         };


//         console.log("Mongo URI exists:", !!process.env.MONGO_URI);
//         mongoose.connect(String(process.env.MONGO_URI))
//             .then(() => console.log("MongoDB connected ✅"))
//             .catch((err) => console.log("MongoDB connection error ❌", err));

//     }

//     try {
//         cached.conn = await cached.promise;
//     } catch (error) {
//         cached.promise = null;
//         throw error;
//     }

//     return cached.conn;
// }

// export default connetToDatabase;



const connetToDatabase = async () => {
    try {
        const { connections } = await mongoose.connect(String(process.env.MONGODB_URI));
        if (connections[0].readyState === 1) {
            console.log(
                `Database connection established on host ${connections[0].host} `
            );
        }
    } catch (err) {
        console.log("MongoDB connection error ❌", err);
    }
};

export default connetToDatabase;