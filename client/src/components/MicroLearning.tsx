import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  ChevronRight
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'fundamentals' | 'marketing' | 'finance' | 'operations' | 'leadership';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  points: number;
  content: {
    keyPoints: string[];
    actionItems: string[];
    resources: { title: string; url: string; type: 'article' | 'video' | 'tool' }[];
    quiz?: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    };
  };
  unlockRequirement?: {
    type: 'missions_completed' | 'modules_completed' | 'streak_days';
    value: number;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: {
    from: string;
    to: string;
    accent: string;
  };
}

const learningModules: LearningModule[] = [
  {
    id: 'mvp-basics',
    title: 'Building Your MVP',
    description: 'Learn to create a Minimum Viable Product that customers actually want',
    category: 'fundamentals',
    difficulty: 'beginner',
    estimatedTime: 5,
    points: 10,
    icon: Rocket,
    color: { from: 'from-blue-400', to: 'to-blue-600', accent: 'text-blue-600' },
    content: {
      keyPoints: [
        'MVP focuses on core value proposition, not features',
        'Get customer feedback before building everything',
        'Start with manual processes before automation',
        'Measure what matters: user engagement and retention'
      ],
      actionItems: [
        'Define your core value proposition in one sentence',
        'List 3 essential features for your MVP',
        'Identify 5 potential early customers to interview',
        'Create a simple landing page to test interest'
      ],
      resources: [
        { title: 'Build Your First MVP Guide', url: '#', type: 'article' },
        { title: 'MVP Success Stories', url: '#', type: 'video' },
        { title: 'Free Prototyping Tools', url: '#', type: 'tool' }
      ],
      quiz: {
        question: 'What is the primary goal of an MVP?',
        options: [
          'To build all possible features',
          'To test core assumptions with real users',
          'To impress investors',
          'To compete with established companies'
        ],
        correctAnswer: 1,
        explanation: 'An MVP tests your core assumptions with minimal resources to learn what customers actually want.'
      }
    }
  },
  {
    id: 'customer-validation',
    title: 'Customer Validation Mastery',
    description: 'Master the art of validating your business idea with real customers',
    category: 'marketing',
    difficulty: 'beginner',
    estimatedTime: 7,
    points: 15,
    icon: Users,
    color: { from: 'from-green-400', to: 'to-green-600', accent: 'text-green-600' },
    content: {
      keyPoints: [
        'Ask open-ended questions to understand pain points',
        'Focus on problems, not your solution',
        'Look for emotional responses and strong reactions',
        'Validate willingness to pay, not just interest'
      ],
      actionItems: [
        'Create a list of 10 interview questions',
        'Schedule 5 customer interviews this week',
        'Document patterns in customer responses',
        'Adjust your value proposition based on feedback'
      ],
      resources: [
        { title: 'Customer Interview Best Practices', url: '#', type: 'article' },
        { title: 'Validation Techniques That Work', url: '#', type: 'video' },
        { title: 'Free Scheduling Tools', url: '#', type: 'tool' }
      ]
    }
  },
  {
    id: 'pricing-strategy',
    title: 'Pricing Psychology & Strategy',
    description: 'Set prices that maximize revenue while providing customer value',
    category: 'finance',
    difficulty: 'intermediate',
    estimatedTime: 8,
    points: 20,
    icon: DollarSign,
    color: { from: 'from-yellow-400', to: 'to-orange-600', accent: 'text-orange-600' },
    unlockRequirement: { type: 'modules_completed', value: 2 },
    content: {
      keyPoints: [
        'Price based on value delivered, not cost-plus',
        'Test different price points with real customers',
        'Consider psychological pricing effects ($99 vs $100)',
        'Bundle features to increase average transaction value'
      ],
      actionItems: [
        'Calculate your unit economics',
        'Research competitor pricing strategies',
        'Test 3 different price points with A/B testing',
        'Create pricing tiers with clear value differences'
      ],
      resources: [
        { title: 'Smart Pricing Strategies', url: '#', type: 'article' },
        { title: 'Pricing Psychology Examples', url: '#', type: 'video' },
        { title: 'Free A/B Testing Tools', url: '#', type: 'tool' }
      ]
    }
  },
  {
    id: 'growth-hacking',
    title: 'Growth Hacking Fundamentals',
    description: 'Learn growth strategies that helped startups scale from 0 to millions',
    category: 'marketing',
    difficulty: 'intermediate',
    estimatedTime: 10,
    points: 25,
    icon: TrendingUp,
    color: { from: 'from-purple-400', to: 'to-pink-600', accent: 'text-purple-600' },
    unlockRequirement: { type: 'missions_completed', value: 15 },
    content: {
      keyPoints: [
        'Focus on one growth channel at a time',
        'Measure everything and optimize continuously',
        'Viral loops can accelerate organic growth',
        'Content marketing builds long-term audience'
      ],
      actionItems: [
        'Choose your primary growth channel',
        'Set up analytics to track user behavior',
        'Create a referral system for existing users',
        'Produce 1 piece of valuable content weekly'
      ],
      resources: [
        { title: 'Growth Strategy Framework', url: '#', type: 'article' },
        { title: 'Organic Growth Techniques', url: '#', type: 'video' },
        { title: 'Free Analytics Tools', url: '#', type: 'tool' }
      ]
    }
  },
  {
    id: 'leadership-basics',
    title: 'Founder Leadership Skills',
    description: 'Develop the leadership skills needed to build and motivate your team',
    category: 'leadership',
    difficulty: 'advanced',
    estimatedTime: 12,
    points: 30,
    icon: Star,
    color: { from: 'from-indigo-400', to: 'to-purple-600', accent: 'text-indigo-600' },
    unlockRequirement: { type: 'missions_completed', value: 30 },
    content: {
      keyPoints: [
        'Lead by example and communicate your vision clearly',
        'Give feedback regularly and recognize achievements',
        'Make decisions quickly but be willing to pivot',
        'Build a culture of learning and experimentation'
      ],
      actionItems: [
        'Write down your company vision and values',
        'Schedule regular one-on-ones with team members',
        'Create a feedback system for continuous improvement',
        'Establish clear goals and success metrics'
      ],
      resources: [
        { title: 'Leadership Fundamentals', url: '#', type: 'article' },
        { title: 'Team Building Strategies', url: '#', type: 'video' },
        { title: 'Free Communication Tools', url: '#', type: 'tool' }
      ]
    }
  }
];

