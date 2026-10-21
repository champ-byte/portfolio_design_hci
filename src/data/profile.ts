// All personal content lives here so copy can be edited without touching components.

export const profile = {
  name: 'Kavya Zala',
  firstName: 'Kavya',
  lastName: 'Zala',
  role: 'AI Engineer & Researcher',
  tagline: 'Building intelligent agents that reason, remember, and respond.',
  status: 'Currently AI Engineer @ Senzura',
  location: 'Mumbai, India',
  timeZone: 'Asia/Kolkata',
  email: 'kavyazala08@gmail.com',
  github: 'https://github.com/champ-byte',
  linkedin: 'https://www.linkedin.com/in/kavya-zala-b5a942377',
  rotatingWords: ['AI agents', 'learning engines', 'code editors', 'interfaces'],
  bio: "I'm Kavya, a Computer Science undergrad at VJTI, Mumbai, who loves building AI systems that feel thoughtful: agents that reason, retrieve and remember. Right now I'm working on the conversational brain of a companion robot at Senzura and studying how intelligent agents develop at OREL. Outside the model weights, I lead design at Digital VJTI × GDSC, because good AI deserves a good interface.",
  funFacts: [
    "Hi! I'm Kavya. Click me again for a fun fact.",
    'I scored 98.8% in my ICSE board exams.',
    'I lead the design team at Digital VJTI × GDSC.',
    'My GraphRAG system improved context recall by up to 50%.',
    "I'm helping a companion robot hold a real conversation.",
    'I merged 6 pull requests during Hacktoberfest.',
    'I research active inference with the OREL cohort.',
    'My team placed 2nd runner-up at Synergy 3.0.',
  ],
}

export const heroBadges = [
  { icon: 'graduation', value: '8.43 CGPA', label: 'B.Tech CS · VJTI' },
  { icon: 'trophy', value: '2nd Runner-up', label: 'Synergy 3.0 Hackathon' },
  { icon: 'merge', value: '6 PRs merged', label: 'Hacktoberfest' },
] as const

export const stats = [
  { value: 8.43, decimals: 2, suffix: '', label: 'CGPA at VJTI' },
  { value: 98.8, decimals: 1, suffix: '%', label: 'ICSE (10th) score' },
  { value: 6, decimals: 0, suffix: '', label: 'Open-source PRs merged' },
  { value: 3, decimals: 0, suffix: '', label: 'Flagship AI projects' },
]

export const nowItems = [
  {
    org: 'Senzura',
    role: 'AI Engineer · AI Companion Robot',
    period: 'July 2026 — Present',
    place: 'Mumbai',
    image: '/images/avatar-robot.webp',
    imageAlt: 'Illustration of Kavya standing next to a small friendly companion robot',
    summary:
      'Working on the LLM component of an AI companion robot, contributing to conversational reasoning and response generation for embodied human–robot interaction.',
    focus: ['Conversational reasoning', 'Response generation', 'Embodied human–robot interaction'],
    tags: ['LLMs', 'HRI', 'Conversational AI'],
  },
  {
    org: 'OREL',
    role: 'Research Cohort Member · Orthogonal Research and Education Lab',
    period: 'June 2026 — Present',
    place: 'Remote',
    image: '/images/avatar-think.webp',
    imageAlt: 'Illustration of Kavya thinking, with sketches of a brain and a lightbulb',
    summary:
      'Researching the behaviour and development of intelligent agents using the active inference framework with developmental staging.',
    focus: ['Active inference framework', 'Developmental staging', 'Behaviour of intelligent agents'],
    tags: ['Active Inference', 'Agents', 'Research'],
  },
]

export type Project = {
  id: 'zenith' | 'graphrag' | 'zentrix'
  title: string
  short: string
  tagline: string
  team?: boolean
  stack: string[]
  highlights: string[]
  metric: { value: string; label: string }
  metrics: { value: string; label: string }[]
  problem: string
  approach: string[]
  image: string
  imageSm: string
  imageAlt: string
  github: string
  repoLabel: string
}

