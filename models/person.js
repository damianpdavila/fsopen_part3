const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
// URI saved in .env file locally, and Config Vars on Heroku for deployment
// `mongodb+srv://fsopen:${password}@cluster0.rpt6zx8.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

console.log('connecting to', url)

mongoose
    .connect(url)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    phone: {
        type: String,
        minLength: 10,
        required: [true, 'Phone number is required'],
        validate: {
            validator: (v) => {
                return /^\d{2,3}-?\d+$/.test(v)
            },
            message: (props) =>
                `${props.value} is not a valid phone number; use format NN-NNNNN`,
        },
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

// eslint-disable-next-line no-unused-vars
const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)
