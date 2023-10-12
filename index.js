const express = require('express');
const dotenv  = require('dotenv');
const mongoose = require('mongoose');

const cors = require('cors');
//const routes = require('./routes/index.js');
const authRoutes = require('./transport/routes/auth')
const userRoutes = require('./transport/routes/user')
const applianceRoutes = require('./transport/routes/appliance');
const { Call } = require('./repo/sdk/twilio');
const app = express();
dotenv.config();
app.use(cors({
  origin: 'http://your-frontend-app-domain.com',
  methods: 'GET,POST',
  credentials: true, // If you need to handle cookies
}));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send("welcome to electric bill optimizer server");
    Call();
})

app.use('/appliance',applianceRoutes )
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() =>
        app.listen(process.env.PORT, () => console.log(`server is running on port ${process.env.PORT}`))
    )
    .catch(err => console.log(err))

