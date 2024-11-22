import axios from "axios";

const MAX_RETRIES = 10; // Maximum attempts
const DELAY_MS = 1000; // Delay between attempts

const healthCheck = async () => {
    const url = "http://localhost:3000/health"; // Adjust to your server's health endpoint
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        try {
            console.log(`Checking server health (${attempts + 1}/${MAX_RETRIES})...`);
            const response = await axios.get(url);
            if (response.status === 200) {
                console.log("Server is healthy.");
                process.exit(0); // Success
            }
        } catch (error) {
            console.log("Server not ready yet...");
        }
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }

    console.error("Server did not become healthy in time.");
    process.exit(1); // Failure
};

healthCheck().then();
