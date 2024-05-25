const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/Routes/userRoutes');
const  { connect } = require('./src/db/dbconfigMongodb');
const path = require('path');
const { log } = require('console');
require('dotenv').config();
console.log(connect);
console.log(__dirname );


const app = express();

const test=path.join(__dirname + '/src/public')
console.log("test",test)
app.use(express.static(test));

console.log(process.env.BASE_URL);
const PORT = process.env.PORT || 3000;

connect(process.env.MONGO_URL, (error) => {
    if (error) {
        console.log('connexion échoué')
        process.exit(-1)
    } else {
        console.log('connexion reussi')
    }
})


app.use(cors());
app.use(express.json());


app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});