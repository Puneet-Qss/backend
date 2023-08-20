const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  Message: {
    type: String,
    required: true
  },
 
});

const Contact = mongoose.model("ContactUs", contactSchema);

module.exports = Contact;
