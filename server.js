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
  database: "ku-sports-v5",
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});


// POST endpoint for creating a new user
// app.post("/api/users", async (req, res) => {
//   const { name, email, password, image, role } = req.body;
//   console.log(req.body)

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // SQL Query to insert a user
//     const query = `INSERT INTO user (user_name, email, password, role, user_img) VALUES (?, ?, ?, ?, ?)`;
//     const values = [name, email, hashedPassword, role, image];

//     connection.query(query, values, (err, result) => {
//       if (err) {
//         console.error("Error inserting user:", err);
//         return res.status(500).json({ message: "Database error" });
//       }
//       res.status(201).json({ message: "User created successfully", userId: result.insertId });
//     });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


app.post("/api/users", (req, res) => {
  const { name, email, password, image, role } = req.body;

  console.log("Request Body:", req.body);
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Role:", role);
  console.log("Image URL:", image);

  // Validate required fields
  if (!name || !email || !password || !role || !image) {
    return res.status(400).json({ error: "All fields are required for creating a user." });
  }

  // SQL Query to insert a user into the 'user' table
  const userQuery = `
    INSERT INTO user (user_name, email, password, role, user_img)
    VALUES (?, ?, ?, ?, ?)
  `;
  const userValues = [name, email, password, role, image];
  console.log(userValues);

  connection.query(userQuery, userValues, (err, result) => {
    if (err) {
      console.error("Error inserting user:", err.message);
      return res.status(500).json({ error: "Failed to create user." });
    }

    // Send the created user data back to the frontend
    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  });
});


// app.post("/api/users", (req, res) => {
//   const { name, email, password, image, role } = req.body;

//   // Validate required fields
//   if (!name || !email || !password || !role) {
//     console.log("Validation failed. Missing field:", { name, email, password, role });
//     return res.status(400).json({ error: "All fields are required." });
//   }

//   const userQuery = `
//     INSERT INTO user (name, email, password, image, role)
//     VALUES (?, ?, ?, ?, ?)
//   `;
//   const userValues = [name, email, password, image, role];

//   connection.query(userQuery, userValues, (err, result) => {
//     if (err) {
//       console.error("Error inserting user:", err.message, err.code);
//       return res.status(500).json({ error: "Failed to create user.", details: err.message });
//     }
//     console.log("User inserted with ID:", result.insertId);
//     res.status(201).json({ message: "User created successfully.", userId: result.insertId });
//   });
// });



app.get('/api/users', (req, res) => {
  const sql = "SELECT * FROM user";  // SQL query to fetch all players

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error: " + err });
    }
    return res.json(results); // Send the results back to the client
  });
});








