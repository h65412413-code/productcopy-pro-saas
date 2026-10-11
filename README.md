# ProductCopy Pro SaaS

A SaaS-style product copy generator with:
- Login / signup
- History tracking
- Pricing page
- Dashboard UI
- AI-powered generation with fallback local generator

## Run locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Features

- Email/password auth
- JWT session
- Save generated copy to history
- Pricing section
- Dashboard to generate product copy
- OpenAI integration via `OPENAI_API_KEY` if available
- Local fallback generator if no API key present

## Environment variables

Create a `.env` file:

```bash
JWT_SECRET=your-secret
OPENAI_API_KEY=your-key-here
```

## Monetization model

- Free: 5 generations / month
- Pro: $19/month
- Agency: $49/month
