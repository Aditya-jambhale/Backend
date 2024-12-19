const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API route to fetch GitHub activity
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

                    const activity = events.map(event => {
                        let activityText = '';
                        switch (event.type) {
                            case 'PushEvent':
                                activityText = `Pushed ${event.payload.commits.length} commits to ${event.repo.name}`;
                                break;

                            case 'IssuesEvent':
                                activityText = `${event.payload.action} an issue in ${event.repo.name}`;
                                break;

                            case 'WatchEvent':
                                activityText = `Starred ${event.repo.name}`;
                                break;

                            default:
                                activityText = `Performed ${event.type} in ${event.repo.name}`;
                        }
                        return activityText;
                    });

                    res.json({ activity });
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
