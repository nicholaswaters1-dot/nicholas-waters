import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow base64 audio payloads up to 15MB
  app.use(express.json({ limit: '15mb' }));

  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment.');
    }
    return new GoogleGenAI({ apiKey });
  };

  // 1. Audio Transcription Endpoint using gemini-3.5-transcribe
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'Missing audioBase64 payload' });
      }

      const ai = getAiClient();
      const audioPart = {
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            audioPart,
            {
              text: 'Transcribe this audio accurately. Return only the spoken words without extra commentary.',
            },
          ],
        },
      });

      return res.json({
        transcript: (response.text || '').trim(),
      });
    } catch (error: any) {
      console.error('Gemini Audio Transcription Error:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to transcribe audio',
      });
    }
  });

  // 2. Google Maps Grounding Endpoint using gemini-3.5-flash (with fallback to gemini-3.8-flash if needed)
  app.post('/api/maps-grounding', async (req, res) => {
    try {
      const { query, latitude, longitude } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
      }

      const ai = getAiClient();
      const lat = typeof latitude === 'number' ? latitude : 51.5618;
      const lng = typeof longitude === 'number' ? longitude : -0.1653;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: query,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: lat,
                  longitude: lng,
                },
              },
            },
          },
        });
      } catch (innerErr: any) {
        // If gemini-3.5-flash returns 404 in a region, fallback to gemini-3.8-flash with googleMaps
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: query,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: lat,
                  longitude: lng,
                },
              },
            },
          },
        });
      }

      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const places: {
        title: string;
        uri: string;
        reviewSnippets: string[];
      }[] = [];

      for (const chunk of groundingChunks as any[]) {
        if (chunk?.maps?.uri) {
          const snippets: string[] = [];
          const sources = chunk.maps.placeAnswerSources?.reviewSnippets;
          if (Array.isArray(sources)) {
            for (const s of sources) {
              if (typeof s === 'string') snippets.push(s);
              else if (s?.text) snippets.push(s.text);
              else if (s?.reviewText) snippets.push(s.reviewText);
            }
          }
          places.push({
            title: chunk.maps.title || 'View Place on Google Maps',
            uri: chunk.maps.uri,
            reviewSnippets: snippets,
          });
        }
      }

      return res.json({
        text: response.text || '',
        places,
      });
    } catch (error: any) {
      console.error('Gemini Maps Grounding Error:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to fetch Google Maps Grounding data',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`My Paws Walks server running on http://localhost:${PORT}`);
  });
}

startServer();
