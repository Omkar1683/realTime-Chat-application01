const mongoose = require('mongoose');
const User = require('./models/user.model');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    // Check if testuser exists
    const existing = await User.findOne({ email: "testuser@example.com" });
    if (!existing) {
        await User.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123"
        });
        console.log("Created testuser@example.com");
    } else {
        console.log("testuser@example.com already exists");
    }

    // Check for a secondary user so ChatTest has someone to talk to
    const otherUser = await User.findOne({ email: "otheruser@example.com" });
    if (!otherUser) {
        await User.create({
            username: "otheruser",
            email: "otheruser@example.com",
            password: "password123"
        });
        console.log("Created otheruser@example.com");
    }

    mongoose.connection.close();
}).catch(console.error);