export const projects: Project[] = [
  {
    id: 'zenith',
    title: 'Zenith AI Code Editor',
    short: 'Zenith',
    tagline: 'An agentic code editor that makes debugging visible.',
    stack: ['Node.js', 'Monaco Editor', 'LangChain', 'LangGraph'],
    highlights: [
      'Gamified algorithm visualiser that renders data-structure transitions live while you debug',
      'LLM-powered docs: scans a codebase and writes READMEs and API docs',
      'Git by conversation: push, pull and manage branches in plain English',
    ],
    metric: { value: 'Live', label: 'data-structure visualisation while debugging' },
    metrics: [
      { value: '3-in-1', label: 'editor, visualiser and doc generator' },
      { value: 'NL → Git', label: 'push, pull and branch with natural language' },
      { value: 'Agentic', label: 'LangGraph-orchestrated assistant' },
    ],
    problem:
      'Debugging data-structure code usually means juggling print statements and mental pictures, documentation gets left for "later", and Git commands break your flow. Zenith tries to keep all three inside the editor.',
    approach: [
      'Built on the Monaco editor with an agent layer orchestrated through LangChain and LangGraph.',
      'Developed a gamified algorithm visualiser that renders real-time data-structure transitions during debugging.',
      'Integrated automated documentation generation: LLMs scan the codebase and produce READMEs and technical API docs.',
      'Built a Git integration module enabling GitHub actions (push, pull, branch management) via natural-language commands.',
    ],
    image: '/images/project-zenith.webp',
    imageSm: '/images/project-zenith-sm.webp',
    imageAlt: 'Zenith editor interface showing code beside an algorithm visualiser with bar charts',
    github: 'https://github.com/champ-byte/ZENITH-AI-Code-Editor',
    repoLabel: 'champ-byte/ZENITH-AI-Code-Editor',
  },
  {
    id: 'graphrag',
    title: 'Multimodal Hybrid GraphRAG',
    short: 'GraphRAG',
    tagline: 'Retrieval that reads both the text and the charts.',
    stack: ['Python', 'Neo4j', 'LangChain', 'FAISS', 'Gemini Vision', 'RAGAS'],
    highlights: [
      'Neo4j knowledge graph coupled with FAISS vector search, linked through chunk IDs',
      'Multimodal ingestion that captions PDF figures and charts with Gemini Vision',
      'Benchmarked with RAGAS against a naive vector-RAG baseline',
    ],
    metric: { value: '+35–50%', label: 'context recall on multi-hop queries' },
    metrics: [
      { value: '+35–50%', label: 'context recall on multi-hop, cross-document queries' },
      { value: '+40–50%', label: 'faithfulness on visual queries' },
      { value: 'Hybrid', label: 'graph + vector retrieval in one pipeline' },
    ],
    problem:
      'Plain vector RAG struggles when an answer needs several hops across documents, and it is blind to information that only lives inside figures and charts.',
    approach: [
      'Engineered a hybrid retrieval system coupling a Neo4j knowledge graph with FAISS vector search.',
      'Linked entity-relationship subgraphs back to source chunks via chunk IDs for unified structured and unstructured reasoning.',
      'Built a multimodal ingestion pipeline that extracts and captions embedded PDF figures/charts using Gemini Vision, indexing captions alongside text.',
      'Benchmarked with RAGAS against naive vector RAG.',
    ],
    image: '/images/project-graphrag.webp',
    imageSm: '/images/project-graphrag-sm.webp',
    imageAlt: 'GraphRAG dashboard with a document, extracted chart thumbnails and an answer panel',
    github: 'https://github.com/champ-byte/Multimodal_GraphRAG',
    repoLabel: 'champ-byte/Multimodal_GraphRAG',
  },
  {
    id: 'zentrix',
    title: 'Zentrix — Deterministic Learning Engine',
    short: 'Zentrix',
    tagline: "Diagnosing exactly where a student's understanding breaks.",
    team: true,
    stack: ['FastAPI', 'Python', 'py_trees', 'NetworkX', 'Supabase'],
    highlights: [
      'Fault Tree Analysis + knowledge DAGs pinpoint cognitive gaps with zero hallucinations',
      'Item Response Theory estimates ability and picks questions at the edge of knowledge',
      'Behaviour Tree switches between Drill, Remedy and Advance using fatigue signals',
    ],
    metric: { value: '0', label: 'hallucinations: fully deterministic diagnosis' },
    metrics: [
      { value: '0', label: 'hallucinations: every diagnosis is traceable' },
      { value: 'IRT', label: 'latent-ability estimation for question selection' },
      { value: '3 modes', label: 'Drill · Remedy · Advance' },
    ],
    problem:
      'Most adaptive-learning tools guess at what a student does not understand. Zentrix borrows ideas from clinical diagnosis to find the exact gap, deterministically.',
    approach: [
      'Built a clinically-inspired diagnostic engine using Fault Tree Analysis (FTA) and Knowledge DAGs to mathematically identify student cognitive gaps.',
      "Implemented Item Response Theory (IRT) for latent ability estimation, selecting questions calibrated to each student's edge of knowledge.",
      'Orchestrated remediation with a Behaviour Tree sequencer that switches between Drill, Remedy and Advance modes based on real-time fatigue metrics and calibration state.',
    ],
    image: '/images/project-zentrix.webp',
    imageSm: '/images/project-zentrix-sm.webp',
    imageAlt: 'Zentrix learning app on a tablet showing a skill tree and a quiz card',
    github: 'https://github.com/crazy-coder-neel/Zentrix',
    repoLabel: 'crazy-coder-neel/Zentrix',
  },
]

