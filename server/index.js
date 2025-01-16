const express = require("express");
const axios = require("axios");
const mongoose = require('mongoose');
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const UserModel = require("./models/User");
const ConversionHistoryModel = require("./models/conversionHistory");
const RefreshTokenModel = require("./models/refreshToken");
const bcrypt = require('bcrypt');

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
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        
        if (!token) return res.status(403).json({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ auth: false, message: 'Token expired' });
                  }
                  
                return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
            }
            
            req.userId = decoded.id;
            next();
        });
    } else {
        return res.status(403).json({ auth: false, message: 'No token provided or token format is incorrect.' });
    }
};

app.post('/api/convert', verifyToken, async (req, res) => {
    try {
        const { from, to, amount } = req.body;
        console.log({from, to, amount});

        const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`
        const response = await axios.get(url)
        if(response.data && response.data.result === 'success'){
            const conversionData = {
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                conversionAmount: response.data.conversion_result,
            }

            const historyEntry = new ConversionHistoryModel({
                userId: req.userId,
                fromCurrency: from,
                toCurrency: to,
                amount: parseFloat(amount),
                convertedAmount: parseFloat(conversionData.conversionAmount),
                conversionRate: parseFloat(conversionData.conversionRate),
            });
            await historyEntry.save();

            res.json(conversionData)
        } else {
            res.status(400).json({message:"Error converting currency", details: response.data});
        }
    } catch (error) {
        res.status(500).json({message:"Error converting currency", details: error.message});
    }
});

app.get('/api/conversion-history', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const history = await ConversionHistoryModel.find({ userId }).sort({ conversionDate: -1 }).lean();
        console.log('History data:', history);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversion history', details: error.message });
    }
});

mongoose.connect("mongodb+srv://Jacek:12345@currency-converter.s7q5p.mongodb.net/currency-converter", { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        console.log('Found user:', user);
        
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            console.log('Password comparison result:', validPassword);
            
            if (validPassword) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                const refreshTokenRecord = new RefreshTokenModel({
                    userId: user._id,
                    token: refreshToken,
                });
                await refreshTokenRecord.save();

                res.json({ 
                    auth: true, 
                    token: token, 
                    refreshToken: refreshToken, 
                    user: { id: user._id, name: user.name, email: user.email } 
                });
            } else {
                res.status(401).json({ message: "The password is incorrect" });
            }
        } else {
            res.status(404).json({ message: "No record existed" });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

app.post('/api/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(403).json({ message: 'No refresh token provided' });
        }

        const refreshTokenRecord = await RefreshTokenModel.findOne({ token: refreshToken });
        if (!refreshTokenRecord) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const user = await UserModel.findById(refreshTokenRecord.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await RefreshTokenModel.deleteOne({ token: refreshToken });

        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        await new RefreshTokenModel({ userId: user._id, token: newRefreshToken }).save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    } catch (error) {
        res.status(500).json({ message: 'Error refreshing token', details: error.message });
    }
});
