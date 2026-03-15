import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

import mysql from "mysql2/promise";

// creation connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "sys",
    password: "oracle",
    database: "sys",
});


app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}


);
app.get("/events", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events");
    res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});


