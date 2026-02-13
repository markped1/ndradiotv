
import { GoogleGenAI } from "@google/genai";
import fetch from 'node-fetch'; // assuming node environment for test

import fs from 'fs';
import path from 'path';

// Manual .env parsing
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.error("Error loading .env:", e);
}

// Keys from Environment
const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY;
const ELEVEN_KEY = process.env.VITE_ELEVENLABS_API_KEY;

async function testChain() {
    if (!GEMINI_KEY || !ELEVEN_KEY) {
        console.error('❌ Keys missing in .env');
        return;
    }
    console.log('🚀 Starting Full Chain Verification...');
    console.log(`🔑 Gemini Key: ${GEMINI_KEY.substring(0, 5)}...`);
    console.log(`🔑 Eleven Key: ${ELEVEN_KEY.substring(0, 5)}...`);

    // 1. Fetch News
    console.log('1️⃣ fetching news from Gemini (gemini-2.0-flash)...');
    const genAI = new GoogleGenAI({ apiKey: GEMINI_KEY });
    let newsContent = "";

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: 'user', parts: [{ text: "Write 3 short fake news headlines about Nigeria." }] }]
        });
        newsContent = response.text || "";
        console.log('✅ Gemini Response:', newsContent.substring(0, 50) + '...');
    } catch (e) {
        console.error('❌ Gemini Failed:', e);
        return;
    }

    // 2. Construct Script
    const fullScript = `This is a test broadcast. ${newsContent} That was the news.`;
    console.log(`2️⃣ Generated Script (${fullScript.length} chars). Sending to ElevenLabs...`);

    // 3. Generate Audio
    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVEN_KEY,
                },
                body: JSON.stringify({
                    text: fullScript,
                    model_id: 'eleven_flash_v2_5',
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
            }
        );

        if (!response.ok) {
            console.error(`❌ ElevenLabs Failed: ${response.status}`);
            const err = await response.text();
            console.error('Error Body:', err);
        } else {
            const arrayBuffer = await response.arrayBuffer();
            console.log(`✅ Success! Audio generated: ${arrayBuffer.byteLength} bytes`);
        }

    } catch (e) {
        console.error('❌ ElevenLabs Network Error:', e);
    }
}

testChain();
