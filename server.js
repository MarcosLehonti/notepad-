// Servidor de desarrollo local — simula las funciones serverless de Vercel
// Solo se usa en local con: npm run dev
// En producción (Vercel) usa api/gemini.js directamente

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar .env manualmente
try {
  const envPath = join(dirname(fileURLToPath(import.meta.url)), '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch (_) {
  // No .env file found
}

// Importar el handler de la función
const { default: geminiHandler } = await import('./api/gemini.js');

const PORT = 3001;

const server = createServer(async (req, res) => {
  if (req.url === '/api/gemini') {
    // Parsear body
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body || '{}');
      } catch {
        req.body = {};
      }

      // Adaptador res simple
      const mockRes = {
        _headers: {},
        _status: 200,
        setHeader(k, v) { res.setHeader(k, v); },
        status(code) { this._status = code; return this; },
        json(data) {
          res.writeHead(this._status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        },
        end() { res.end(); },
      };

      const { default: handler } = await import(`./api/gemini.js?t=${Date.now()}`);
      await handler(req, mockRes);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`\x1b[33m⚠\x1b[0m Puerto ${PORT} ya en uso, el servidor API ya está corriendo.`);
    // No crashear — Vite igual puede levantar
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`\x1b[32m✓\x1b[0m API local corriendo en http://localhost:${PORT}/api/gemini`);
});
