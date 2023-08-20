const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userModel"); 
const Contact = require("./models/contactUs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

const mongoURI = "mongodb+srv://backend:backend23@cluster0.hywuhba.mongodb.net/users?retryWrites=true&w=majority"; 
const jwtSecret = "PuneetKumarSharma";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
db.once("open", () => {
  console.log("Connected to MongoDB successfully!");
});



app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("Hello from Server~");
  });
  

app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword
      });
  
      await user.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/contactUs",async  (req,res)=>{
      const {email, Message} =   req.body;

      try {
        const contactData =  new Contact({
            email,
            Message
          })
    
          await contactData.save();
          res.status(201).json({ message: "Contact Form Submitted!" });
    
      } catch (error) {
        console.log({message: error.message})
      }
     
  })

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
        const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
        const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });
       console.log("Token" , token);

      res.status(200).json({ message: "Succesfully Logged In!" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