export type SkillCategory = 'Languages' | 'AI & LLM' | 'Backend & Data' | 'Tools' | 'Design'

export const skillCategories: SkillCategory[] = ['Languages', 'AI & LLM', 'Backend & Data', 'Tools', 'Design']

export const skills: { name: string; category: SkillCategory; usedIn?: Project['id'][] }[] = [
  { name: 'Python', category: 'Languages', usedIn: ['graphrag', 'zentrix'] },
  { name: 'C++', category: 'Languages' },
  { name: 'JavaScript', category: 'Languages', usedIn: ['zenith'] },
  { name: 'HTML / CSS', category: 'Languages' },
  { name: 'Cypher (Neo4j)', category: 'Languages', usedIn: ['graphrag'] },
  { name: 'LangChain', category: 'AI & LLM', usedIn: ['zenith', 'graphrag'] },
  { name: 'LangGraph', category: 'AI & LLM', usedIn: ['zenith'] },
  { name: 'Ollama', category: 'AI & LLM' },
  { name: 'Gemini Vision', category: 'AI & LLM', usedIn: ['graphrag'] },
  { name: 'FAISS', category: 'AI & LLM', usedIn: ['graphrag'] },
  { name: 'RAGAS', category: 'AI & LLM', usedIn: ['graphrag'] },
  { name: 'Mesa', category: 'AI & LLM' },
  { name: 'Node.js', category: 'Backend & Data', usedIn: ['zenith'] },
  { name: 'FastAPI', category: 'Backend & Data', usedIn: ['zentrix'] },
  { name: 'Neo4j', category: 'Backend & Data', usedIn: ['graphrag'] },
  { name: 'NetworkX', category: 'Backend & Data', usedIn: ['zentrix'] },
  { name: 'Supabase', category: 'Backend & Data', usedIn: ['zentrix'] },
  { name: 'Linux', category: 'Tools' },
  { name: 'Git & GitHub', category: 'Tools', usedIn: ['zenith'] },
  { name: 'VS Code', category: 'Tools' },
  { name: 'Google Colab', category: 'Tools' },
  { name: 'Monaco Editor', category: 'Tools', usedIn: ['zenith'] },
  { name: 'UI Design', category: 'Design' },
  { name: 'Branding', category: 'Design' },
  { name: 'Design Leadership', category: 'Design' },
]

