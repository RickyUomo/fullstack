const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@fullstack.ql02jbf.mongodb.net/phoneBook?retryWrites=true&w=majority`;

const name = process.argv[3],
    number = process.argv[4];

mongoose.connect(url);

run();
async function run() {

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", () => console.log("Connection Successful!"));

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });

    const Person = mongoose.model('Person', personSchema);

    const person = new Person({
        name,
        number
    })

    try {
        await person.save();
        console.log(`added ${name} number ${number}!!!!`);
    } catch (err) {
        console.log(err);
    }


    try {
        const persons = await Person.find({});
        persons.forEach(p => console.log(p))
        mongoose.connection.close()
    } catch (err) {
        console.log(err);
    }
}