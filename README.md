# Daily News Digest Bot

Sends a daily Telegram message at 11:00 AM Yerevan time with AI-curated news on:
- AI & Tech
- Stocks & Crypto
- World Politics
- Armenia

## Deploy to Railway (free)

### 1. Push to GitHub
Create a new repo on github.com and push this folder:
```
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/news-digest.git
git push -u origin main
```

### 2. Deploy on Railway
1. Go to railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your news-digest repo
4. Go to "Variables" tab and add these 3 environment variables:

| Variable | Value |
|---|---|
| ANTHROPIC_API_KEY | your key |
| TELEGRAM_TOKEN | your bot token |
| TELEGRAM_CHAT_ID | your chat ID |

5. Click Deploy — done. The bot runs 24/7 and sends every day at 11am Yerevan.

## Test locally
```
ANTHROPIC_API_KEY=... TELEGRAM_TOKEN=... TELEGRAM_CHAT_ID=... node index.js
```
To test immediately, uncomment the last line in index.js.
