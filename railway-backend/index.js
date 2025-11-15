const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());


// Mount routes
const emailRouter = require('./routes/email');
app.use('/api/email', emailRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0',() => {
console.log(`Server listening on port ${PORT}`);
});