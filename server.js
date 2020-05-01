const express= require('express');
const app = express();
const cors = require('cors');

//Middlewaare
app.use(express.json());
app.use(cors());

//import route
const apiRoute = require('./routes/api');
app.use('/api', apiRoute);

//Route
app.get('/', (req, res) => {
    res.send('This is home');
});

//listen
const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));