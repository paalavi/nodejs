let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let uniqueString = require('unique-string');

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  admin: {type: Boolean, default: 0},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  rememberToken: {type: String, default: null},
}, {timeStamp: true});

userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next()
  }
  catch (err) {
    console.log(err);
    next(new Error(err))
  }
});

userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    this._update.password = await bcrypt.hash(this._update.password, 10);
    next()
  }
  catch (err) {
    console.log(err);
    next(new Error(err))
  }
});

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.setToken = async function (res) {
  let token = uniqueString();
  res.cookie('rememberToken', token, {expires: new Date(Date.now() + 900000), httpOnly: true, signed: true});
  this.update({rememberToken: token}, (err) => console.log(err));
};

module.exports = mongoose.model('User', userSchema);