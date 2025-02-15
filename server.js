const express = require("express");
const axios = require("axios");
const app = express();

const VK_APP_ID = "YOUR_VK_APP_ID"; // Replace with your VK App ID
const VK_CLIENT_SECRET = "YOUR_VK_CLIENT_SECRET"; // Replace with your VK Secure Key
const REDIRECT_URI = "http://localhost:3000/auth/vk/callback"; // Replace with your redirect URI

// Handle VK OAuth callback
app.get("/auth/vk/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Authorization code is missing.");
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.get(
            `https://oauth.vk.com/access_token?client_id=${VK_APP_ID}&client_secret=${VK_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`
        );

        const { access_token, user_id } = tokenResponse.data;

        // Fetch user profile
        const profileResponse = await axios.get(
            `https://api.vk.com/method/users.get?user_ids=${user_id}&access_token=${access_token}&v=5.131`
        );

        const userProfile = profileResponse.data.response[0];

        // Save user data or authenticate the user
        console.log("User Profile:", userProfile);

        // Redirect to the to-do section
        res.redirect("/");
    } catch (error) {
        console.error("VK OAuth Error:", error);
        res.status(500).send("Authentication failed.");
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});