import mongoose from "mongoose";

//Step 1
const MONGODB_URI = process.env.MONGODB_URI;

//a collection in MOngoDB is a group of related data (like a table in mysql)
//mongoose is a Object Data Modeling (ODM) library for MongoDB rather than a traditional SQL-based ORM -> schema-based solution to model the  application data

//Step 2 - mongoose initial setup
interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
	global.mongoose = cached;
}

//Step 3 - connect to db
async function connectDB() {
	if (!MONGODB_URI) {
		throw new Error("Please define the MONGODB_URI env variable inside .env");
	}
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.conn) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default connectDB;
