const mongoose = require('mongoose')

const dbConnect = async () => {
 try {
  const con = await mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false,
  })
  console.log(`connected to the database`.cyan.bold)
 } catch (error) {
  console.log(error.message)
 }
}


module.exports = dbConnect
