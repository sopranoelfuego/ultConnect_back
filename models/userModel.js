const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { v4: uuidv4 } = require('uuid')

const userSchema = new mongoose.Schema(
 {
  username: {
   type: String,
   require: true,
   trim: true,
   min: 3,
   max: 21,
   unique: true,
  },
  // username,email,password,faculte,institut,desc,city,relationship,addresse

  email: {
   type: String,
   required: [true, 'email please'],
   unique: true,
   trim: true,
   match: [
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    'please enter a valid email',
   ],
  },
  gender: {
   type: String,
   required: [true, 'your gender please...'],
   enum: ['M', 'F'],
  },
  password: {
   type: String,
   required: [true, 'password please...'],
   trim: true,
   select: false,
   min: 6,
  },
  schoolYear: {
   type: String,
   required: [true, 'schoolYear please...'],
  },
  profilePicture: {
   type: String,
   trim: true,
   default: '',
  },
  followers: {
   type: Array,
   default: [],
  },
  followings: {
   type: Array,
   default: [],
  },

  faculte: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Faculte',
   required: [true, 'your faculte please'],
  },
  departement: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Departement',
  },
  class: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Class',
  },

  isAdmin: {
   type: Boolean,
   default: false,
  },
  desc: {
   type: String,
   trim: true,
   max: 100,
  },
  addresse: {
   type: String,
   trim: true,
   max: 100,
  },
  dob: {
   type: Date,
  },
  isActive: {
   type: Boolean,
   default: true,
  },
  relationship: {
   type: String,
   enum: ['marie', 'compliquer', 'celibataire'],
   trim: true,
  },
  resetPassordToken: { type: String, trim: true },
  resetPasswordExpire: Number,
 },
 { timestamps: true }
)
userSchema.pre('save', async function (next) {
 if (!this.isModified('password')) {
  next()
 }
 this.password = await bcrypt.hash(this.password, 10)
})

userSchema.pre('remove', async function (next) {
 console.log('deleteOne middlware is fired')
 await this.model('Post').deleteMany({ userId: this._id })
 await this.model('Post').updateMany(
  {},
  {
   $pullAll: { comments: [{ userId: this._id }] },
  }
 )
 await this.model('Post').updateMany(
  {},
  {
   $pullAll: { likes: [this._id] },
  }
 )

 await this.model('User').updateMany(
  {},
  {
   $pullAll: { followings: [this._id] },
  }
 )
 await this.model('User').updateMany(
  {},
  {
   $pullAll: { followers: [this._id] },
  }
 )

 next()
})
userSchema.methods.signWithjsonWebToken = function () {
 return jwt.sign({ id: this?._id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE,
 })
}
userSchema.methods.matchPassword = async function (plainPassword) {
 return await bcrypt.compare(plainPassword, this.password)
}
//  generate and hash password

userSchema.methods.getResetPasswordToken = async function () {
 const resetToken = uuidv4()

 // ENCRYPT
 // resetPassordToken: String,
 // resetPasswordExpire: Number,

 const resetPasswordToken = await bcrypt.hash(resetToken, 10)
 const tok = String(resetPasswordToken).replace(/\./g, '').replace(/\//g, '')

 const expireTime = Date.now() + 30 * 60 * 1000
 this.resetPassordToken = resetPasswordToken
 this.resetPasswordExpire = expireTime
 return tok
}
module.exports = mongoose.model('User', userSchema)
