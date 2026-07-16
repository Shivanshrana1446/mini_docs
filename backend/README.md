# Mini Docs Backend

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

## Environment

Create `.env` with:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mini-docs?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

## Local Start

```bash
npm run dev
```

## Deployment

Use Render for backend hosting. Set the environment variables listed above in your service settings.
