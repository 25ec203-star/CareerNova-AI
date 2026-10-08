import { InterviewMetric } from '../types';

export interface TechQuestionDef {
  id: string;
  question: string;
  category: string;
  expectedConcepts: string[];
  sampleStrongAnswer: string;
}

export const TECH_INTERVIEW_QUESTIONS: TechQuestionDef[] = [
  {
    id: 'tech-q1',
    question:
      'Explain the differences between optimistic and pessimistic locking in relational and distributed databases.',
    category: 'Databases & Concurrency',
    expectedConcepts: [
      'optimistic',
      'pessimistic',
      'version',
      'timestamp',
      'lock',
      'concurrency',
      'conflict',
      'transaction',
      'deadlock',
      'read',
      'write',
      'commit',
      'acid',
      'retry',
    ],
    sampleStrongAnswer:
      'Pessimistic locking prevents conflicts by acquiring exclusive row or table locks before changes, ideal for high contention. Optimistic locking avoids locking upfront by using version numbers or timestamps and checks on commit, which provides higher throughput in read-heavy workloads.',
  },
  {
    id: 'tech-q2',
    question:
      'How would you design a rate limiter for an API handling 100,000 requests per minute? What data structures would you use?',
    category: 'System Design & Distributed Systems',
    expectedConcepts: [
      'token bucket',
      'leaky bucket',
      'sliding window',
      'redis',
      'rate limit',
      'counter',
      'distributed',
      '429',
      'hash',
      'sorted set',
      'ip',
      'user id',
      'latency',
      'concurrency',
    ],
    sampleStrongAnswer:
      'I would implement a Token Bucket or Sliding Window Counter algorithm using an in-memory Redis cluster. Using Redis hashes or sorted sets with Lua scripts ensures atomic updates and prevents race conditions across distributed microservices.',
  },
  {
    id: 'tech-q3',
    question:
      'Walk me through what happens under the hood when a user types a URL into their browser and presses Enter.',
    category: 'Networking & Web Architecture',
    expectedConcepts: [
      'dns',
      'ip',
      'tcp',
      'handshake',
      'syn',
      'ack',
      'tls',
      'ssl',
      'http',
      'https',
      'get',
      'dom',
      'cssom',
      'render',
      'paint',
      'packet',
      'server',
    ],
    sampleStrongAnswer:
      'The browser resolves the domain via DNS cache and recursive resolution, initiates a TCP 3-way handshake with SYN/ACK, establishes TLS encryption, sends an HTTP GET request, and parses the response to construct DOM and CSSOM trees for rendering.',
  },
  {
    id: 'tech-q4',
    question:
      'Explain the CAP theorem and describe how you would choose between CP and AP for a banking ledger versus an analytics stream.',
    category: 'Distributed Systems & Trade-offs',
    expectedConcepts: [
      'consistency',
      'availability',
      'partition',
      'cap',
      'network',
      'cp',
      'ap',
      'banking',
      'ledger',
      'eventual',
      'stream',
      'kafka',
      'cassandra',
      'trade-off',
    ],
    sampleStrongAnswer:
      'The CAP theorem states that under network partitioning, a system must choose between strict consistency and high availability. A banking ledger requires CP to prevent double-spending, while a telemetry/analytics stream favors AP for high ingest availability with eventual consistency.',
  },
];

export interface HRQuestionDef {
  id: string;
  question: string;
  category: string;
  expectedConcepts: string[];
}

export const HR_INTERVIEW_QUESTIONS: HRQuestionDef[] = [
  {
    id: 'hr-q1',
    question:
      'Tell me about yourself, your engineering journey, and what drove your focus towards your target role.',
    category: 'Professional Background & Motivation',
    expectedConcepts: [
      'experience',
      'passion',
      'learning',
      'projects',
      'growth',
      'engineering',
      'career',
      'skills',
      'problem solving',
      'impact',
    ],
  },
  {
    id: 'hr-q2',
    question:
      'What do you consider your greatest technical strength, and what is one area you are actively working to improve?',
    category: 'Self-Awareness & Agility',
    expectedConcepts: [
      'strength',
      'improvement',
      'curiosity',
      'mentorship',
      'feedback',
      'debugging',
      'systems',
      'communication',
      'practice',
      'growth mindset',
    ],
  },
  {
    id: 'hr-q3',
    question:
      'Describe a challenging project where teamwork or conflict occurred within the group. How did you resolve it?',
    category: 'Team Collaboration & Conflict Resolution',
    expectedConcepts: [
      'team',
      'conflict',
      'collaboration',
      'communication',
      'consensus',
      'solution',
      'perspective',
      'deliver',
      'empathy',
      'compromise',
    ],
  },
  {
    id: 'hr-q4',
    question:
      'Where do you see yourself in 3 to 5 years, and how does joining our engineering organization align with those goals?',
    category: 'Career Vision & Cultural Fit',
    expectedConcepts: [
      'goals',
      'senior',
      'lead',
      'architecture',
      'scale',
      'mentor',
      'culture',
      'impact',
      'vision',
      'contribution',
    ],
  },
];

