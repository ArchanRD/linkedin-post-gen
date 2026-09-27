import express, { Request, Response } from 'express';
import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { INITIAL_EVENTS } from './src/data/mockInitialData';
import { EventItem, PostImageLayout, PostTone } from './src/types';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '50mb' }));

// In-memory persistent event store initialized with mock data
let eventsStore: EventItem[] = [...INITIAL_EVENTS];

// Server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Fallback high-fidelity SVG card generator for event visual layouts
const createFallbackEventGraphic = (
  eventName: string,
  communityName: string,
  themeType: 'keynote' | 'networking' | 'workshop' | 'showcase' | 'hero',
  index: number
): string => {
  const themes = {
    hero: {
      bg: 'linear-gradient(135deg, #091e3a 0%, #102a45 50%, #004182 100%)',
      accent: '#38bdf8',
      tag: 'FEATURED EVENT KEYNOTE',
      symbol: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    keynote: {
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
      accent: '#818cf8',
      tag: 'MAINSTAGE INSIGHTS',
      symbol: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z',
    },
    networking: {
      bg: 'linear-gradient(135deg, #042f2e 0%, #115e59 50%, #0f766e 100%)',
      accent: '#2dd4bf',
      tag: 'COMMUNITY & CONNECTIONS',
      symbol: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    },
    workshop: {
      bg: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
      accent: '#fbbf24',
      tag: 'DEEP-DIVE LABS & DEMOS',
      symbol: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    showcase: {
      bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
      accent: '#f43f5e',
      tag: 'COLLABORATIVE HIGHLIGHT',
      symbol: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    },
  };

  const selected = themes[themeType] || themes.hero;
  const escapedName = eventName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedCommunity = communityName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c1222" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
      <pattern id="grid-${index}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="800" fill="url(#grad-${index})"/>
    <rect width="1200" height="800" fill="url(#grid-${index})"/>
    
    <!-- Outer ambient lighting circles -->
    <circle cx="950" cy="150" r="300" fill="${selected.accent}" opacity="0.12" filter="blur(60px)"/>
    <circle cx="200" cy="700" r="250" fill="#3b82f6" opacity="0.10" filter="blur(50px)"/>
    
    <!-- Top badge -->
    <g transform="translate(80, 90)">
      <rect x="0" y="0" width="280" height="40" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
      <circle cx="24" cy="20" r="6" fill="${selected.accent}"/>
      <text x="42" y="25" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">${selected.tag}</text>
    </g>

    <!-- Main title & community branding -->
    <text x="80" y="260" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">
      ${escapedName.length > 34 ? escapedName.substring(0, 32) + '...' : escapedName}
    </text>
    <text x="80" y="325" fill="rgba(255,255,255,0.7)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="500">
      Presented by ${escapedCommunity}
    </text>

    <!-- Visual feature card inside image -->
    <g transform="translate(80, 420)">
      <rect x="0" y="0" width="1040" height="260" rx="24" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
      <circle cx="80" cy="130" r="44" fill="rgba(255,255,255,0.06)" stroke="${selected.accent}" stroke-width="2"/>
      <path d="${selected.symbol}" transform="translate(62, 112) scale(1.5)" fill="none" stroke="${selected.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      
      <text x="160" y="115" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700">Official Event Showcase Snapshot</text>
      <text x="160" y="160" fill="rgba(255,255,255,0.65)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20">Verified Attendee &amp; Community Experience</text>
      <text x="160" y="200" fill="${selected.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" letter-spacing="1">ENGAGEPULSE AI VERIFIED BADGE • LINKEDIN READY</text>
    </g>

    <!-- Bottom branding watermark -->
    <text x="1080" y="745" text-anchor="end" fill="rgba(255,255,255,0.4)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600">#${escapedCommunity.replace(/\s+/g, '')} • ${index + 1}</text>
  </svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

// ======================== API ROUTES ========================

// 1. Get all events
app.get('/api/events', (_req: Request, res: Response) => {
  res.json({ events: eventsStore });
});

// 2. Get single event
app.get('/api/events/:id', (req: Request, res: Response) => {
  const event = eventsStore.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json({ event });
});

// 3. Create new event (Organizer)
app.post('/api/events', (req: Request, res: Response) => {
  const { name, date, communityName, communitySocialLink, description, keyTakeaways, speakers, location, category, organizerEmail } = req.body;

  if (!name || !date || !communityName || !communitySocialLink) {
    return res.status(400).json({ error: 'Event name, date, community name, and community social link are required.' });
  }

  const newEvent: EventItem = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    date: date.trim(),
    communityName: communityName.trim(),
    communitySocialLink: communitySocialLink.trim(),
    description: description?.trim() || `An engaging community event organized by ${communityName}.`,
    keyTakeaways: Array.isArray(keyTakeaways) && keyTakeaways.length > 0 
      ? keyTakeaways 
      : ['Practical insights and real-world implementation strategies', 'High-value peer networking and collaboration'],
    speakers: Array.isArray(speakers) ? speakers : [],
    location: location?.trim() || 'Virtual / In-person Venue',
    category: category?.trim() || 'Tech & Professional',
    organizerEmail: organizerEmail || 'organizer@community.org',
    registeredAttendees: [],
    createdAt: new Date().toISOString(),
  };

  eventsStore.unshift(newEvent);
  console.log(`[Event Created] ${newEvent.name} by ${newEvent.communityName}`);
  res.status(201).json({ event: newEvent });
});

// 4. Register attendee email for an event (Public form)
app.post('/api/events/:id/register', (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required to register.' });
  }

  const eventIndex = eventsStore.findIndex((e) => e.id === id);
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  const targetEvent = eventsStore[eventIndex];
  const normalizedEmail = email.trim().toLowerCase();

  const alreadyRegistered = targetEvent.registeredAttendees.some(
    (a) => a.email.toLowerCase() === normalizedEmail
  );

  if (!alreadyRegistered) {
    targetEvent.registeredAttendees.push({
      email: normalizedEmail,
      registeredAt: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    message: alreadyRegistered ? 'Already registered for this event!' : 'Successfully registered for event!',
    event: targetEvent,
    email: normalizedEmail,
  });
});

// 5. Get registered events for an attendee email
app.get('/api/registrations/:email', (req: Request, res: Response) => {
  const normalizedEmail = decodeURIComponent(req.params.email).trim().toLowerCase();
  const registeredEvents = eventsStore.filter((event) =>
    event.registeredAttendees.some((att) => att.email.toLowerCase() === normalizedEmail)
  );
  res.json({ registeredEvents });
});

// 6. Gemini Post Copy Generation
async function generatePostContentWithGemini(params: {
  eventName: string;
  communityName: string;
  communitySocialLink: string;
  date: string;
  description?: string;
  keyTakeaways?: string[];
  attendeeNotes?: string;
  tone?: PostTone;
  userName?: string;
  userHeadline?: string;
}) {
  const ai = getGeminiClient();
  const tone = params.tone || 'Enthusiastic & Inspiring';

  const prompt = `You are an elite LinkedIn ghostwriter crafting a viral, authentic, high-impact LinkedIn post for an attendee or speaker who just attended an event.

Event Name: ${params.eventName}
Host Community: ${params.communityName}
Community Social Profile: ${params.communitySocialLink}
Date: ${params.date}
Event Details: ${params.description || 'High impact event'}
Key Event Takeaways: ${(params.keyTakeaways || []).join(' | ')}
Attendee's Personal Notes & Reflections: ${params.attendeeNotes || 'Gained tremendous perspective on modern workflows and connected with inspiring leaders.'}
Post Tone Style: ${tone}
Attendee Name: ${params.userName || 'Event Attendee'}
Attendee Headline: ${params.userHeadline || 'Passionate Builder & Community Member'}

Requirements for the LinkedIn post:
1. Hook: Start with a gripping 1-2 sentence hook that stops the scroll (no generic "I am thrilled to announce" or cliché AI phrases like "Unleash" or "Elevate"). Make it human, memorable, and thought-provoking.
2. Body:
   - Share 2 to 3 sharp, punchy takeaways or epiphanies from the event formatted with clear spacing or bullet points.
   - Mention what made the session by ${params.communityName} unforgettable.
   - Weave in the attendee's personal perspective organically.
3. Call to Action (CTA): An engaging, open question or prompt inviting the network to discuss or connect.
4. Mentions & Tags: Explicitly tag the community (${params.communityName}) and reference their link (${params.communitySocialLink}).
5. Hashtags: Include 4-6 relevant, high-traffic professional hashtags (e.g., #AI #Community #Leadership).

Respond strictly with valid JSON conforming to this schema:
{
  "postText": "The complete post text ready to paste on LinkedIn, including line breaks, emojis if suitable for LinkedIn tone, and hashtags at the end.",
  "headlineHook": "The first punchy sentence of the post",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "hashtags": ["#Tag1", "#Tag2", "#Tag3"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an award-winning executive branding specialist who writes viral LinkedIn posts that feel 100% human, insightful, and authentic.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            postText: { type: Type.STRING },
            headlineHook: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['postText', 'headlineHook', 'keyTakeaways', 'hashtags'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('[Gemini Post Generation Error]', error);
    // Graceful fallback copy if API call fails
    return {
      headlineHook: `Just wrapped up an unforgettable session at ${params.eventName} hosted by ${params.communityName}.`,
      postText: `Just wrapped up an unforgettable session at ${params.eventName} hosted by ${params.communityName}.\n\nWhen great builders gather, the energy is contagious. Here are 3 major realizations from today:\n\n1. The fastest teams are those investing heavily in autonomous execution loops.\n2. True innovation happens when community-driven collaboration meets rigorous technical craft.\n3. The future belongs to those who show up, build in public, and share their learnings.\n\n${params.attendeeNotes ? `Personal highlight: "${params.attendeeNotes}"\n\n` : ''}Huge thank you to the entire team at ${params.communityName} (${params.communitySocialLink}) for putting together such an exceptional event!\n\nWhat is your biggest focus this quarter? Let's connect in the comments below.\n\n#Community #Innovation #TechLeadership #LearningInPublic #EventHighlights`,
      keyTakeaways: [
        'Autonomous execution loops drive exponential velocity.',
        'Community-driven knowledge sharing accelerates real engineering.',
        'Continuous upskilling and open dialogue define top-tier practitioners.'
      ],
      hashtags: ['#Community', '#Innovation', '#TechLeadership', '#EventHighlights'],
    };
  }
}

// 7. Gemini Image Generation for Layout
async function generateImagesWithGemini(params: {
  eventName: string;
  communityName: string;
  layout: PostImageLayout;
  description?: string;
  category?: string;
}) {
  const ai = getGeminiClient();
  const count = params.layout === 'single-hero' ? 1 
    : params.layout === 'dual-split' ? 2 
    : params.layout === 'triptych-grid' ? 3 
    : 4;

  const themes: ('hero' | 'keynote' | 'networking' | 'workshop' | 'showcase')[] = [
    'hero',
    'keynote',
    'networking',
    'workshop',
    'showcase'
  ];

  const imageSpecs = [];
  for (let i = 0; i < count; i++) {
    const theme = themes[i % themes.length];
    imageSpecs.push({
      index: i,
      theme,
      prompt: `A modern, high-end professional photograph capturing a moment from an elite tech conference titled "${params.eventName}" organized by "${params.communityName}". Theme: ${theme}. Visual elements: polished stage lighting, keynote presentation on massive high-resolution screen, engaged tech professionals in a sleek convention auditorium, cinematic depth of field, photorealistic, premium editorial quality, no awkward text overlays.`,
    });
  }

  // Attempt parallel generation for each image slot
  const generatedImages = await Promise.all(
    imageSpecs.map(async (spec) => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: spec.prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: spec.index === 0 && params.layout === 'single-hero' ? '16:9' : '1:1',
            },
          },
        });

        // Search for image in returned parts
        let imageUrl: string | null = null;
        for (const candidate of response.candidates || []) {
          for (const part of candidate.content?.parts || []) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              imageUrl = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }
          if (imageUrl) break;
        }

        if (imageUrl) {
          return {
            id: `img-${Date.now()}-${spec.index}`,
            url: imageUrl,
            alt: `${params.eventName} - ${spec.theme}`,
            caption: `${params.communityName} • ${spec.theme.toUpperCase()}`,
          };
        }
      } catch (err) {
        console.warn(`[Gemini Image Generation fallback for slot ${spec.index}]`, (err as Error).message);
      }

      // High-fidelity fallback SVG card if model isn't provisioned or hit quota
      const fallbackUrl = createFallbackEventGraphic(params.eventName, params.communityName, spec.theme, spec.index);
      return {
        id: `img-fb-${Date.now()}-${spec.index}`,
        url: fallbackUrl,
        alt: `${params.eventName} - ${spec.theme} Showcase`,
        caption: `${params.communityName} • ${spec.theme.toUpperCase()}`,
      };
    })
  );

  return generatedImages;
}