app.post("/api/players", (req, res) => {
  const { email, position, batting_hand, bowling_hand, bowling_type, team_id } = req.body;

  console.log("Request Body:", req.body);
  console.log("Email:", email);
  console.log("Position:", position);
  console.log("Batting Hand:", batting_hand);
  console.log("Bowling Hand:", bowling_hand);
  console.log("Bowling Type:", bowling_type);
  console.log("Team ID:", team_id);

  // Validate required fields
  if (!email || !position || !batting_hand || !bowling_hand || !bowling_type || !team_id) {
    return res.status(400).json({ error: "All fields are required for creating a player." });
  }

  // Insert the player into the 'Player' table (including team_id)
  const playerQuery = `
    INSERT INTO player (email, position, batting_hand, bowling_hand, bowling_type, team_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const playerValues = [email, position, batting_hand, bowling_hand, bowling_type, team_id];
  console.log(playerValues);
  connection.query(playerQuery, playerValues, (err, result) => {
    if (err) {
      console.error("Error inserting player:", err.message);
      return res.status(500).json({ error: "Failed to create player." });
    }

    // Send the created player data back to the frontend
    return res.status(201).json(result);
  });
});






app.delete('/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
      const result = await User.deleteOne({ _id: user_id }); // Use _id instead of user_id
      if (result.deletedCount > 0) {
          res.status(200).json({ message: "User deleted successfully", deletedCount: result.deletedCount });
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});





app.patch("/users/:role/:userId", (req, res) => {
  const { role, userId } = req.params;

  // Validate role
  const validRoles = ["admin", "manager"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  // SQL query to update the user's role
  const sql = "UPDATE users SET role = ? WHERE id = ?";

  // Execute the query
  connection.query(sql, [role, userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "An error occurred while updating the user role" });
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ 
        message: "User role updated successfully", 
        affectedRows: results.affectedRows 
      });
    } else {
      return res.status(404).json({ message: "User not found or no changes made" });
    }
  });
});




// API to get players based on team_id
app.get("/api1/players", (req, res) => {
  const { team_id } = req.query;

  // Validate that team_id is provided
  if (!team_id) {
    return res.status(400).json({ error: "team_id is required." });
  }

  // Query to fetch players filtered by team_id
  const sql = `SELECT * FROM player WHERE team_id = ?`;
  // const sql = `SELECT * FROM player join team on team.team_id=player.team_id`;

  connection.query(sql, [team_id], (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error: " + err });
    }
    console.error(results)
    console.log(results);
    return res.json(results); // Send the filtered results back to the client
  });
});


// GET method to retrieve all players
app.get('/api/players', (req, res) => {
  const sql = "SELECT * FROM player";  // SQL query to fetch all players

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error: " + err });
    }
    return res.json(results); // Send the results back to the client
  });
});

app.get('/api/players', (req, res) => {
  const sql = "SELECT email FROM player join team on team.team_id=player.team_id";  // SQL query to fetch all players

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error: " + err });
    }
    return res.json(results); // Send the results back to the client
  });
});



//SELECT email FROM player join team on team.team_id=player.team_id




app.delete('/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  console.log("Attempting to delete user with ID:", user_id); 
  try {
      const result = await User.deleteOne({ user_id });
      if (result.deletedCount === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ deletedCount: result.deletedCount });
  } catch (error) {
      console.error("Error during deletion:", error);
      res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

app.delete('/test/:user_id', (req, res) => {
  console.log(req.params.user_id);  // Check if this log appears
  res.send("Test route hit");
});





app.post('/api/teams', (req, res) => {
  console.log("Received team data: ", req.body);

  // Update the SQL statement to include new fields
  const sql = "INSERT INTO team (team_name, year, win,lose,draw, team_image, slogan) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const { team_name, year, win,lose,draw, team_image, slogan} = req.body;
  console.log(req.body)

  // Ensure totalPlayers is treated as an integer
  // const totalPlayersInt = parseInt(totalPlayers, 10);

  connection.query(sql, [team_name, year, win,lose,draw, team_image, slogan], (err, data) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.status(201).json(data);
  });
});

// GET method to retrieve all teams
app.get('/teams', (req, res) => {
  const sql = "SELECT * FROM team";

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.json(results); // Send the results back to the client
  });
});

app.post("/api/matches", (req, res) => {
  console.log("357")
  console.log()
  const {tournament_id_, team_1_id, team_2_id, score_team_1, score_team_2, match_date } = req.body;
  console.log(tournament_id_, team_1_id,team_2_id,score_team_1,score_team_2)

  // Check for missing fields
  if (!tournament_id_ || !team_1_id || !team_2_id || !score_team_1 || !score_team_2 || !match_date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Ensure team IDs are numbers
  const team1_id = Number(team_1_id);
  const team2_id = Number(team_2_id);
  const score_team1 = Number(score_team_1);
  const score_team2 = Number(score_team_2);
  const tournament_id = Number(tournament_id_)

  console.log(tournament_id, team1_id,team2_id,score_team1,score_team2)

  // Validate that the two teams are different
  if (team1_id === team2_id) {
    return res.status(400).json({ error: "Teams must be different." });
  }

  // Query to insert match data
  const query = `
    INSERT INTO matches (tournament_id, team1_id, team2_id, score_team1, score_team2, match_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [tournament_id, team1_id, team2_id, score_team1, score_team2, match_date];
  console.log(383,values)

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting match:", err.message);
      return res.status(500).json({ error: "Failed to add match." });
    }
    res.status(201).json({ message: "Match added successfully." });
  });
});


app.get('/api/matches', (req, res) => {
  const sql = "SELECT * FROM matches";  // SQL query to fetch all players
  console.log(sql)

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error: " + err });
    }
    console.log(connection.query)
    console.log(results)
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











app.post("/api/players", (req, res) => {
  const { position, battingHand, bowlingHand, bowlingType } = req.body;

  // Validate required fields
  if (!position || !battingHand || !bowlingHand || !bowlingType) {
    return res.status(400).json({ error: "All fields are required for creating a player." });
  }

  // Insert the player into the 'Player' table (no need for user_id in the data)
  const playerQuery = `
    INSERT INTO player (position, batting_hand, bowling_hand, bowling_type)
    VALUES (?, ?, ?, ?)
  `;
  const playerValues = [position, battingHand, bowlingHand, bowlingType];

  connection.query(playerQuery, playerValues, (err, result) => { // Use connection.query
    if (err) {
      console.error("Error inserting player:", err.message);
      return res.status(500).json({ error: "Failed to create player." });
    }
    
    // Send the created player data back to the frontend
    res.status(201).json({
      message: "Player created successfully.",
      playerId: result.insertId, // The auto-incremented user_id
    });
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


app.post('/api/tournaments', (req, res) => {
  console.log("Received tournament data: ", req.body);

  // Update the SQL statement to include new fields
  const sql = "INSERT INTO tournament (title, year) VALUES (?, ?)";
  const { title, year} = req.body;
  console.log(req.body)

  

  connection.query(sql, [title, year], (err, data) => {
      if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({ error: "Database error: " + err });
      }
      return res.status(201).json(data);
  });
});


app.get('/api/tournaments', (req, res) => {
  const sql = "SELECT * FROM tournament";

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