export function evaluateTechnicalResponses(
  responses: { questionIndex: number; text: string }[],
  cameraActive: boolean,
  micActive: boolean,
  durationSeconds: number
): { metrics: InterviewMetric; overallScore: number; feedbackList: string[] } {
  let totalScoreWeight = 0;
  let totalQuestionsCount = Math.max(1, responses.length);
  const matchedFeedback: string[] = [];

  responses.forEach((resp) => {
    const qDef = TECH_INTERVIEW_QUESTIONS[resp.questionIndex] || TECH_INTERVIEW_QUESTIONS[0];
    const textLower = resp.text.toLowerCase();
    const words = resp.text.trim().split(/\s+/).filter(Boolean);

    // Concept matches
    const conceptHits = qDef.expectedConcepts.filter((c) => textLower.includes(c.toLowerCase()));
    const conceptRatio = conceptHits.length / Math.min(6, qDef.expectedConcepts.length);

    // Word volume depth (20 - 100 words)
    const wordScore = Math.min(1, words.length / 25);

    // Composite question score: baseline 72, plus concepts and articulation
    const qScore = 72 + Math.min(22, conceptRatio * 16 + wordScore * 6);
    totalScoreWeight += qScore;

    if (conceptHits.length >= 2) {
      matchedFeedback.push(
        `Strong grasp in ${qDef.category}: Correctly articulated ${conceptHits.slice(0, 3).join(', ')}.`
      );
    }
  });

  const baseAverage = Math.round(totalScoreWeight / totalQuestionsCount);

  // Bonus signals for professional interview presence
  const cameraBonus = cameraActive ? 4 : 0;
  const micBonus = micActive ? 4 : 0;
  const timeBonus = durationSeconds >= 45 ? 3 : 1;

  const technicalAccuracy = Math.min(98, Math.max(74, baseAverage + cameraBonus));
  const problemSolving = Math.min(96, Math.max(76, baseAverage + 2));
  const communication = Math.min(97, Math.max(75, baseAverage + micBonus + 1));
  const confidence = Math.min(95, Math.max(72, 75 + cameraBonus * 2 + micBonus * 2 + timeBonus));
  const responseQuality = Math.min(
    98,
    Math.round((technicalAccuracy * 0.4 + problemSolving * 0.35 + communication * 0.25))
  );

  const overallScore = Math.round(
    (technicalAccuracy + problemSolving + communication + confidence + responseQuality) / 5
  );

  const feedbackList: string[] = [
    matchedFeedback[0] || 'Structured articulation of distributed engineering trade-offs.',
    matchedFeedback[1] || 'Clear reasoning regarding system throughput and concurrency control.',
    cameraActive
      ? 'Strong professional executive presence with camera engagement.'
      : 'Recommendation: Enable camera during mock sessions to boost confidence rating.',
    communication >= 85
      ? 'Precise technical vocabulary aligned with Tier-1 placement standards.'
      : 'Good foundational communication; expand on latency implications.',
  ];

  return {
    metrics: {
      technicalAccuracy,
      problemSolving,
      communication,
      confidence,
      responseQuality,
      feedback: feedbackList,
    },
    overallScore,
    feedbackList,
  };
}

export function evaluateHRResponses(
  responses: { questionIndex: number; text: string }[],
  cameraActive: boolean,
  micActive: boolean,
  durationSeconds: number
): { metrics: InterviewMetric; overallScore: number; feedbackList: string[] } {
  let totalScoreWeight = 0;
  const totalQuestionsCount = Math.max(1, responses.length);
  const matchedFeedback: string[] = [];

  responses.forEach((resp) => {
    const qDef = HR_INTERVIEW_QUESTIONS[resp.questionIndex] || HR_INTERVIEW_QUESTIONS[0];
    const textLower = resp.text.toLowerCase();
    const words = resp.text.trim().split(/\s+/).filter(Boolean);

    const conceptHits = qDef.expectedConcepts.filter((c) => textLower.includes(c.toLowerCase()));
    const conceptRatio = conceptHits.length / Math.min(5, qDef.expectedConcepts.length);
    const wordScore = Math.min(1, words.length / 20);

    const qScore = 74 + Math.min(20, conceptRatio * 14 + wordScore * 6);
    totalScoreWeight += qScore;

    if (conceptHits.length >= 2) {
      matchedFeedback.push(
        `High cultural resonance in ${qDef.category}: Demonstrated ${conceptHits.slice(0, 3).join(', ')}.`
      );
    }
  });

  const baseAverage = Math.round(totalScoreWeight / totalQuestionsCount);
  const cameraBonus = cameraActive ? 5 : 0;
  const micBonus = micActive ? 4 : 0;

  const communication = Math.min(98, Math.max(76, baseAverage + micBonus + 2));
  const confidence = Math.min(96, Math.max(74, 76 + cameraBonus * 2 + micBonus));
  const responseQuality = Math.min(95, Math.max(75, baseAverage + 1));
  const problemSolving = Math.min(94, Math.max(73, baseAverage));
  const technicalAccuracy = Math.min(92, Math.max(72, baseAverage - 1));

  const overallScore = Math.round(
    (communication + confidence + responseQuality + problemSolving + technicalAccuracy) / 5
  );

  const feedbackList: string[] = [
    matchedFeedback[0] || 'Genuine self-awareness with articulated motivation.',
    matchedFeedback[1] || 'Demonstrates strong emotional intelligence and team collaboration.',
    'Clear alignment between long-term engineering vision and company growth.',
  ];

  return {
    metrics: {
      technicalAccuracy,
      problemSolving,
      communication,
      confidence,
      responseQuality,
      feedback: feedbackList,
    },
    overallScore,
    feedbackList,
  };
}
