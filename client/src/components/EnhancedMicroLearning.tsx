import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  Lightbulb,
  Rocket,
  Star,
  Award,
  ChevronRight,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';

interface MiniQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Lesson {
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
  duration: number;
  miniQuiz?: MiniQuiz;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  followUp?: string;
}

interface EnhancedLearningModule {
  id: string;
  title: string;
  description: string;
  category: 'fundamentals' | 'marketing' | 'finance' | 'operations' | 'leadership';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  points: number;
  lessons: Lesson[];
  quizzes: Quiz[];
  resources: { title: string; url: string; type: 'article' | 'video' | 'tool' }[];
  practicalExercises: string[];
  unlockRequirement?: {
    type: 'day' | 'completed_modules' | 'points';
    value: number;
  };
  icon: any;
  color: {
    from: string;
    to: string;
    accent: string;
  };
}

// Beginner modules (free content)
const beginnerModules: EnhancedLearningModule[] = [
  {
    id: 'ceo-vs-founder',
    title: 'CEO vs Founder: Understanding Your Role',
    description: 'Learn the difference between CEO and Founder roles and decide which responsibilities you\'ll take on.',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedTime: 20,
    points: 10,
    lessons: [
      {
        title: 'What is a Founder?',
        content: 'A founder is someone who starts a company. Founders identify problems, create solutions, and bring the initial vision to life. Key responsibilities include idea development, initial funding, team building, and setting company culture.',
        type: 'text',
        duration: 5
      },
      {
        title: 'What is a CEO?',
        content: 'A CEO (Chief Executive Officer) runs the day-to-day operations of a company. CEOs focus on strategy execution, team management, investor relations, and scaling operations. They\'re accountable to the board and shareholders.',
        type: 'text',
        duration: 5
      },
      {
        title: 'Role Decision Framework',
        content: 'Founders focus on vision and creation; CEOs focus on execution and growth. Many founders become CEOs, but not all CEOs are founders. Some founders step back to focus on product while hiring experienced CEOs.',
        type: 'interactive',
        duration: 10
      }
    ],
    quizzes: [
      {
        question: 'What is the primary role of a founder?',
        options: [
          'Managing daily operations',
          'Creating the initial vision and starting the company',
          'Handling investor relations',
          'Scaling the business'
        ],
        correctAnswer: 1,
        explanation: 'Founders are primarily responsible for creating the initial vision and starting the company.',
        followUp: 'Many successful founders later transition to CEO roles or hire experienced CEOs.'
      }
    ],
    resources: [
      { title: 'Founder vs CEO Guide', url: 'https://www.ycombinator.com/library/8h-founder-vs-ceo', type: 'article' },
      { title: 'First-Time Founder Guide', url: 'https://blog.ycombinator.com/advice-for-first-time-founders/', type: 'article' }
    ],
    practicalExercises: [
      'List 5 founder responsibilities you want to keep',
      'List 5 CEO responsibilities you need help with',
      'Create a 6-month role transition plan'
    ],
    unlockRequirement: { type: 'day', value: 1 },
    icon: Users,
    color: { from: 'from-blue-500', to: 'to-purple-600', accent: 'text-blue-600' }
  }
];

