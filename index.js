const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'mysecretkey',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        maxAge: 60000,
        httpOnly: true, 
        secure: false,
    }
}));

const users = {
    user1: 'password1',
    user2: 'password2'
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username] === password) {
        req.session.user = { username };
        console.log("session", req.session.user)
        console.log("username", username)

        return res.send(`Welcome, ${username}! You are logged in.`);
    }

    res.status(401).send('Invalid credentials');
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`Hello, ${req.session.user.username}. This is your dashboard.`);
    } else {
        res.status(401).send('Please login to view this page');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout.');
        }
        res.send('Logged out successfully');
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
