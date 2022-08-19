const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
// URI saved in .env file locally, and Config Vars on Heroku for deployment
// `mongodb+srv://fsopen:${password}@cluster0.rpt6zx8.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

console.log('connecting to', url);

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  phone: {
    type: String,
    minLength: 10,
    required: true
  }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model("Person", personSchema);

module.exports = mongoose.model('Person', personSchema);