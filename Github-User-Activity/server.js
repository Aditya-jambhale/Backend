const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API route to fetch GitHub commits
app.get('/api/github/:username', (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json({ error: "Please provide a GitHub username." });
    }

    const url = `https://api.github.com/users/${username}/events`;
    const options = {
        headers: {
            'User-Agent': 'Node.js Backend'
        }
    };

    https.get(url, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                try {
                    const events = JSON.parse(data);

                    // Filter only PushEvent and extract commit details
                    const commits = events
                        .filter(event => event.type === 'PushEvent')
                        .flatMap(event =>
                            event.payload.commits.map(commit => ({
                                repo: event.repo.name,
                                message: commit.message,
                                timestamp: event.created_at
                            }))
                        );

                    res.json({ commits });
                } catch (error) {
                    res.status(500).json({ error: "Failed to parse GitHub API response." });
                }
            } else if (response.statusCode === 404) {
                res.status(404).json({ error: "User not found." });
            } else if (response.statusCode === 403) {
                res.status(403).json({ error: "Rate limit exceeded. Try again later." });
            } else {
                res.status(response.statusCode).json({ error: response.statusMessage });
            }
        });
    }).on('error', (err) => {
        res.status(500).json({ error: "Failed to connect to GitHub API.", details: err.message });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
