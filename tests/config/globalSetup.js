const db = require('../../src/db/mongoose')

module.exports = async function globalSetup() {
    console.debug('globalSetup')
    await db.connect(`${process.env.MONGODB_URL}?authSource=admin`)

    try {
        await db.mongoose.connection.db.dropDatabase()
        console.debug('MongoDB is dropped')
    } catch (error) {
        console.error("Can't clear MongoDB", error)
    } finally {
        await db.mongoose.disconnect()
    }
}
