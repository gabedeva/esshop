const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        },

        email: {
            type: String,
            required: [true, 'email is required'],
            unique: [true, 'Email already exist'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'a valid email is required',
            ],
        },

		password: {
			type: String,
			required: [false, 'password is required'], 
			minlength: 8,
			select: false
		},
		
		passwordHash: {
			type: String,
			required: false
		},

		phone: {
			type: String,
			required: true
		},

		isAdmin: {
			type: Boolean,
			default: false
		},

		street: {
			type: String,
			required: false
		},
		apartment: {
			type: String,
			required: false
		},

		zip: {
			type: String,
			required: false
		},
		
		city: {
			type: String,
			required: false
		},
		couuntry: {
			type: String,
			required: false
		},
		phone: {
			type: String,
			reqquired: [true, 'Phone number is required']
		},


        activationToken: String,
        activationTokenExpire: Date,
        resetPassword: String,
        resetPasswordTokenExpire: Date,

        profilePic: {
        type: String,
        default: "",
        },

        isAdmin: {
			type: Boolean,
			default: false
		},

		isActive: {
			type: Boolean,
			default: false
		},
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id
            }
        }
    }
);


UserSchema.set ('toJSON', {getters: true, virtuals: true});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match user password
UserSchema.methods.matchPassword = async function (pass) {
	return await bcrypt.compare(pass, this.password);
};

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash the token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

	return resetToken;
};

//Generate and hash activation token
UserSchema.methods.getActivationToken = function () {
	// Generate token
	const activateToken = crypto.randomBytes(20).toString('hex');

	// Hash the token and set to resetPasswordToken field
	this.activationToken = crypto
		.createHash('sha256')
		.update(activateToken)
		.digest('hex');

	// Set expire
	this.activationTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

	return activateToken;
};

// Find out if user has a role
UserSchema.methods.hasRole = (role, roles) => {
	let flag = false;
	for (let i = 0; i < roles.length; i++) {
		if (roles[i].toString() === role.toString()) {
			flag = true;
			break;
		}
	}

	return flag;
};

UserSchema.methods.findByEmail = (email) => {
	return this.findOne({ email: email });
};

module.exports = mongoose.model("User", UserSchema);