// 8. Generate LinkedIn Post & Images in PARALLEL endpoint
app.post('/api/gemini/generate-full-post', async (req: Request, res: Response) => {
  const {
    eventId,
    eventName,
    communityName,
    communitySocialLink,
    date,
    description,
    keyTakeaways,
    attendeeNotes,
    tone,
    layout,
    userName,
    userHeadline,
  } = req.body;

  if (!eventName || !communityName) {
    return res.status(400).json({ error: 'eventName and communityName are required.' });
  }

  const selectedLayout: PostImageLayout = layout || 'dual-split';
  console.log(`[Gemini Parallel Request] Generating post & ${selectedLayout} images for ${eventName}`);

  try {
    // PARALLEL EXECUTION: Content + Images
    const [postData, images] = await Promise.all([
      generatePostContentWithGemini({
        eventName,
        communityName,
        communitySocialLink,
        date,
        description,
        keyTakeaways,
        attendeeNotes,
        tone,
        userName,
        userHeadline,
      }),
      generateImagesWithGemini({
        eventName,
        communityName,
        layout: selectedLayout,
        description,
      }),
    ]);

    res.json({
      postText: postData.postText,
      headlineHook: postData.headlineHook,
      keyTakeaways: postData.keyTakeaways || [],
      hashtags: postData.hashtags || [],
      mentions: [communityName, communitySocialLink],
      images,
      layout: selectedLayout,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Gemini Parallel Generation Fatal]', err);
    res.status(500).json({ error: 'Failed to generate post and images', details: (err as Error).message });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] EngagePulse listening on http://0.0.0.0:${PORT}`);
  });
}

// In standard Node / AI Studio / Cloud Run container, start listening.
// In Vercel serverless functions, Vercel imports and wraps `app`.
if (!process.env.VERCEL) {
  startServer();
}

export default app;
