import './config.mjs';
import './db.mjs';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.use('/api', routes);

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(process.env.PORT ?? 8000);
console.log(`Server listening on ${process.env.PORT ?? 8000}`);