const mongoose = require('mongoose');

const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = mongoose.Schema(
    {
        username:{
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true,
            match: [/^[a-zA-Z0-9_]+$/, "Le nom d'utilisateur ne doit contenir que des lettres, chiffres et underscores (pas d'espaces ni caractères spéciaux)."]
        },
        firstname:{
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true
        },
        lastname:{
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true
        },
        email:{
            type: String,
            unique: true,
            required: true,
            match: [emailRegex, 'Please provide a valid email address']
        },
        password:{
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true,
            trim: true,
            validate: {
                validator: (v) => {
                    const minDate = new Date('1900-01-01');
                    const maxDate = new Date();
                    return v >= minDate && v <= maxDate;
                },
                message: props => `Date invalide : ${props.value}`
            }
        },
        city:{
            type: String,
            required: true
        },
        profession:{
            type: String,
            required: false
        },
        role:{
            type: String,
            enum: ['user', 'subscriber', 'admin', 'superAdmin'],
            default: 'user',
        },
        isActive:{
            type: Boolean,
            default: true,
        },
        isVerified:{
            type: Boolean,
            default: false,
        },
        isSuscriber:{
            type: Boolean,
            default: false,
        },
        } ,  { timestamps: { createdAt: true    }
    }
)

module.exports = mongoose.model('Users', userSchema)