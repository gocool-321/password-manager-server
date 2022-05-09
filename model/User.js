const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
	userid: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minLength: 8 },
	pin: { type: Number, required: true, min: 4 },
	pinSession: { type: Boolean, default: false },
	date_created: { type: Date, default: Date.now }
})

userSchema.pre('save', async function (next) {
	// Hash the Password before saving the user model
	const user = this
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next()
})

userSchema.statics.findByCredentials = async (email, password) => {
	// Search for a user by req no and Password.
	const user = await User.findOne({ email })
	if (!user) {
		return null
	} else {
		const isPasswordMatch = await bcrypt.compare(password, user.password)
		if (!isPasswordMatch) {
			return null
		} else {
			return user
		}
	}
}

const User = mongoose.model('users', userSchema)
module.exports = User