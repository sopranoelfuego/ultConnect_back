const mongoose=require('mongoose')




const institutSchema=new mongoose.Schema({
   name:{
       type:String,
       required: [true,'name please...']
   },
   departementId:{
       type:mongoose.Schema.ObjectId,
       rel:'Departement'
   }
})


module.exports = mongoose.model('Institut',institutSchema)