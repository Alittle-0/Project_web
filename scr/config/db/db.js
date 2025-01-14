const mongoose = require("mongoose");

async function connect() {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URI) 
    console.log('Mongo connected')
  } catch(error) {
    console.log(error)
    process.exit()
  }
}

module.exports = { connect };
