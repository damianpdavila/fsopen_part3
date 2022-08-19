/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password>'
    )
    process.exit(1)
}

const password = encodeURI(process.argv[2])
const newName = process.argv[3]
const newPhone = process.argv[4]

const url = `mongodb+srv://fsopen:${password}@cluster0.rpt6zx8.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    mongoose
        .connect(url)
        // eslint-disable-next-line no-unused-vars
        .then((result) => {
            console.log('connected')
            return Person.find({})
        })
        .then((persons) => {
            console.log('phonebook:')
            persons.forEach((person) => {
                console.log(person.name, person.phone)
            })
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
} else {
    mongoose
        .connect(url)
        // eslint-disable-next-line no-unused-vars
        .then((result) => {
            console.log('connected')

            const person = new Person({
                name: newName,
                phone: newPhone,
            })

            return person.save()
        })
        .then(() => {
            console.log(`added ${newName} number ${newPhone} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}
