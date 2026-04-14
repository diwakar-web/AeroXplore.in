// broadcast-newsletter.js
// Run this script whenever you want to email your subscribers!
// Command to run (inside Backend folder): node broadcast-newsletter.js

// =====================================================================
// STEP 1: EDIT THESE 3 VARIABLES BEFORE YOU RUN THE SCRIPT
// =====================================================================
const ARTICLE_TITLE = "Trial Mail";
const ARTICLE_LINK = "https://youtube.com";
const ARTICLE_EXCERPT = "This is a quick summary of my post!";


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
