import Anthropic from "@anthropic-ai/sdk";
import cron from "node-cron";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const topics = [
  "AI and tech news today",
  "stock market and crypto prices today",
  "world politics and geopolitics today",
  "Armenia news today",
];

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error("Telegram error: " + JSON.stringify(data));
  console.log("Telegram message sent.");
}

async function runDigest() {
  console.log("Running digest at", new Date().toISOString());

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `Today is ${today}. Search the web and find the most important news from the last 24 hours on these 4 topics:
1. AI & tech news
2. Stock market & crypto prices
3. World politics & geopolitics
4. Armenia news

For each topic write 2-3 concise bullet points with the key facts. Be direct and informative. Format the response cleanly for a Telegram message using this structure:

📰 <b>Daily Digest — ${today}</b>

🤖 <b>AI & Tech</b>
• ...
• ...

📈 <b>Stocks & Crypto</b>
• ...
• ...

🌍 <b>World Politics</b>
• ...
• ...

🇦🇲 <b>Armenia</b>
• ...
• ...

Keep each bullet under 25 words. No markdown, use plain text with HTML bold tags only.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  if (!textContent) throw new Error("No text content in response");

  await sendTelegram(textContent);
}

// Run at 11:00 AM Yerevan time (UTC+4 = 07:00 UTC)
cron.schedule("0 7 * * *", () => {
  runDigest().catch((err) => console.error("Digest failed:", err));
});

console.log("News digest bot started. Will run daily at 11:00 AM Yerevan time.");

// Uncomment the line below to test immediately on startup:
// runDigest().catch(console.error);
