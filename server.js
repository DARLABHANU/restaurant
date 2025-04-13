const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your HTML)
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect('mongodb+srv://dimilipavanrishile23csm:pavan@reservation.x3iwhne.mongodb.net/?retryWrites=true&w=majority&appName=Reservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  time: String,
  guests: Number,
  special: String,
}, { timestamps: true }); // Added timestamps for created/updated times

const Reservation = mongoose.model('Reservation', reservationSchema);

// Handle reservation submission
app.post('/submit-reservation', async (req, res) => {
  try {
    const { name, email, date, time, guests, special } = req.body;

    // Basic validation
    if (!name || !email || !date || !time || !guests) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    const newReservation = new Reservation({
      name,
      email,
      date,
      time,
      guests,
      special,
    });

    await newReservation.save();
    res.json({ success: true, message: 'Reservation saved successfully!' });
  } catch (err) {
    console.error('Error saving reservation:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving reservation.' 
    });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});