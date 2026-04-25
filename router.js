const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const ALLOWED_DOMAINS = new Set([
    "youcanaccessany", "op", "color", "nob", "wallah", "we", "us", "io", "com", "net", "org", "edu", "gov", "mil", "int", "info", "biz", "name", "pro", "onion", "i2p", "tor",
    "am", "as", "at", "be", "by", "do", "go", "he", "hi", "if", "in", "is", 
    "it", "me", "my", "no", "of", "on", "or", "so", "to", "up", "us", "we",
    "action", "active", "advice", "animal", "answer", "artist", "beauty", 
    "better", "bright", "camera", "chance", "change", "coffee", "create", 
    "decide", "dinner", "doctor", "energy", "family", "flower", "friend", 
    "garden", "health", "listen", "market", "modern", "nature", "number", 
    "office", "people", "planet", "player", "public", "school", "simple", 
    "strong", "summer", "system", "travel", "winter"
]);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/visit', (req, res) => {
    let rawUrl = req.query.url;
    if (!rawUrl) return res.status(400).send("No URL provided");

    try {
        if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
            rawUrl = 'http://' + rawUrl;
        }

        const urlObj = new URL(rawUrl);
        const cleanHostname = urlObj.hostname.replace(/^www\./, '').toLowerCase();
        const parts = cleanHostname.split('.');

        if (parts.length === 2) {
            const baseName = parts[0];
            const extension = parts[1];

            if (ALLOWED_DOMAINS.has(extension)) {

                let fileName = `${baseName}-${extension}.html`;
                if (baseName === 'youcanaccessany' && extension === 'op') {
                    fileName = 'mainwebsite.html';
                }

                const filePath = path.join(__dirname, 'websites', fileName);

                if (fs.existsSync(filePath)) {
                    return res.sendFile(filePath);
                } else {
                    return res.status(404).send(`
                        <body style="background-color: #202124; color: #e8eaed; font-family: Tahoma, sans-serif; text-align: center; padding-top: 50px;">
                            <h1>404: Data Not Found</h1>
                            <p>The extension <b>.${extension}</b> is allowed.</p>
                            <p>To fix this blank screen, create the file: <code>websites/${fileName}</code> on your server.</p>
                        </body>
                    `);
                }
            }
        }

        res.redirect(rawUrl);

    } catch (e) {
        res.status(500).send("Invalid URL Format");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gateway running on port ${PORT}`);
});
