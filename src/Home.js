import React, { useState } from 'react';
import './home.css';

function Home() {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState('');
    const [response, setResponse] = useState(null);

    function formatResponse(response) {
        // Remove leading and trailing quotes
        response = response.slice(1, -1);
        // Replace escaped newline characters (\n) with actual newline characters
        response = response.replace(/\\n/g, '\n');
        // Replace other escaped characters if necessary

        return response;
    }

    const handleClick = async () => {
        if (!url) {
            setResponse('Please enter a valid YouTube URL');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoUrl: url }),
            });

            if (res.status === 200) {
                const result = await res.json();
                const formattedResponse = formatResponse(result);
                setResponse(formattedResponse);
            } else {
                setResponse('Caption not available');
            }
        } catch (error) {
            console.error('Error:', error);
            setResponse('There is something wrong, Please try again');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setUrl(event.target.value);
    };
    console.log(url);
    return (
        <div className="container">
            <div className="logo">
                <h1>YouTube Summarizer</h1>
            </div>
            <div className="video-url">
                <input
                    type="text"
                    width={100}
                    placeholder="YouTube video URL"
                    onChange={handleChange}
                    value={url}
                />
                <button onClick={handleClick} disabled={loading}>
                    {loading ? 'Loading...' : 'Get'}
                </button>
            </div>
            {response && <div className="summary" style={{ whiteSpace: 'pre-line' }}>
                <p>{response}</p>
            </div>}
            {/* <div className="summary">
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, voluptatum velit ipsa laborum quod voluptates iure quasi commodi dicta alias optio dolores nulla doloremque sint modi ratione harum voluptatem mollitia.</p>
            </div> */}
        </div>
    );
}

export default Home;