const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const fileRoutes = require('./routes/fileRoutes');
const shareRoutes = require('./routes/shareRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'https://mini-docs-bslg.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/shares', shareRoutes);

app.use(errorMiddleware);

module.exports = app;