export const coursework = [
  'Data Structures & Algorithms Analysis',
  'Operating Systems',
  'Database Management Systems',
  'Software Engineering',
]

export const journey = [
  {
    year: '2022',
    title: 'ICSE (10th)',
    place: 'NES National Public School',
    detail: 'Finished school with 98.8%.',
    badge: '98.8%',
    kind: 'education' as const,
  },
  {
    year: '2022 — 2024',
    title: 'HSC (12th)',
    place: 'Jai Bharat College',
    detail: 'Higher Secondary Certificate with 93%.',
    badge: '93%',
    kind: 'education' as const,
  },
  {
    year: '2024 — Present',
    title: 'B.Tech, Computer Science',
    place: 'Veermata Jijabai Technological Institute (VJTI), Mumbai',
    detail: 'Coursework in DSA, Operating Systems, DBMS and Software Engineering. Design Head at Digital VJTI × GDSC.',
    badge: 'CGPA 8.43',
    image: '/images/card-vjti.webp',
    imageAlt: 'Illustration of the VJTI heritage campus building surrounded by trees',
    kind: 'education' as const,
  },
  {
    year: 'June 2026',
    title: 'Research Cohort Member',
    place: 'OREL · Remote',
    detail: 'Studying intelligent agents through active inference and developmental staging.',
    badge: 'Research',
    kind: 'work' as const,
  },
  {
    year: 'July 2026',
    title: 'AI Engineer',
    place: 'Senzura · Mumbai',
    detail: 'Building the LLM component of an AI companion robot.',
    badge: 'Now',
    kind: 'work' as const,
  },
]

export const beyond = [
  {
    kicker: 'Digital VJTI × GDSC',
    title: 'Design Head',
    text: 'Direct the design vertical, setting UI and branding standards and guiding a team of designers across platforms.',
    image: '/images/avatar-design.webp',
    imageAlt: 'Illustration of Kavya holding a giant pencil and a colour palette',
    illustration: true,
  },
  {
    kicker: 'Synergy 3.0 Hackathon',
    title: '2nd Runner-up',
    text: 'Built a Supply Chain Graph Engine that secured the 2nd runner-up position.',
    image: '/images/avatar-trophy.webp',
    imageAlt: 'Illustration of Kavya proudly holding a trophy with confetti',
    illustration: true,
  },
  {
    kicker: 'Project X · College Committee',
    title: 'Mentor',
    text: 'Facilitate training sessions for juniors, passing on technical knowledge and institutional traditions.',
    image: '/images/avatar-teach.webp',
    imageAlt: 'Illustration of Kavya explaining a chart on a whiteboard',
    illustration: true,
  },
  {
    kicker: 'Hacktoberfest',
    title: 'Open Source Contributor',
    text: 'Successfully merged 6 pull requests across open-source repositories.',
    image: '/images/card-opensource.webp',
    imageAlt: 'Illustration of code branches growing like a plant with leaves',
  },
  {
    kicker: 'Technical Writing',
    title: '“Use of AI in Defence”',
    text: 'Authored a report analysing strategic applications of AI and ML in modern security frameworks.',
    image: '/images/card-writing.webp',
    imageAlt: 'Illustration of an open notebook with a fountain pen and a shield sketch',
    link: {
      href: 'https://drive.google.com/file/d/12Tv52idC4iZBGBlYcADxPKKkIIwd_RNX/view?usp=sharing',
      label: 'Read the report',
    },
  },
]

export const sections = [
  { id: 'about', label: 'About', nav: true },
  { id: 'now', label: 'Currently', nav: false },
  { id: 'work', label: 'Work', nav: true },
  { id: 'skills', label: 'Skills', nav: true },
  { id: 'journey', label: 'Journey', nav: true },
  { id: 'beyond', label: 'Achievements', nav: false },
  { id: 'contact', label: 'Contact', nav: true },
] as const
