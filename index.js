require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("reqbody", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqbody"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info/", (request, response) => {
  Person.find({})
  .then((persons) => {
    const respText = `<p>Phonebook has data for ${persons.length} people.</p><p>${Date()}</p>`;
    response.send(respText);
  })
  .catch((error) => next(error));


});

app.get("/api/persons/", (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  //const id = Number(request.params.id);
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  //const id = Number(request.params.id);
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  console.log(`Put request: ${JSON.stringify(request.body)}`);

  const {phone} = request.body;

  Person.findByIdAndUpdate(
    request.params.id, 
    { phone }, 
    { new: true, runValidators: true, context: 'query' }
  )
  .then((updatedPerson) => {
    console.log(`Update result: ${JSON.stringify(updatedPerson)}`);
    response.json(updatedPerson);
  })
  .catch((error) => next(error));

});


app.post("/api/persons/", (request, response, next) => {
  let body = request.body;
  console.log(`Request: ${JSON.stringify(request.body)}`);

  
  if (!body.hasOwnProperty("name") || body.name == "") {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.hasOwnProperty("phone") || body.phone == "") {
    return response.status(400).json({
      error: "phone missing",
    });
  }
  

  const person = new Person({
    name: body.name,
    phone: body.phone,
  });
  console.log(`Adding: ${JSON.stringify(person)}`);
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
  });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
