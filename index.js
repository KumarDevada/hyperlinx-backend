const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User'); // Make sure to import the User model
const bodyParser = require('body-parser')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/:uniqueKey', async (req, res) => {
    const { uniqueKey } = req.params;

    try {
        const user = await User.findOne({ uniqueKey });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({username: user.username ,links: user.links});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
