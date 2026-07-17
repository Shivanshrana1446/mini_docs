live url : https://mini-docs-bslg.vercel.app/login

# Mini Docs

AI-native collaborative document editor starter project.

## Structure

- `backend/`: Express API server
- `frontend/`: React + Vite app

## Setup

### Backend

1. `cd backend`
2. `npm install`
3. `cp .env.example .env`
4. Fill `MONGO_URI` and `JWT_SECRET`
5. `npm run dev`

### Supported file import

- Use the dashboard import button to upload a `.txt` or `.md` file.
- The file is converted into a new editable document.
- Only plain text and markdown files are currently supported.

### Frontend

1. `cd frontend`
2. `npm install`
3. `cp .env.example .env`
4. `npm run dev`

## Deployment

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with password.
3. Allow your app IP address in network access or use `0.0.0.0/0` for testing.
4. Copy the connection string and replace username/password and cluster name.

### Render (Backend)

1. Create a new web service on Render.
2. Connect to the backend repository or directory.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional, Render uses its own port variable)

### Vercel (Frontend)

1. Deploy the `frontend/` folder to Vercel.
2. Set `VITE_API_BASE_URL` in Vercel environment variables to your backend's `/api` URL.
3. Build command: `npm run build`
4. Output directory: `dist`