// Intermediate modules (premium content) 
const intermediateModules: EnhancedLearningModule[] = [
  {
    id: 'mvp-mastery',
    title: 'MVP Development Mastery',
    description: 'Master the art of building and validating minimum viable products',
    category: 'fundamentals',
    difficulty: 'intermediate',
    estimatedTime: 45,
    points: 25,
    lessons: [
      {
        title: 'Understanding MVP Principles',
        content: '## What is an MVP?\n\nAn MVP (Minimum Viable Product) is **not** a basic version of your final product. It\'s the smallest version that allows you to learn from customers with minimal effort.\n\n## Core Philosophy\n\nThe MVP methodology was pioneered by Eric Ries in "The Lean Startup". The key insight: **you\'re not building a product, you\'re testing a hypothesis.**\n\n## The Three Pillars of MVP Success\n\n### 1. Minimum\nBuild only what\'s absolutely necessary to test your core assumption\n\n### 2. Viable  \nIt must actually solve the core problem (even if roughly)\n\n### 3. Product\nCustomers must be willing to use/pay for it\n\n## Common MVP Mistakes\n\n❌ **Building too many features** → Focus on ONE core problem  \n❌ **Perfecting the UI/UX** → Prioritize functionality over polish  \n❌ **Skipping customer validation** → Talk to users before AND after building  \n❌ **Not measuring properly** → Define success metrics upfront\n\n## Real MVP Examples\n\n**Airbnb:** Started with air mattresses in founders\' apartment  \n**Dropbox:** Demo video before building the product  \n**Zappos:** Took photos of shoes in stores, bought only when ordered  \n**Buffer:** Landing page with signup before building the tool',
        type: 'text',
        duration: 8,
        miniQuiz: {
          question: 'What is the primary purpose of an MVP?',
          options: [
            'To create a basic version of your final product',
            'To test your core hypothesis about customer needs', 
            'To save money on development costs',
            'To get to market faster than competitors'
          ],
          correctAnswer: 1,
          explanation: 'An MVP is specifically designed to test your fundamental assumptions about customer problems and solutions with the least amount of work.'
        }
      },
      {
        title: 'Feature Prioritization Mastery',
        content: '## The Core Feature Test\n\nAsk: **"What is the ONE thing that, if removed, would make this product completely useless?"**\n\nThis is your core feature. Everything else is enhancement.\n\n## The MoSCoW Method for Startups\n\n### Must Have\nCore features that define your product\n\n### Should Have  \nImportant but not critical for MVP\n\n### Could Have\nNice-to-have features for future releases\n\n### Won\'t Have\nFeatures that dilute your core value proposition\n\n## Feature Prioritization Framework\n\nScore each feature 1-10 on:\n\n1. **Customer Impact:** How much does this solve the core problem?\n2. **Implementation Effort:** How hard/expensive is this to build?\n3. **Risk Level:** How uncertain are we about customer adoption?\n4. **Strategic Value:** How well does this support business goals?\n\n### Formula\n**Priority Score = (Impact × Strategic Value) / (Effort × Risk)**\n\n## Real Example: Uber\n\n**Core Feature:** Request ride with one tap  \n**Should Have:** GPS tracking, ETA  \n**Could Have:** Driver ratings, music preferences  \n**Won\'t Have:** In-car entertainment, food delivery (initially)',
        type: 'text',
        duration: 6,
        miniQuiz: {
          question: 'According to the framework, what should you do if a feature scores (Impact: 9, Strategic Value: 8) / (Effort: 3, Risk: 2) = 12?',
          options: [
            'Definitely build it first',
            'Consider building it', 
            'Probably buy/use existing solution',
            'Skip it entirely'
          ],
          correctAnswer: 0,
          explanation: 'A score of 12 is very high, indicating this should be a top priority to build.'
        }
      },
      {
        title: 'Build vs Buy Decision Framework',
        content: '## When to Build vs Buy\n\n### Build When:\n✅ It\'s your core competitive advantage  \n✅ No suitable solution exists in the market  \n✅ You have specific, unique requirements  \n✅ Long-term cost savings justify upfront investment\n\n### Buy/Use Existing When:\n✅ It\'s not your core differentiator  \n✅ Proven, reliable solutions exist  \n✅ Time to market is critical  \n✅ You have limited technical resources\n\n## The "Fake Door" Strategy\n\nTest demand before building anything:\n\n### 1. Landing Page MVP\nCreate a page describing your product\n\n### 2. Wizard of Oz\nManually fulfill what would be automated\n\n### 3. Concierge MVP  \nPersonally deliver the service to early customers\n\n### 4. Video Demo\nShow how the product would work (Dropbox approach)\n\n## Success Stories\n\n**Zappos:** Photographed shoes in stores, bought only when customers ordered  \n**Groupon:** Started as a WordPress blog with manual deal posting  \n**Airbnb:** Used Craigslist integration instead of building marketplace\n\n## The 70% Rule\n\nIf an existing solution meets 70% of your needs, use it and focus building efforts on the remaining 30% that truly differentiates you.',
        type: 'interactive',
        duration: 7,
        miniQuiz: {
          question: 'In the Build vs Buy framework, when should you definitely buy/use existing solutions?',
          options: [
            'When it\'s your core competitive advantage',
            'When you want complete control over technology',
            'When proven solutions exist and it\'s not your differentiator', 
            'When you have unlimited development resources'
          ],
          correctAnswer: 2,
          explanation: 'Buy when proven solutions exist for non-core functionality. Save your building efforts for what truly differentiates you.'
        }
      },
      {
        title: 'Customer Validation with the Mom Test',
        content: '## The Mom Test Methodology\n\nDeveloped by Rob Fitzpatrick, this approach prevents customers from lying to you (even when they try to be nice).\n\n## Three Rules\n\n1. **Talk about their life, not your idea**\n2. **Ask about specifics in the past, not opinions about the future**  \n3. **Talk less and listen more**\n\n## Bad vs Good Questions\n\n❌ **Bad:** "Would you buy a product that did X?"  \n✅ **Good:** "Tell me about the last time you needed to solve X."\n\n❌ **Bad:** "How much would you pay for this?"  \n✅ **Good:** "What\'s the most expensive solution you\'ve tried?"\n\n❌ **Bad:** "What features would you want?"  \n✅ **Good:** "Walk me through the last time this was a problem."\n\n## Customer Discovery Process\n\n### Phase 1: Problem Discovery (Weeks 1-2)\n• Interview 10-15 potential customers  \n• Focus: Understand current pain points  \n• Goal: Validate the problem exists and is significant\n\n### Phase 2: Solution Validation (Weeks 3-4)  \n• Show mockups/prototypes to previous interviewees  \n• Focus: Does your solution address their pain?  \n• Goal: Validate product-market fit potential\n\n### Phase 3: Business Model Validation (Weeks 5-6)\n• Test pricing, sales channels, and value proposition  \n• Focus: Will they actually pay for this?  \n• Goal: Validate business viability\n\n## The 10/3/1 Rule\n\n• Interview **10 people** to find **3** who have the problem  \n• Of those 3, only **1** will actually buy  \n• You need **100+ interviews** to find 10 paying customers',
        type: 'text',
        duration: 10,
        miniQuiz: {
          question: 'Which question follows the "Mom Test" principle?',
          options: [
            'Would you pay $10/month for this service?',
            'Do you think this is a good idea?',
            'Tell me about the last time you struggled with organizing files',
            'Would you recommend this to a friend?'
          ],
          correctAnswer: 2,
          explanation: 'The Mom Test focuses on past behavior and specific experiences rather than hypothetical future actions.'
        }
      }
    ],
    quizzes: [
      {
        question: 'What\'s the most critical factor when deciding to build your MVP?',
        options: [
          'Having all the features planned out',
          'Identifying your riskiest customer assumption to test',
          'Perfecting the user interface design',
          'Getting enough funding to build everything'
        ],
        correctAnswer: 1,
        explanation: 'The MVP should focus on testing your biggest unknowns about customer behavior and needs.',
        followUp: 'Start with your riskiest assumption - if it\'s wrong, everything else falls apart.'
      },
      {
        question: 'According to the Build vs Buy framework, what\'s the best approach for startup authentication?',
        options: [
          'Build a custom authentication system for security',
          'Use proven solutions like Auth0 or Firebase Auth',
          'Skip authentication until you have more users',
          'Only use social login options'
        ],
        correctAnswer: 1,
        explanation: 'Authentication is rarely a differentiator for startups and proven solutions are more secure than custom builds.',
        followUp: 'Focus your development efforts on features that make you unique in the market.'
      }
    ],
    resources: [
      { title: 'The Lean Startup Methodology', url: 'https://leanstartup.co/principles', type: 'article' },
      { title: 'MVP Case Studies Collection', url: 'https://www.ycombinator.com/library/4Q-a-minimum-viable-product-is-not-a-product-it-s-a-process', type: 'article' },
      { title: 'No-Code Tool Directory', url: 'https://www.nocode.tech/tools', type: 'tool' }
    ],
    practicalExercises: [
      'Complete MVP Canvas: Problem, Solution, Key Metrics, Unfair Advantage, Channels, Customer Segments, Cost Structure, Revenue Streams',
      'Create your Build vs Buy decision matrix for your top 5 features',
      'Conduct 10 customer interviews using the Mom Test framework and document insights',
      'Design and launch a landing page MVP to test demand (include signup form and metrics tracking)',
      'Build a feature prioritization backlog using the Impact/Effort scoring system',
      'Create a customer validation testing plan with specific hypotheses and success metrics'
    ],
    unlockRequirement: { type: 'day', value: 5 },
    icon: Rocket,
    color: { from: 'from-blue-500', to: 'to-purple-600', accent: 'text-blue-600' }
  },
  {
    id: 'customer-discovery',
    title: 'Customer Discovery Deep Dive',
    description: 'Learn systematic approaches to understanding your target market',
    category: 'marketing',
    difficulty: 'intermediate',
    estimatedTime: 60,
    points: 30,
    lessons: [
      {
        title: 'Customer Segment Definition',
        content: 'A customer segment is a group of people who share common characteristics, behaviors, and needs. The more specific you can be, the better you can serve them.',
        type: 'text',
        duration: 15
      },
      {
        title: 'Creating User Personas',
        content: 'Personas should be based on real data, not assumptions. Include demographics, goals, frustrations, and behavioral patterns. Give them names and faces.',
        type: 'interactive',
        duration: 20
      },
      {
        title: 'Interview Techniques',
        content: 'Great customer interviews are conversations, not interrogations. Start broad, then narrow down. Listen more than you speak.',
        type: 'text',
        duration: 15
      },
      {
        title: 'Data Analysis & Insights',
        content: 'Look for patterns across interviews. What problems come up repeatedly? What solutions have customers already tried? What words do they use?',
        type: 'text',
        duration: 10
      }
    ],
    quizzes: [
      {
        question: 'What makes a good customer persona?',
        options: [
          'Based on demographic data only',
          'Created from assumptions about the market',
          'Based on real customer data and specific behaviors',
          'Focused only on positive characteristics'
        ],
        correctAnswer: 2,
        explanation: 'Effective personas combine real data with specific behavioral insights and include both positive traits and pain points.',
        followUp: 'Always validate personas with actual customer conversations.'
      }
    ],
    resources: [
      { title: 'Customer Development Guide', url: 'https://steveblank.com/category/customer-development/', type: 'article' },
      { title: 'Customer Interview Guide', url: 'https://www.ycombinator.com/library/6g-how-to-talk-to-users', type: 'article' },
      { title: 'User Research Templates', url: 'https://www.figma.com/community/file/1037282699267350863', type: 'tool' }
    ],
    practicalExercises: [
      'Interview 5 potential customers this week',
      'Create detailed personas based on interview data',
      'Identify your primary customer segment',
      'Map the customer journey for your personas'
    ],
    unlockRequirement: { type: 'completed_modules', value: 1 },
    icon: Users,
    color: { from: 'from-green-500', to: 'to-teal-600', accent: 'text-green-600' }
  },
  {
    id: 'financial-modeling',
    title: 'Startup Financial Modeling',
    description: 'Build realistic financial projections and understand key metrics',
    category: 'finance',
    difficulty: 'advanced',
    estimatedTime: 90,
    points: 40,
    lessons: [
      {
        title: 'Revenue Model Fundamentals',
        content: 'Understand different revenue models: subscription, transaction, advertising, marketplace, freemium. Choose based on customer behavior and market dynamics.',
        type: 'text',
        duration: 20
      },
      {
        title: 'Key Financial Metrics',
        content: 'Focus on metrics that matter for your business model: CAC, LTV, churn rate, burn rate, runway, gross margins. Track leading indicators, not just lagging ones.',
        type: 'interactive',
        duration: 25
      },
      {
        title: 'Building Financial Projections',
        content: 'Start with assumptions, build bottom-up models, include multiple scenarios. Be conservative with revenue, realistic with expenses.',
        type: 'text',
        duration: 30
      },
      {
        title: 'Fundraising Fundamentals',
        content: 'Understand when to raise, how much to raise, and what investors look for. Prepare for due diligence early.',
        type: 'text',
        duration: 15
      }
    ],
    quizzes: [
      {
        question: 'What is Customer Acquisition Cost (CAC)?',
        options: [
          'The total cost of acquiring all customers',
          'The cost to acquire one customer on average',
          'The lifetime value of a customer',
          'The cost of retaining existing customers'
        ],
        correctAnswer: 1,
        explanation: 'CAC is the average cost to acquire a single customer, calculated by dividing total acquisition spending by the number of customers acquired.',
        followUp: 'Always compare CAC to Customer Lifetime Value (LTV). The ratio should be at least 3:1.'
      }
    ],
    resources: [
      { title: 'SaaS Metrics 2.0 Guide', url: 'https://www.forentrepreneurs.com/saas-metrics-2/', type: 'article' },
      { title: 'Startup Financial Models', url: 'https://techcrunch.com/2017/06/01/saas-startup-financial-model/', type: 'article' },
      { title: 'Financial Planning Tools', url: 'https://www.google.com/sheets/about/', type: 'tool' }
    ],
    practicalExercises: [
      'Build a 3-year financial model for your startup',
      'Calculate your CAC and LTV',
      'Create different scenario projections',
      'Prepare a one-page financial summary'
    ],
    unlockRequirement: { type: 'day', value: 15 },
    icon: DollarSign,
    color: { from: 'from-yellow-500', to: 'to-orange-600', accent: 'text-yellow-600' }
  }
];

