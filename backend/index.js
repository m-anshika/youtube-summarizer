require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require("cors");
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.API_KEY });


const app = express();

app.use(express.json());


const corsOption = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'auth-token', 'Accept', 'Code', 'Origin', 'Authorization'],
    credentials: true
}

app.use(cors(corsOption));


async function summary(text) {
    const chatCompletion = await getGroqChatCompletion(text);
    // Print the completion returned by the LLM.
    return (chatCompletion.choices[0]?.message?.content || "");
}

async function getGroqChatCompletion(text) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Give the summary of " + text + "explaining all the things",
            },
        ],
        model: "llama3-8b-8192",
    });
}


const { YoutubeTranscript } = require('youtube-transcript');

function decodeHtmlEntities(str) {
    return str.replace(/&amp;#39;/g, "'");
}

// Function to fetch and format the YouTube transcript
async function fetchAndFormatTranscript(url) {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);

        // Combine and format the text
        const formattedText = transcript.map(chunk => decodeHtmlEntities(chunk.text)).join(' ');

        let transcriptText = await summary(formattedText);
        var data = JSON.stringify(transcriptText);
        //   console.log(data);
        console.log(transcriptText);
    } catch (error) {
        console.error('Error fetching transcript:', error);
    }
}

// Fetch and format the transcript for the given YouTube video URL
// fetchAndFormatTranscript('https://www.youtube.com/watch?v=TlIX427wKDg&t=308s');

app.post('/summary', async (req, res) => {
    const { videoUrl } = req.body;

    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

        // Combine and format the text
        const formattedText = transcript.map(chunk => decodeHtmlEntities(chunk.text)).join(' ');

        let transcriptText = await summary(formattedText);
        const data = JSON.stringify(transcriptText);
        //   console.log(data);
        // console.log(transcriptText);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(400).json({msg:'Youtube Caption not available'});
    }
});



app.listen(process.env.PORT || 8000, (err) => {
    if (err) {
        console.log("Error while starting the server: " + err);
    } else {
        console.log("Server started on the PORT: " + process.env.PORT);
    }
});