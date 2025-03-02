import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-z0-9.]{2,50}@gmail.com$/.test(v)
      },
    },
  },
  passwd: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
})

userSchema.index({ username: 1 }, { unique: true })
userSchema.index({ email: 1 }, { unique: true })

export default mongoose.model('user', userSchema)