// Advanced modules (premium content)
const advancedModules: EnhancedLearningModule[] = [
  {
    id: 'funding-mastery',
    title: 'Funding & Investment Mastery',
    description: 'Master fundraising, understand investors, and navigate seed rounds successfully.',
    category: 'finance',
    difficulty: 'advanced',
    estimatedTime: 60,
    points: 50,
    lessons: [
      {
        title: 'Seed Funding Landscape Mastery',
        content: 'Seed funding is the most critical round for early-stage startups. Understanding the landscape, timing, and investor expectations can make the difference between success and failure.\n\n**Seed Round Fundamentals:**\n\n**Typical Range**: $250K - $2M (Pre-seed: $10K-$500K)\n**Equity Given Up**: 10-25% (aim for 15-20%)\n**Timeline**: 3-6 months fundraising process\n**Use of Funds**: 18-24 months runway\n\n**What Seed Investors Look For:**\n\n1. **Team (40% of decision)**\n   • Domain expertise in the problem area\n   • Previous startup experience or relevant skills\n   • Complementary co-founder skills\n   • Ability to execute and learn quickly\n\n2. **Traction (30% of decision)**\n   • Product-market fit signals\n   • User growth and engagement metrics\n   • Revenue (even if small)\n   • Customer validation and testimonials\n\n3. **Market (20% of decision)**\n   • Large addressable market ($1B+ TAM)\n   • Market timing and trends\n   • Competitive landscape understanding\n   • Market entry strategy\n\n4. **Product (10% of decision)**\n   • Clear value proposition\n   • Defensible technology or approach\n   • Scalable business model\n   • Product roadmap and vision\n\n**Seed Funding Sources:**\n\n**Angel Investors:**\n• Individual investors ($5K-$100K checks)\n• Often successful entrepreneurs or executives\n• Provide mentorship and network access\n• Quick decision-making (2-4 weeks)\n\n**Seed VCs:**\n• Institutional funds ($50K-$500K checks)\n• More formal process and due diligence\n• Larger follow-on potential\n• 6-12 week decision process\n\n**Accelerators:**\n• Programs like Y Combinator, Techstars\n• $100K-$250K for 6-10% equity\n• 3-6 month programs with demo day\n• Access to investor networks\n\n**Friends & Family:**\n• Personal network investments\n• Typically $1K-$25K per person\n• Often convertible notes or SAFE agreements\n• Fastest funding source\n\n**Crowdfunding:**\n• Platforms like Republic, SeedInvest\n• Regulatory compliance required\n• Public validation of concept\n• Marketing and customer acquisition benefits\n\n**Timing Your Seed Round:**\n\n**Too Early Signs:**\n• No product built yet\n• Haven\'t talked to customers\n• Team isn\'t complete\n• No clear go-to-market strategy\n\n**Perfect Timing:**\n• MVP built and tested\n• Early customer traction\n• Clear problem-solution fit\n• Ready to scale (hire, marketing, product)\n• 3-6 months of runway left\n\n**Too Late:**\n• Already at scale (Series A territory)\n• Significant revenue ($100K+ ARR)\n• Large team (15+ people)\n• Established market position\n\n**Seed Round Metrics to Track:**\n\n**SaaS Metrics:**\n• Monthly Recurring Revenue (MRR)\n• Customer Acquisition Cost (CAC)\n• Lifetime Value (LTV)\n• Monthly Active Users (MAU)\n• Churn rate\n\n**Marketplace Metrics:**\n• Gross Merchandise Volume (GMV)\n• Take rate\n• Supply and demand growth\n• Repeat usage rate\n• Transaction frequency\n\n**Consumer App Metrics:**\n• Daily/Monthly Active Users\n• Retention rates (D1, D7, D30)\n• Session length and frequency\n• Viral coefficient\n• User acquisition cost\n\n**The Seed Funding Process:**\n\n**Week 1-2: Preparation**\n• Finalize pitch deck\n• Update financial model\n• Prepare data room\n• Create investor target list\n\n**Week 3-8: Active Fundraising**\n• Send initial outreach emails\n• Conduct first meetings\n• Follow up with materials\n• Negotiate term sheets\n\n**Week 9-12: Due Diligence & Closing**\n• Legal documentation\n• Reference calls\n• Final negotiations\n• Wire transfers and closing\n\n**Red Flags for Seed Investors:**\n• Unrealistic market size claims\n• No clear competitive differentiation\n• Founder-market fit concerns\n• Lack of customer validation\n• Unclear use of funds\n• Team dysfunction or gaps\n• Legal or IP issues\n• Unrealistic valuation expectations',
        type: 'text',
        duration: 15
      },
      {
        title: 'Investor Types & Expectations',
        content: 'Angel investors vs VCs: Angels invest their own money and provide mentorship. VCs invest fund money and expect scalable returns. Each has different expectations and timelines.',
        type: 'text',
        duration: 15
      },
      {
        title: 'Pitch Deck Mastery',
        content: 'A winning pitch deck tells a story: Problem, Solution, Market, Business Model, Traction, Team, Financials, Funding Ask. Keep it to 10-12 slides maximum.',
        type: 'interactive',
        duration: 30
      }
    ],
    quizzes: [
      {
        question: 'What do seed investors primarily look for?',
        options: [
          'Perfect product and profitability',
          'Strong team and early traction',
          'Detailed financial projections',
          'Complete business plan'
        ],
        correctAnswer: 1,
        explanation: 'Seed investors focus on team quality and early signs of traction/product-market fit.',
        followUp: 'Show momentum rather than perfection at the seed stage.'
      }
    ],
    resources: [
      { title: 'Fundraising Guide', url: 'https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising', type: 'article' },
      { title: 'Pitch Deck Examples', url: 'https://www.alexanderjarvis.com/pitch-deck-collection/', type: 'article' }
    ],
    practicalExercises: [
      'Build a comprehensive 12-slide pitch deck following YC format with: Problem, Solution, Market, Product, Traction, Business Model, Competition, Team, Financials, Funding Ask, Use of Funds, Appendix',
      'Create detailed financial projections for 3 years including: Revenue model, Key metrics, Unit economics, Hiring plan, Burn rate, Runway analysis',
      'Develop investor targeting strategy: Research 50 relevant investors, categorize by stage/industry, create personalized outreach templates',
      'Practice pitch delivery: Record 2-minute elevator pitch, 10-minute full pitch, and Q&A scenarios',
      'Build data room with: Financial models, Legal documents, Customer references, Product demos, Team bios, Market research',
      'Create fundraising timeline with milestones, deadlines, and decision points over 16-week process'
    ],
    unlockRequirement: { type: 'day', value: 30 },
    icon: TrendingUp,
    color: { from: 'from-purple-500', to: 'to-pink-600', accent: 'text-purple-600' }
  }
];

