const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());

app.use(cors());

morgan.token('reqbody', (req, res) => { 
    return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    phone: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    phone: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    phone: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    phone: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info/", (request, response) => {
  const respText = `<p>Phonebook has data for ${
    persons.length
  } people.</p><p>${Date()}</p>`;
  response.send(respText);
});

app.get("/api/persons/", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

app.post("/api/persons/", (request, response) => {
    let body = request.body;

    if (! body.hasOwnProperty('name') || body.name == "") {
        return response.status(400).json({
            error: 'name missing'
        });
    }
    if (! body.hasOwnProperty('phone') || body.phone == "") {
        return response.status(400).json({
            error: 'phone missing'
        });
    }
    const nameExists = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase());
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const maxId = 10000000;
    const person = {
        "id" : generateId(),
        "name" : body.name,
        "phone" : body.phone
    }
    persons = persons.concat(person)
    response.json(person);
  });
  
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
