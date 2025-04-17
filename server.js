const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5500;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ✅ MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Change this if needed
    database: "users"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err.stack);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

// ✅ User Registration Route
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "❌ All fields are required" });
    }

    const sql = "INSERT INTO table1 (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "❌ Database error" });
        }
        res.json({ message: "✅ User registered successfully!" });
    });
});

// ✅ User Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM table1 WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user: results[0] });
    });
});


//add
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Handle Guide Registration with Image Upload
app.post("/register-guide", upload.single("image"), (req, res) => {
    const { name, about, amount } = req.body;
    const image = req.file ? req.file.buffer : null;

    // ✅ Validate Required Fields
    if (!name || !about || !amount || !image) {
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    // ✅ Insert Guide Data into MySQL
    const insertQuery = "INSERT INTO travelguide (name, about, amount, image) VALUES (?, ?, ?, ?)";

    db.query(insertQuery, [name, about, amount, image], (err, result) => {
        if (err) {
            console.error("❌ SQL Error (Inserting Guide):", err);
            return res.status(500).json({ message: "❌ Error saving data" });
        }
        res.status(201).json({ message: "✅ Guide registered successfully!", id: result.insertId });
    });
});

// ✅ Fetch All Guides (Convert Image BLOB to Base64)
app.get("/guides", (req, res) => {
    const fetchQuery = "SELECT id, name, about, amount, image FROM travelguide";

    db.query(fetchQuery, (err, results) => {
        if (err) {
            console.error("❌ SQL Error (Fetching Guides):", err);
            return res.status(500).json({ message: "❌ Error fetching guides" });
        }

        const guidesWithImages = results.map(guide => ({
            ...guide,
            image: guide.image ? `data:image/jpeg;base64,${guide.image.toString("base64")}` : null
        }));

        res.status(200).json(guidesWithImages);
    });
});
// fetch all vehicles 

app.post("/register-vehicle", upload.single("vehicleImage"), (req, res) => {
    const { vehicleName, location, rentAmount } = req.body;
    const vehicleImage = req.file ? req.file.buffer : null;

    // ✅ Validate Required Fields
    if (!vehicleName || !location || !rentAmount || !vehicleImage) {
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    // ✅ Insert Vehicle Data into MySQL
    const insertQuery = "INSERT INTO vehicles (vehicleName, location, rentAmount, vehicleImage) VALUES (?, ?, ?, ?)";

    db.query(insertQuery, [vehicleName, location, rentAmount, vehicleImage], (err, result) => {
        if (err) {
            console.error("❌ SQL Error (Inserting Vehicle):", err);
            return res.status(500).json({ message: "❌ Error saving data" });
        }
        res.status(201).json({ message: "✅ Vehicle registered successfully!", id: result.insertId });
    });
});

// electronic items
app.post("/register-electronic", upload.single("electronicImage"), (req, res) => {
    const { electronicName, location, amountPerHour } = req.body;
    const electronicImage = req.file ? req.file.buffer : null;

    // ✅ Validate Required Fields
    if (!electronicName || !location || !amountPerHour || !electronicImage) {
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    // ✅ Insert Electronic Data into MySQL
    const insertQuery = "INSERT INTO electronics (electronicName, location, amountPerHour, electronicImage) VALUES (?, ?, ?, ?)";

    db.query(insertQuery, [electronicName, location, amountPerHour, electronicImage], (err, result) => {
        if (err) {
            console.error("❌ SQL Error (Inserting Electronic):", err);
            return res.status(500).json({ message: "❌ Error saving data" });
        }
        res.status(201).json({ message: "✅ Electronic item registered successfully!", id: result.insertId });
    });
});


app.post("/register-furniture", upload.single("furnitureImage"), (req, res) => {
    const { furnitureName, location, rentAmount } = req.body;
    const furnitureImage = req.file ? req.file.buffer : null;

    // ✅ Validate Required Fields
    if (!furnitureName || !location || !rentAmount || !furnitureImage) {
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    // ✅ Insert Furniture Data into MySQL
    const insertQuery = "INSERT INTO furniture (furnitureName, location, rentAmount, furnitureImage) VALUES (?, ?, ?, ?)";

    db.query(insertQuery, [furnitureName, location, rentAmount, furnitureImage], (err, result) => {
        if (err) {
            console.error("❌ SQL Error (Inserting Furniture):", err);
            return res.status(500).json({ message: "❌ Error saving data" });
        }
        res.status(201).json({ message: "✅ Furniture registered successfully!", id: result.insertId });
    });
});
app.get("/vehicles", (req, res) => {
    const searchQuery = req.query.search || ''; // Default to empty string if no search query is provided

    const query = `
        SELECT id, vehicleName, location, rentAmount, vehicleImage 
        FROM vehicles 
        WHERE vehicleName LIKE ?`;

    db.query(query, [`%${searchQuery}%`], (err, result) => {
        if (err) {
            console.error("❌ Error fetching vehicles:", err);
            return res.status(500).json({ message: "❌ Error fetching vehicles" });
        }

        // Convert the image to base64 for frontend
        const vehicles = result.map(vehicle => {
            if (vehicle.vehicleImage) {
                vehicle.vehicleImage = vehicle.vehicleImage.toString('base64');
            }
            return vehicle;
        });

        res.status(200).json(vehicles);
    });
});
app.get("/electronics", (req, res) => {
    const searchQuery = req.query.search || ''; // Default to empty string if no search query

    const query = `
        SELECT id, electronicName, location, amountPerHour, electronicImage 
        FROM electronics 
        WHERE electronicName LIKE ?`;

    db.query(query, [`%${searchQuery}%`], (err, result) => {
        if (err) {
            console.error("❌ Error fetching electronics:", err);
            return res.status(500).json({ message: "❌ Error fetching electronics" });
        }

        // Convert the image to base64 for frontend
        const electronics = result.map(electronic => {
            if (electronic.electronicImage) {
                electronic.electronicImage = electronic.electronicImage.toString('base64');
            }
            return electronic;
        });

        res.status(200).json(electronics);
    });
});
app.get("/furniture", (req, res) => {
    const searchQuery = req.query.search || ''; // Default to empty string if no search query

    const query = `
        SELECT id, furnitureName, location, rentAmount, furnitureImage 
        FROM furniture 
        WHERE furnitureName LIKE ?`;

    db.query(query, [`%${searchQuery}%`], (err, result) => {
        if (err) {
            console.error("❌ Error fetching furniture:", err);
            return res.status(500).json({ message: "❌ Error fetching furniture" });
        }

        // Convert the image to base64 for frontend
        const furnitureItems = result.map(furniture => {
            if (furniture.furnitureImage) {
                furniture.furnitureImage = furniture.furnitureImage.toString('base64');
            }
            return furniture;
        });

        res.status(200).json(furnitureItems);
    });
});
// Endpoint to fetch a specific guide's details by ID
// Endpoint to fetch a specific guide's details by ID
app.get("/guides/:id", (req, res) => {
    const guideId = req.params.id;
    const query = "SELECT * FROM travelguide WHERE id = ?";
    
    db.query(query, [guideId], (err, result) => {
        if (err) {
            console.error("Error fetching guide:", err);
            return res.status(500).json({ message: "❌ Error fetching guide details." });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ message: "❌ Guide not found." });
        }
        
        // Convert the image BLOB to base64
        const guide = result[0];
        const imageBase64 = guide.image ? `data:image/jpeg;base64,${guide.image.toString('base64')}` : null;

        // Send the guide data including base64-encoded image
        res.json({
            ...guide,
            image: imageBase64
        });
    });
});



// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
