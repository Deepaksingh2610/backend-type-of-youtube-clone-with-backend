import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


const connectDB = async () => {
    try {
      const ConnectionInstances =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`\n MongoDB connected !! DB Host: ${ConnectionInstances.connection.host}`)
    } catch (error) {
        console.log("MONGODM CONNCETION ERROR", error);
        process.exit(1)
    }
}

export default connectDB