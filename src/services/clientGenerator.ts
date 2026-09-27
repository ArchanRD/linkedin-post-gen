import { GeneratePostRequest, GeneratedPostResponse, PostImageLayout, GeneratedImageItem } from '../types';

export function createClientEventGraphic(
  eventName: string,
  communityName: string,
  themeType: 'keynote' | 'networking' | 'workshop' | 'showcase' | 'hero',
  index: number
): string {
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
  const escapedName = (eventName || 'Community Summit').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedCommunity = (communityName || 'Tech Community').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="client-grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c1222" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
      <pattern id="client-grid-${index}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="800" fill="url(#client-grad-${index})"/>
    <rect width="1200" height="800" fill="url(#client-grid-${index})"/>
    
    <circle cx="950" cy="150" r="300" fill="${selected.accent}" opacity="0.12"/>
    <circle cx="200" cy="700" r="250" fill="#3b82f6" opacity="0.10"/>
    
    <g transform="translate(80, 90)">
      <rect x="0" y="0" width="280" height="40" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
      <circle cx="24" cy="20" r="6" fill="${selected.accent}"/>
      <text x="42" y="25" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">${selected.tag}</text>
    </g>

    <text x="80" y="260" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="50" font-weight="800" letter-spacing="-1">
      ${escapedName.length > 34 ? escapedName.substring(0, 32) + '...' : escapedName}
    </text>
    <text x="80" y="325" fill="rgba(255,255,255,0.7)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="500">
      Presented by ${escapedCommunity}
    </text>

    <g transform="translate(80, 420)">
      <rect x="0" y="0" width="1040" height="260" rx="24" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
      <circle cx="80" cy="130" r="44" fill="rgba(255,255,255,0.06)" stroke="${selected.accent}" stroke-width="2"/>
      <path d="${selected.symbol}" transform="translate(62, 112) scale(1.5)" fill="none" stroke="${selected.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      
      <text x="160" y="115" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700">Official Event Showcase Snapshot</text>
      <text x="160" y="160" fill="rgba(255,255,255,0.65)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20">Verified Attendee &amp; Community Experience</text>
      <text x="160" y="200" fill="${selected.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" letter-spacing="1">ENGAGEPULSE AI VERIFIED BADGE • LINKEDIN READY</text>
    </g>

    <text x="1080" y="745" text-anchor="end" fill="rgba(255,255,255,0.4)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600">#${escapedCommunity.replace(/\s+/g, '')} • ${index + 1}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const REAL_CONFERENCE_PHOTOS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
];

export function generateClientFallbackPost(request: GeneratePostRequest): GeneratedPostResponse {
  const {
    eventName,
    communityName,
    communitySocialLink,
    layout = 'text-up-image-below',
    tone = 'Enthusiastic & Inspiring',
    attendeeNotes,
    customPrompt,
    imagePrompt,
    keyTakeaways = [],
  } = request;

  // Generate minimum 5 images for every layout as requested
  const count = 5;
  const themes: ('hero' | 'keynote' | 'networking' | 'workshop' | 'showcase')[] = [
    'hero',
    'keynote',
    'networking',
    'workshop',
    'showcase',
  ];

  const images: GeneratedImageItem[] = [];
  for (let i = 0; i < count; i++) {
    const theme = themes[i % themes.length];
    const photoKeywords = imagePrompt && imagePrompt.trim().length > 0
      ? `${imagePrompt.trim()} ${theme}`
      : theme === 'keynote' ? 'keynote speaker presentation stage lighting conference audience'
      : theme === 'networking' ? 'tech professionals networking conference lounge discussion coffee'
      : theme === 'workshop' ? 'interactive developer workshop laptops coding presentation room'
      : theme === 'showcase' ? 'tech conference exhibition floor modern booth presentation'
      : 'large tech conference mainstage auditorium crowd lighting 8k';

    // Generates real AI photograph dynamically using Flux photorealistic synthesis
    const realPhotoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${photoKeywords} photorealistic modern tech event`)}?width=1200&height=800&nologo=true&model=flux&seed=${i * 73 + 17}`;

    images.push({
      id: `client-img-${Date.now()}-${i}`,
      url: realPhotoUrl,
      alt: `${eventName} - ${theme}`,
      caption: `${communityName} • ${theme.toUpperCase()}`,
      modelUsed: 'Nano Banana Compatible (Flux Synthesized)',
    });
  }

  const cleanCommunityTag = communityName.replace(/\s+/g, '');
  const cleanEventTag = eventName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);

  // If user provided a specific prompt, build directly from their prompt directives without inventing unrequested content
  let postCopy: string;
  if (customPrompt && customPrompt.trim().length > 0) {
    postCopy = `${customPrompt.trim()}

${attendeeNotes ? `Personal note: "${attendeeNotes}"\n\n` : ''}Attended ${eventName} hosted by ${communityName} (${communitySocialLink}).

What are your thoughts on this? Let's connect in the comments below! 👇

#${cleanEventTag} #${cleanCommunityTag} #TechCommunity #Innovation #Leadership`;
  } else {
    postCopy = `Just wrapped up an incredible session at ${eventName} hosted by ${communityName}!

When ambitious builders and passionate practitioners come together under one roof, the collective momentum is undeniable. Here are 3 core realizations that stood out to me:

1. The fastest-moving engineering teams are prioritizing autonomous execution and rapid feedback cycles over manual complexity.
2. Breakthrough innovation doesn't happen in silos—it thrives when collaborative communities actively share their real-world production learnings.
3. Showing up, building openly in public, and fostering authentic peer relationships is the single highest-leverage career accelerator.

${attendeeNotes ? `💡 Personal highlight from my notes:\n"${attendeeNotes}"\n\n` : ''}Huge gratitude to the entire team at ${communityName} (${communitySocialLink}) for curating such a world-class gathering and elevating the community!

What was your biggest technical or leadership takeaway this month? I'd love to hear your thoughts in the comments below! 👇

#${cleanEventTag} #${cleanCommunityTag} #TechCommunity #Leadership #Engineering #Innovation #ContinuousLearning`;
  }

  return {
    postText: postCopy,
    headlineHook: customPrompt ? customPrompt.split('\n')[0].slice(0, 100) : `Just wrapped up an incredible session at ${eventName} hosted by ${communityName}!`,
    keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : [
      'Prioritize autonomous execution and rapid feedback cycles.',
      'Community knowledge-sharing accelerates real engineering outcomes.',
      'Open dialogue and building in public drive continuous growth.',
    ],
    hashtags: [`#${cleanEventTag}`, `#${cleanCommunityTag}`, '#TechCommunity', '#Innovation', '#Leadership'],
    mentions: [communityName, communitySocialLink],
    images,
    layout: layout as PostImageLayout,
    generatedAt: new Date().toISOString(),
  };
}
