import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/e_com";
// const MONGODB_URI = "mongodb+srv://JayuPatel:mernpassmongo@cluster1.hvuu6u9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
// const MONGODB_URI = "mongodb+srv://JayuPatel:mernpassmongo@cluster1.hvuu6u9.mongodb.net/izonnet-e-com";



// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI in .env.local");
// }

// let cached = global.mongoose || { conn: null, promise: null };

// export async function connectDB() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Already connected to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(process.env.LINK);

    console.log("🚀 Successfully connected to MongoDB.");
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
}