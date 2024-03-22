require('dotenv').config();
const express = require('express')
const routes = require('./routes/userRoute')
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
const port = process.env.PORT || 4000;
app.use('/api',routes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


