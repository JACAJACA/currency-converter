const express = require("express");
const axios = require("axios");
const mongoose = require('mongoose');
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken'); // Dodaj tę linię
require("dotenv").config();
const UserModel = require("./models/User");

const app = express();

const API_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

const corsOptions = {
    origin: ['http://localhost:5173']
}

app.use(express.json());
app.use(apiLimiter);
app.use(cors(corsOptions));

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        
        req.userId = decoded.id;
        next();
    });
};

app.post('/api/convert', verifyToken, async (req, res) => {
    try {
        const {from, to, amount} = req.body;
        console.log({from, to, amount});

        const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`
        const response = await axios.get(url)
        if(response.data && response.data.result === 'success'){
            res.json({
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                conversionAmount: response.data.conversion_result,
            })
        } else {
            res.json({message:"Error converting currency", details: response.data});
        }
    } catch (error) {
        res.json({message:"Error converting currency", details: error.message});
    }
});

mongoose.connect("mongodb+srv://Jacek:12345@currency-converter.s7q5p.mongodb.net/currency-converter", { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ auth: true, token: token });
            } else {
                res.status(401).json("The password is incorrect");
            }
        } else {
            res.status(404).json("No record existed");
        }
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});