const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//User schema mongoose pour mail et mdp
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Apply the uniqueValidator plugin to userSchema
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);