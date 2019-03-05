let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let uniqueString = require('unique-string');

const resetPasswordSchema = new mongoose.Schema({
  use: {type: Boolean, default: false},
  email: {type: String, required: true},
  token: {type: String},
});

// resetPasswordSchema.pre('save', async function (next) {
//   try {
//     this.password = await bcrypt.hash(this.password, 10);
//     next()
//   }
//   catch (err) {
//     console.log(err);
//     next(new Error(err))
//   }
// });
//
// resetPasswordSchema.methods.validatePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };
//
// resetPasswordSchema.methods.setToken = async function (res) {
//   let token = uniqueString();
//   res.cookie('rememberToken', token, {expires: new Date(Date.now() + 900000), httpOnly: true, signed: true});
//   this.update({token: token}, (err) => console.log(err));
// };

module.exports = mongoose.model('resetPassword', resetPasswordSchema);