const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://deepak12345:deepak12345@cluster0.y8gloab.mongodb.net/tambola?retryWrites=true&w=majority')
.then(console.log("Successfully Connected to Database"))
.catch(console.error)