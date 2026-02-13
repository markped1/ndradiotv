
import fs from 'fs';

async function listVoices() {
    let keys = [];
    try {
        const env = fs.readFileSync('.env', 'utf8');
        const lines = env.split(/\r?\n/);
        for (const line of lines) {
            const match = line.match(/^VITE_ELEVENLABS_API_KEY=(.+)$/);
            if (match) {
                const rawKeys = match[1].trim().replace(/^["']|["']$/g, '');
                keys = rawKeys.split(',').map(k => k.trim()).filter(k => k.length > 0);
                break;
            }
        }
    } catch (e) {
        console.error("Error reading .env:", e.message);
    }

    if (keys.length === 0) {
        console.error("No API key found in .env");
        return;
    }

    for (const key of keys) {
        console.log(`Trying key: length=${key.length}, start=${key.substring(0, 4)}, end=${key.slice(-4)}`);
        try {
            const response = await fetch('https://api.elevenlabs.io/v1/voices', {
                headers: { 'xi-api-key': key }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("✅ SUCCESS with key:", key.substring(0, 5) + "...");
                console.log("AVAILABLE VOICES:");
                data.voices.forEach(v => {
                    console.log(`- ${v.name} (${v.voice_id}): ${v.labels?.accent || 'No Accent'} [${v.category}]`);
                });
                return; // Stop after success
            } else {
                console.error(`❌ Key failed: ${response.status}`);
            }
        } catch (e) {
            console.error("Fetch Error:", e.message);
        }
    }
    console.error("All keys failed to list voices.");
}

listVoices();
