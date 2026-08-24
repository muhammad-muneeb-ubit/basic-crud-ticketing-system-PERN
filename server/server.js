import express from "express";
import cors from "cors";
import pool from "./db/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/health", (req, res) => {
    res.send({
        status: "OK",
        message: "Server is running",
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const reult = await pool.query("SELECT NOW()");
        res.json({
            status: "OK",
            message: "Database connection is working",
            data: reult.rows[0],
        });
    }
    catch (err) {
        res.status(500).send({
            status: "ERROR",
            message: "Error occurred while testing database connection",
        });
    }
})

app.post("/auth/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, password, role]
        );
        res.status(201).json({
            status: "OK",
            message: "User registered successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while registering user",
        });
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2",
            [email, password]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({
                status: "ERROR",
                message: "Invalid email or password",
            });
        }
        res.status(200).json({
            status: "OK",
            message: "User logged in successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while logging in",
        });
    }
});

app.post("/ticket", async (req, res) => {
    try {
        const { title, description, status, user_id } = req.body;
        const result = await pool.query(
            "INSERT INTO tickets (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, status, user_id]
        );
        res.status(201).json({
            status: "OK",
            message: "Ticket created successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while creating ticket",
        });
    }
});

app.get("/ticket", async (req, res) => {
    try {
        const result = await pool.query("select t.*, u.name from tickets t left join users u on t.user_id = u.id order by t.created_at ");
        res.json({
            status: "OK",
            message: "Tickets retrieved successfully",
            data: result.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while retrieving tickets",
        });
    }
});

app.get("/ticket/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT t.*, u.name FROM tickets t left join users u on t.user_id = u.id WHERE t.id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                message: "Ticket not found",
            });
        }
        res.json({
            status: "OK",
            message: "Ticket retrieved successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while retrieving ticket",
        });
    }
});

app.get("/ticket/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT t.*, u.name FROM tickets t left join users u on t.user_id = u.id WHERE t.user_id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                message: `Any ticket associated with user id ${id} not found`,
            });
        }
        res.json({
            status: "OK",
            message: "Ticket retrieved successfully",
            data: result.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while retrieving ticket",
        });
    }
});

app.put("/ticket/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const result = await pool.query(
            `UPDATE tickets SET title = COALESCE($1, title), description = COALESCE($2, description),   status = COALESCE($3, status) WHERE id = $4 RETURNING *`,
            [title, description, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                message: "Ticket not found",
            });
        }
        res.json({
            status: "OK",
            message: "Ticket updated successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while updating ticket",
        });
    }
});

app.delete("/ticket/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM tickets WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                message: "Ticket not found",
            });
        }
        res.json({
            status: "OK",
            message: "Ticket deleted successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while deleting ticket",
        });
    }
});

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users order by role, name");
        res.json({
            status: "OK",
            message: "Users retrieved successfully",
            data: result.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Error occurred while retrieving users",
        });
    }
});


const PORT = process.env.SERVER_PORT
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});