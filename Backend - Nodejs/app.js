const express = require('express');
const app = express();
const mysql = require('mysql2');
const port = 8080;

app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'login',
    port: 4306
});

// Check database connection on server start
pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        console.error('Database connection failed:', err.message);
    } else {
        console.log('✅ Database connected successfully as ID:', connection.threadId);
        connection.release(); // Release connection after check
    }
});

pool.query("DESCRIBE users", (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
}); 

// Get all users
app.post('/signup', (req, res) => {
    const { FirstName, LastName, Email, Password } = req.body;

    // Check if all fields are provided
    if (!FirstName || !LastName || !Email || !Password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert query for adding user
    const sql = 'INSERT INTO users (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)';

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection failed:', err.message);
            return res.status(500).json({ error: 'Database connection error' });
        }

        connection.query(sql, [FirstName, LastName, Email, Password], (err, result) => {
            connection.release(); // Release connection back to pool

            if (err) {
                console.error('Error inserting data:', err.message);
                return res.status(500).json({ error: 'Error inserting data' });
            }

            res.status(201).json({
                message: 'User registered successfully!',
                userId: result.insertId
            });
        });
    });
});


// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