export function MicroLearning() {
  const [completedModules, setCompletedModules] = useLocalStorage<string[]>('completed-learning-modules', []);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const categoryColors = {
    fundamentals: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    marketing: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    finance: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    operations: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    leadership: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' }
  };

  const isModuleUnlocked = (module: LearningModule) => {
    if (!module.unlockRequirement) return true;
    
    const { type, value } = module.unlockRequirement;
    switch (type) {
      case 'modules_completed':
        return completedModules.length >= value;
      case 'missions_completed':
        // This would need to be connected to actual progress data
        return true; // For now, assume unlocked
      case 'streak_days':
        return true; // For now, assume unlocked
      default:
        return true;
    }
  };

  const completeModule = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules((prev: string[]) => [...prev, moduleId]);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (selectedModule && quizAnswer === selectedModule.content.quiz?.correctAnswer) {
      completeModule(selectedModule.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Micro-Learning Hub
          </CardTitle>
          <p className="text-purple-100">
            Bite-sized entrepreneur education to level up your startup skills
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{completedModules.length}/{learningModules.length} Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{completedModules.reduce((sum, moduleId) => {
                const module = learningModules.find(m => m.id === moduleId);
                return sum + (module?.points || 0);
              }, 0)} Points Earned</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {Object.entries(
          learningModules.reduce((acc, module) => {
            if (!acc[module.category]) acc[module.category] = [];
            acc[module.category].push(module);
            return acc;
          }, {} as Record<string, LearningModule[]>)
        ).map(([category, modules]) => {
          const categoryStyle = categoryColors[category as keyof typeof categoryColors];
          
          return (
            <div key={category} className="space-y-3">
              <h3 className={`font-semibold capitalize px-3 py-1 rounded-full inline-block text-sm ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}>
                {category}
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {modules.map((module) => {
                  const completed = completedModules.includes(module.id);
                  const unlocked = isModuleUnlocked(module);
                  const IconComponent = module.icon;

                  return (
                    <Card
                      key={module.id}
                      className={`relative transition-all hover:shadow-md ${
                        completed ? 'border-green-300 bg-green-50' :
                        unlocked ? 'border-gray-200 hover:border-purple-300' :
                        'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                    >
                      {completed && (
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                      
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${module.color.from} ${module.color.to}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-800">{module.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {module.difficulty}
                              </Badge>
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
                            </div>
                            
                            {module.unlockRequirement && !unlocked && (
                              <p className="text-xs text-orange-600 mb-3">
                                Unlock: {module.unlockRequirement.value} {module.unlockRequirement.type.replace('_', ' ')}
                              </p>
                            )}
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  disabled={!unlocked}
                                  className={`w-full ${completed ? 'bg-green-600 hover:bg-green-700' : `bg-gradient-to-r ${module.color.from} ${module.color.to} hover:opacity-90`}`}
                                  onClick={() => setSelectedModule(module)}
                                  data-testid={`learn-${module.id}`}
                                >
                                  {completed ? (
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
                              
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-semibold mb-2">Key Points</h4>
                                        <ul className="space-y-1 text-sm">
                                          {selectedModule.content.keyPoints.map((point, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <span className="text-purple-600 font-bold">•</span>
                                              {point}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-semibold mb-2">Action Items</h4>
                                        <ul className="space-y-1 text-sm">
                                          {selectedModule.content.actionItems.map((action, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                              {action}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-semibold mb-2">Resources</h4>
                                        <div className="space-y-2">
                                          {selectedModule.content.resources.map((resource, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                              {resource.type === 'video' && <PlayCircle className="w-4 h-4 text-red-600" />}
                                              {resource.type === 'article' && <BookOpen className="w-4 h-4 text-blue-600" />}
                                              {resource.type === 'tool' && <Lightbulb className="w-4 h-4 text-yellow-600" />}
                                              <span>{resource.title}</span>
                                              <ChevronRight className="w-3 h-3 text-gray-400 ml-auto" />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      {selectedModule.content.quiz && !completed && (
                                        <div className="border-t pt-4">
                                          <h4 className="font-semibold mb-2">Knowledge Check</h4>
                                          <p className="text-sm mb-3">{selectedModule.content.quiz.question}</p>
                                          <div className="space-y-2 mb-3">
                                            {selectedModule.content.quiz.options.map((option, index) => (
                                              <label key={index} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name="quiz-answer"
                                                  value={index}
                                                  checked={quizAnswer === index}
                                                  onChange={() => setQuizAnswer(index)}
                                                  disabled={quizSubmitted}
                                                />
                                                <span className="text-sm">{option}</span>
                                              </label>
                                            ))}
                                          </div>
                                          
                                          {!quizSubmitted ? (
                                            <Button
                                              onClick={handleQuizSubmit}
                                              disabled={quizAnswer === null}
                                              className="w-full"
                                              data-testid="submit-quiz"
                                            >
                                              Submit Answer
                                            </Button>
                                          ) : (
                                            <div className={`p-3 rounded ${quizAnswer === selectedModule.content.quiz.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                              {quizAnswer === selectedModule.content.quiz.correctAnswer ? (
                                                <>
                                                  <CheckCircle className="w-4 h-4 inline mr-1" />
                                                  Correct! Module completed.
                                                </>
                                              ) : (
                                                'Incorrect. Try again later.'
                                              )}
                                              <p className="text-sm mt-1">{selectedModule.content.quiz.explanation}</p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}