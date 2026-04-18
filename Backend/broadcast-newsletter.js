// broadcast-newsletter.js
// Run this script whenever you want to email your subscribers!
// Command to run (inside Backend folder): node broadcast-newsletter.js

// =====================================================================
// STEP 1: EDIT THESE 3 VARIABLES BEFORE YOU RUN THE SCRIPT
// =====================================================================
const ARTICLE_TITLE = "The Heart of the Machine: How a Fighter Jet Engine Generates Supersonic Thrust";
const ARTICLE_LINK = "https://www.aeroxplore.in/blog/f-15";
const ARTICLE_EXCERPT = "From the raw Mach 2.5 power of the classic F-15A to the high-tech \"missile truck\" capabilities of the new F-15EX, the Eagle has never been shot down in air combat. Explore the evolution, the massive 29,500lb payload, and the legendary history of the world's most lethal fighter.";


// =====================================================================
// STEP 2: DO NOT TOUCH THIS PART (Unless you change passwords/URLs)
// =====================================================================
const API_URL = "https://aero-xplore-in-jxjv.vercel.app/api/notify-subscribers";

require('dotenv').config();
const NOTIFY_SECRET = process.env.NOTIFY_SECRET;

async function sendNewsletter() {
  console.log(`🚀 Sending email blast for: "${ARTICLE_TITLE}"...`);
  console.log(`⏳ Please wait, contacting Vercel server...`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret: NOTIFY_SECRET,
        title: ARTICLE_TITLE,
        link: ARTICLE_LINK,
        excerpt: ARTICLE_EXCERPT
      })
    });

    const data = await response.json();
    
    if (response.ok) {
        console.log("✅ SUCCESS! Your email has been delivered to all subscribers.");
    } else {
        console.error("❌ FAILED:", data.message || data);
    }
  } catch(error) {
     console.error("❌ Connection Error:", error.message);
     console.log("Are you sure you are connected to the internet?");
  }
}

sendNewsletter();
