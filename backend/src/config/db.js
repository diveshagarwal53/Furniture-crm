import mongoose from 'mongoose'

const dbConnection = async (req, res) => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongodb connect successfully ${connect.connection.host}`)
    } catch (error) {
        console.log('MongoDb connection failed', error.message)
        process.exit(1)
    }
}

export default dbConnection