// Combine all modules based on user's subscription status
const getAllModules = (isPremium: boolean) => {
  if (isPremium) {
    return [...beginnerModules, ...intermediateModules, ...advancedModules];
  }
  return beginnerModules;
};

export default function EnhancedMicroLearning() {
  const [selectedModule, setSelectedModule] = useState<EnhancedLearningModule | null>(null);
  const [completedModules, setCompletedModules] = useLocalStorage<string[]>('enhanced-completed-modules', []);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [moduleProgress, setModuleProgress] = useLocalStorage<Record<string, number>>('module-progress', {});
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isPremium, setIsPremium] = useState(false); // This would come from subscription status
  const { toast } = useToast();

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        setIsPremium(data.subscriptionStatus === 'active' || data.subscriptionStatus === 'trialing');
      } catch (error) {
        console.log('Subscription check failed, defaulting to free tier');
        setIsPremium(false);
      }
    };
    checkSubscription();
  }, []);

  // Get modules based on subscription status
  const enhancedModules = getAllModules(isPremium);

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setQuizAnswers({});
    setShowResults(false);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const submitQuiz = () => {
    if (!selectedModule) return;
    
    const correctAnswers = selectedModule.quizzes.filter((quiz, index) => 
      quizAnswers[index] === quiz.correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / selectedModule.quizzes.length) * 100);
    
    setModuleProgress(prev => ({
      ...prev,
      [selectedModule.id]: Math.max(prev[selectedModule.id] || 0, score)
    }));

    if (score >= 80 && !completedModules.includes(selectedModule.id)) {
      setCompletedModules(prev => [...prev, selectedModule.id]);
      toast({
        title: 'Module Completed!',
        description: `Earned ${selectedModule.points} points! Score: ${score}%`,
      });
    }
    
    setShowResults(true);
  };

  const openResource = (resource: any) => {
    toast({
      title: "Opening Resource",
      description: `Opening "${resource.title}" in a new tab`,
    });
    // In production, would open resource.url
    window.open(resource.url === '#' ? 'https://example.com' : resource.url, '_blank');
  };

  const getProgressPercentage = (moduleId: string) => {
    return moduleProgress[moduleId] || 0;
  };

  const isUnlocked = (module: EnhancedLearningModule) => {
    if (!module.unlockRequirement) return true;
    
    const { type, value } = module.unlockRequirement;
    
    switch (type) {
      case 'day':
        // Mock current day - in real app would come from user progress
        return 10 >= value;
      case 'completed_modules':
        return completedModules.length >= value;
      case 'points':
        const totalPoints = completedModules.reduce((sum, id) => {
          const mod = enhancedModules.find(m => m.id === id);
          return sum + (mod?.points || 0);
        }, 0);
        return totalPoints >= value;
      default:
        return true;
    }
  };

  return (
    <Card className="shadow-sm border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#FF6B35]" />
          Micro-Learning
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Comprehensive modules with lessons, quizzes, and practical exercises
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{completedModules.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{enhancedModules.length}</div>
            <div className="text-xs text-muted-foreground">Total Modules</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {completedModules.reduce((sum, id) => {
                const mod = enhancedModules.find(m => m.id === id);
                return sum + (mod?.points || 0);
              }, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Points Earned</div>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <Button
              key={level}
              variant={difficulty === level ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty(level)}
              className="capitalize"
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Module Grid */}
        <div className="grid gap-4">
          {enhancedModules.filter(m => m.difficulty === difficulty).map((module) => {
            const IconComponent = module.icon;
            const unlocked = isUnlocked(module);
            const completed = completedModules.includes(module.id);
            const progress = getProgressPercentage(module.id);
            
            const isPremiumContent = module.difficulty === 'intermediate' || module.difficulty === 'advanced';
            const canAccess = !isPremiumContent || isPremium;
            
            return (
              <Card 
                key={module.id} 
                className={`transition-all hover:shadow-md ${!unlocked || !canAccess ? 'opacity-60' : ''} ${
                  isPremiumContent && !isPremium ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${module.color.from} ${module.color.to} relative`}>
                      <IconComponent className="w-5 h-5 text-white" />
                      {isPremiumContent && !isPremium && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{module.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {module.difficulty}
                        </Badge>
                        {completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.estimatedTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {module.points} points
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {module.lessons.length} lessons
                        </div>
                      </div>

                      {progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                      
                      {module.unlockRequirement && !unlocked && (
                        <p className="text-xs text-orange-600 mb-3">
                          Unlock: {module.unlockRequirement.value} {module.unlockRequirement.type.replace('_', ' ')}
                        </p>
                      )}
                    </div>
                  </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                            size="sm"
                            disabled={!unlocked || !canAccess}
                            className={`w-full mt-3 ${
                              !canAccess ? 'bg-yellow-500 hover:bg-yellow-600' :
                              completed ? 'bg-green-600 hover:bg-green-700' : 
                              `bg-gradient-to-r ${module.color.from} ${module.color.to} hover:opacity-90`
                            }`}
                            onClick={() => {
                              if (!canAccess) {
                                toast({
                                  title: "Premium Content",
                                  description: "Upgrade to access intermediate and advanced learning modules.",
                                });
                                return;
                              }
                              setSelectedModule(module);
                            }}
                            data-testid={`learn-${module.id}`}
                          >
                            {!canAccess ? (
                              <>
                                <Star className="w-4 h-4 mr-1" />
                                Upgrade to Access
                              </>
                            ) : completed ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Review
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Start Learning
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          {selectedModule && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <selectedModule.icon className={`w-5 h-5 ${selectedModule.color.accent}`} />
                                  {selectedModule.title}
                                </DialogTitle>
                                <DialogDescription>
                                  {selectedModule.description}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                {/* Lessons Section */}
                                <div>
                                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Lessons ({selectedModule.lessons.length})
                                  </h3>
                                  <div className="space-y-6">
                                    {selectedModule.lessons.map((lesson, index) => (
                                      <div key={index} className="space-y-4">
                                        <Card className="p-6">
                                          <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                              {index + 1}
                                            </div>
                                            <div className="flex-1">
                                              <h4 className="text-lg font-semibold">{lesson.title}</h4>
                                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                {lesson.duration} min read
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="prose prose-sm max-w-none">
                                            {lesson.content.split('\n').map((line, pIndex) => {
                                              if (line.startsWith('## ')) {
                                                return <h3 key={pIndex} className="text-lg font-semibold mt-6 mb-3 text-gray-800">{line.replace('## ', '')}</h3>;
                                              } else if (line.startsWith('### ')) {
                                                return <h4 key={pIndex} className="text-base font-medium mt-4 mb-2 text-gray-700">{line.replace('### ', '')}</h4>;
                                              } else if (line.startsWith('**') && line.endsWith('**')) {
                                                return <p key={pIndex} className="font-semibold mb-2 text-gray-800">{line.replace(/\*\*/g, '')}</p>;
                                              } else if (line.startsWith('❌') || line.startsWith('✅')) {
                                                return <p key={pIndex} className="mb-2 pl-2">{line}</p>;
                                              } else if (line.startsWith('•')) {
                                                return <p key={pIndex} className="mb-1 ml-4">{line}</p>;
                                              } else if (line.trim()) {
                                                return <p key={pIndex} className="mb-3 text-gray-700">{line}</p>;
                                              }
                                              return null;
                                            })}
                                          </div>
                                        </Card>
                                        
                                        {/* Mini Quiz after each lesson */}
                                        {lesson.miniQuiz && (
                                          <Card className="p-4 bg-blue-50 border-blue-200">
                                            <div className="flex items-center gap-2 mb-3">
                                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">?</span>
                                              </div>
                                              <h5 className="font-medium text-blue-800">Knowledge Check</h5>
                                            </div>
                                            
                                            <div className="space-y-3">
                                              <p className="font-medium text-gray-800">{lesson.miniQuiz.question}</p>
                                              
                                              <div className="space-y-2">
                                                {lesson.miniQuiz.options.map((option, optIndex) => (
                                                  <button
                                                    key={optIndex}
                                                    className="w-full text-left p-3 rounded-lg border hover:bg-blue-100 transition-colors"
                                                    onClick={() => {
                                                      if (optIndex === lesson.miniQuiz!.correctAnswer) {
                                                        toast({
                                                          title: "Correct! ✓",
                                                          description: lesson.miniQuiz!.explanation,
                                                        });
                                                      } else {
                                                        toast({
                                                          title: "Try again",
                                                          description: `Hint: ${lesson.miniQuiz!.explanation}`,
                                                          variant: "destructive",
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                                    {option}
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          </Card>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Section Quiz */}
                                <div>
                                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    Section Quiz ({selectedModule.quizzes.length} questions)
                                  </h3>
                                  
                                  <div className="space-y-4">
                                    {selectedModule.quizzes.map((quiz, index) => (
                                      <Card key={index} className="p-4">
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                              {index + 1}
                                            </div>
                                            <p className="font-medium">{quiz.question}</p>
                                          </div>
                                          
                                          <div className="space-y-2 ml-8">
                                            {quiz.options.map((option, optIndex) => (
                                              <button
                                                key={optIndex}
                                                className="w-full text-left p-3 rounded-lg border hover:bg-purple-50 transition-colors"
                                                onClick={() => {
                                                  if (optIndex === quiz.correctAnswer) {
                                                    toast({
                                                      title: "Correct! ✓",
                                                      description: quiz.explanation,
                                                    });
                                                  } else {
                                                    toast({
                                                      title: "Try again",
                                                      description: `Hint: ${quiz.explanation}`,
                                                      variant: "destructive",
                                                    });
                                                  }
                                                }}
                                              >
                                                <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                                {option}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                {/* Practical Exercises */}
                                <div>
                                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Practical Exercises
                                  </h3>
                                  
                                  <div className="space-y-3">
                                    {selectedModule.practicalExercises.map((exercise, index) => (
                                      <Card key={index} className="p-4 bg-green-50 border-green-200">
                                        <div className="flex items-start gap-3">
                                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                                            {index + 1}
                                          </div>
                                          <p className="text-sm text-green-800 flex-1">{exercise}</p>
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                {/* Resources */}
                                <div>
                                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5" />
                                    Resources
                                  </h3>
                                  
                                  <div className="space-y-2">
                                    {selectedModule.resources.map((resource, index) => (
                                      <button 
                                        key={index} 
                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => window.open(resource.url, '_blank')}
                                      >
                                        {resource.type === 'video' && <PlayCircle className="w-4 h-4 text-red-600" />}
                                        {resource.type === 'article' && <BookOpen className="w-4 h-4 text-blue-600" />}
                                        {resource.type === 'tool' && <Lightbulb className="w-4 h-4 text-yellow-600" />}
                                        <span className="flex-1 text-left text-sm">{resource.title}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                      </button>
                                    ))}
                                </div>
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Empty State */}
        {enhancedModules.filter(m => m.difficulty === difficulty).length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No modules available for {difficulty} level</p>
            <p className="text-sm text-gray-500 mt-2">Try selecting a different difficulty level</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
