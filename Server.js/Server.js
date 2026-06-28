const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Endpoint to fetch git commits for Git Pulse widget
app.get("/api/git-pulse", (req, res) => {
    exec('git log -n 10 --pretty=format:"%h|%an|%ar|%s"', (error, stdout, stderr) => {
        if (error || !stdout.trim()) {
            // Return mock/placeholder commits if not in a git repo or if git fails
            return res.json([
                { hash: "7b4c3e2", author: "Sai Spoorthy E", time: "2 hours ago", message: "Goal-5: Added interactive Git Pulse tracker" },
                { hash: "a1f8e92", author: "Sai Spoorthy E", time: "4 hours ago", message: "Goal-4: Connected Next Random User to search engine" },
                { hash: "f3c2b8d", author: "Sai Spoorthy E", time: "1 day ago", message: "Goal-3: Designed premium theme toggler" },
                { hash: "b2d5a6c", author: "Sai Spoorthy E", time: "2 days ago", message: "Goal-2: Designed cards with click-to-flip ID details" },
                { hash: "e9d8c7b", author: "Sai Spoorthy E", time: "3 days ago", message: "Goal-1: Integrated Navbar & search with auto-suggest" }
            ]);
        }
        const commits = stdout.trim().split("\n").filter(Boolean).map(line => {
            const [hash, author, time, message] = line.split("|");
            return { 
                hash: hash || "unknown", 
                author: author || "Sai Spoorthy E", 
                time: time || "recently", 
                message: message || "Commit" 
            };
        });
        res.json(commits);
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});