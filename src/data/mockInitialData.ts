import { EventItem } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-ai-summit-2026',
    name: 'Global Generative AI & Agents Summit 2026',
    date: '2026-10-15',
    communityName: 'AI Innovators Global',
    communitySocialLink: 'https://linkedin.com/company/ai-innovators-global',
    description: 'An intensive summit exploring autonomous agent orchestration, multimodal reasoning, and production deployments of Gemini 3 series models.',
    keyTakeaways: [
      'Multi-agent architectures are shifting from simple prompt chains to goal-directed autonomous loops.',
      'Latency reduction strategies using lightweight edge models and streaming inference.',
      'Responsible AI guardrails and deterministic function evaluation in enterprise workflows.'
    ],
    speakers: ['Elena Rostova (VP of AI Research)', 'Marcus Vance (Principal Architect, CloudScale)', 'Dr. Priya Nair (Author of Autonomous Systems)'],
    location: 'Moscone Convention Center & Live Global Stream',
    category: 'Artificial Intelligence',
    organizerEmail: 'archanrd29@gmail.com',
    registeredAttendees: [
      { email: 'archanrd29@gmail.com', registeredAt: '2026-09-25T10:00:00Z' },
      { email: 'dev.sarah@acmelabs.io', registeredAt: '2026-09-26T14:22:00Z' },
      { email: 'kenji.takahashi@synapse.tech', registeredAt: '2026-09-26T18:45:00Z' }
    ],
    createdAt: '2026-09-20T08:00:00Z'
  },
  {
    id: 'evt-cloud-native-dev',
    name: 'Cloud Native & Modern Web Architecture Meetup',
    date: '2026-10-22',
    communityName: 'DevOps & Cloud Circle',
    communitySocialLink: 'https://linkedin.com/company/devops-cloud-circle',
    description: 'Deep dive into zero-cold-start serverless architectures, distributed databases, and high-frequency edge computing patterns.',
    keyTakeaways: [
      'Scale-to-zero databases dramatically cut operational overhead for spiky workloads.',
      'How modern bundlers and edge workers redefine full-stack delivery times.',
      'Observability beyond logs: Distributed tracing and real-time anomaly detection.'
    ],
    speakers: ['Liam Gallagher (Staff SRE)', 'Amira Patel (Cloud Infrastructure Lead)'],
    location: 'TechHub Downtown Auditorium, Floor 4',
    category: 'Cloud Engineering',
    organizerEmail: 'organizer@devopscloud.org',
    registeredAttendees: [
      { email: 'archanrd29@gmail.com', registeredAt: '2026-09-27T01:15:00Z' },
      { email: 'jordan.m@vectorpath.io', registeredAt: '2026-09-26T09:12:00Z' }
    ],
    createdAt: '2026-09-22T11:30:00Z'
  },
  {
    id: 'evt-product-design-craft',
    name: 'Design Systems & High-Agency UI Forum',
    date: '2026-11-05',
    communityName: 'Product Design Guild',
    communitySocialLink: 'https://linkedin.com/company/product-design-guild',
    description: 'Exploring tactile interfaces, motion-driven micro-interactions, anti-slop typography, and creating digital products that users love.',
    keyTakeaways: [
      'Eliminating generic AI templates in favor of purposeful, tactile motion and typography.',
      'Micro-physics and fluid spatial layouts on modern reactive canvases.',
      'Bridging design tokens seamlessly between Figma and React components.'
    ],
    speakers: ['Siddharth Rao (Head of Design at Aura)', 'Chloe Martin (Principal Interaction Designer)'],
    location: 'Design Collective Studio, Loft 3B',
    category: 'UI/UX & Product',
    organizerEmail: 'organizer@designguild.org',
    registeredAttendees: [
      { email: 'alex.chen@interfacecraft.com', registeredAt: '2026-09-24T16:00:00Z' },
      { email: 'clara.boone@atelier.design', registeredAt: '2026-09-25T11:20:00Z' }
    ],
    createdAt: '2026-09-23T15:00:00Z'
  }
];
