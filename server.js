const mongoose = require('mongoose');
const app= require('./app');
const port = 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB database');

        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
        });
    },
      err => { console.log('Connection to MongoDB failed', err); });