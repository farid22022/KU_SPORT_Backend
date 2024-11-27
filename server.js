const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5004;

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ku-sports",
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

app.post('/registration', (req, res) => {
    console.log("Received data: ", req.body); 
    const sql = "INSERT INTO registration(name, email, password, number,role) VALUES(?,?,?,?,?)";
    
    const { name, email, password, number,role } = req.body;

    connection.query(sql, [name, email, password, number,role], (err, data) => {
        if (err) {
            console.error("Database error: ", err); 
            return res.json("error: " + err);
        }
        return res.json(data);
    });
});


app.post('/teams', (req, res) => {
  console.log("Received team data: ", req.body);

  // Update the SQL statement to include new fields
  const sql = "INSERT INTO teams (team_name, sport, discipline, total_players, captain, coach, contact_email, contact_phone, logo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const { teamName, sport, discipline, totalPlayers, captain, coach, contactEmail, contactPhone, logoUrl } = req.body;

  // Ensure totalPlayers is treated as an integer
  const totalPlayersInt = parseInt(totalPlayers, 10);

  connection.query(sql, [teamName, sport, discipline, totalPlayersInt, captain, coach, contactEmail, contactPhone, logoUrl], (err, data) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.status(201).json(data);
  });
});

// GET method to retrieve all teams
app.get('/teams', (req, res) => {
  const sql = "SELECT * FROM teams";

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.json(results); // Send the results back to the client
  });
});



app.post('/sports', (req, res) => {
  console.log("Received sport data: ", req.body); 

  const sql = "INSERT INTO sports(sport_name) VALUES(?)";
  const { sport_name } = req.body;

  connection.query(sql, [sport_name], (err, data) => {
    if (err) {
      console.error("Database error: ", err); 
      return res.status(500).json({ error: "Database error: " + err });
    }
    return res.status(201).json(data);
  });
});

app.post('/upcomingmatches', (req, res) => {
  console.log("Received match data: ", req.body);
  
  // Prepare the SQL insert statement
  const sql = "INSERT INTO upcomingmatches(team1, team2, date, time, location, sport) VALUES(?,?,?,?,?,?)";
  
  // Destructure the received match data
  const { team1, team2, date, time, location, sport } = req.body;

  // Check if any required fields are empty
  if (!team1 || !team2 || !date || !time || !location || !sport) {
      return res.status(400).json({ error: "All fields are required" });
  }

  // Execute the SQL query
  connection.query(sql, [team1, team2, date, time, location, sport], (err, data) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.json(data);
  });
});

app.get('/upcomingmatches', (req, res) => {
  const sql = "SELECT * FROM upcomingmatches";

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.json(results); // Send the results back to the client
  });
});




app.get('/sports', (req, res) => {
  const sql = "SELECT * FROM sports"; 

  connection.query(sql, (err, data) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(data); // Send the fetched teams back as a response
  });
});

// POST method to add a new player
app.post('/players', (req, res) => {
  const { playerName, age, sport, role } = req.body;

  const sql = "INSERT INTO players (player_name, age, sport, role) VALUES (?, ?, ?, ?)";
  connection.query(sql, [playerName, age, sport, role], (err, result) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.status(201).json({ message: "Player added successfully!", playerId: result.insertId });
  });
});

// GET method to retrieve all players
app.get('/players', (req, res) => {
  const sql = "SELECT * FROM players";

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.json(results); // Send the results back to the client
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});