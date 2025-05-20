import express from 'express';

import cors from 'cors';

import clientRoutes from './routes/clientRoutes.js'; // Import client routes


const app = express();


app.use(cors()); // Enable CORS

app.use(express.json()); // Middleware to parse JSON


// Set up routes

app.use('/api/clients', clientRoutes);


const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});

