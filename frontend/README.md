# Mini Docs Frontend

## Build

```bash
npm install
npm run build
```

## Environment

Create `.env` from `.env.example` and add:

```env
VITE_API_BASE_URL=https://<your-backend-domain>/api
```

## Deployment

Deploy to Vercel using the root of `frontend/`.
Ensure `vercel.json` is present and the build command is `npm run build`.
