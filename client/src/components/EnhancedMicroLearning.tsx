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

interface Lesson {
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
  duration: number;
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

const enhancedModules: EnhancedLearningModule[] = [
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
        content: 'An MVP is not about building a basic version of your product - it\'s about building the smallest version that allows you to learn from customers with minimal effort. The goal is to test your core hypothesis about customer needs.',
        type: 'text',
        duration: 10
      },
      {
        title: 'Identifying Core Features',
        content: 'Focus on the single most important problem your product solves. Ask: "What is the one thing that, if removed, would make this product useless?" That\'s your core feature.',
        type: 'text',
        duration: 8
      },
      {
        title: 'Building vs Buying',
        content: 'Before writing code, explore no-code solutions, existing tools, or manual processes. Many successful startups began with "fake doors" - testing demand before building.',
        type: 'interactive',
        duration: 12
      },
      {
        title: 'Customer Validation Framework',
        content: 'Use the "Mom Test" approach: Ask about past behavior, not future intentions. "Tell me about the last time you..." instead of "Would you use..."',
        type: 'text',
        duration: 15
      }
    ],
    quizzes: [
      {
        question: 'What is the primary purpose of building an MVP?',
        options: [
          'To create a basic version of your final product',
          'To test core hypotheses with minimal effort',
          'To save money on development costs',
          'To get to market faster than competitors'
        ],
        correctAnswer: 1,
        explanation: 'An MVP is specifically designed to test your fundamental assumptions about customer problems and solutions with the least amount of work.',
        followUp: 'Remember: MVPs are about learning, not launching.'
      },
      {
        question: 'Which question follows the "Mom Test" principle?',
        options: [
          'Would you pay $10/month for this service?',
          'Do you think this is a good idea?',
          'Tell me about the last time you struggled with organizing your files',
          'Would you recommend this to a friend?'
        ],
        correctAnswer: 2,
        explanation: 'The Mom Test focuses on past behavior and specific experiences rather than hypothetical future actions.',
        followUp: 'Ask about what people have done, not what they might do.'
      }
    ],
    resources: [
      { title: 'The Lean Startup Methodology', url: 'https://theleanstartup.com/', type: 'article' },
      { title: 'MVP Success Stories', url: 'https://blog.ycombinator.com/mvp-examples/', type: 'video' },
      { title: 'No-Code MVP Tools', url: 'https://nocode.tech/', type: 'tool' }
    ],
    practicalExercises: [
      'Define your core value proposition in one sentence',
      'List 3 assumptions about your customers you need to validate',
      'Design a landing page to test demand before building',
      'Create a customer interview script using Mom Test principles'
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
      { title: 'Interview Best Practices', url: 'https://www.intercom.com/blog/customer-interview-questions/', type: 'video' }
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
      { title: 'SaaS Metrics Guide', url: 'https://www.forentrepreneurs.com/saas-metrics-2/', type: 'article' },
      { title: 'Financial Modeling Templates', url: 'https://visible.vc/blog/startup-financial-model/', type: 'tool' }
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

export default function EnhancedMicroLearning() {
  const [selectedModule, setSelectedModule] = useState<EnhancedLearningModule | null>(null);
  const [completedModules, setCompletedModules] = useLocalStorage<string[]>('enhanced-completed-modules', []);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [moduleProgress, setModuleProgress] = useLocalStorage<Record<string, number>>('module-progress', {});
  const { toast } = useToast();

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
          Enhanced Micro-Learning
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

        {/* Module Grid */}
        <div className="grid gap-4">
          {enhancedModules.map((module) => {
            const IconComponent = module.icon;
            const unlocked = isUnlocked(module);
            const completed = completedModules.includes(module.id);
            const progress = getProgressPercentage(module.id);
            
            return (
              <Card key={module.id} className={`transition-all hover:shadow-md ${!unlocked ? 'opacity-60' : ''}`}>
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
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Lessons ({selectedModule.lessons.length})
                                  </h4>
                                  <div className="space-y-3">
                                    {selectedModule.lessons.map((lesson, index) => (
                                      <Card key={index} className="border-l-4 border-l-blue-500">
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-medium">{lesson.title}</h5>
                                            <Badge variant="outline" className="text-xs">
                                              {lesson.duration} min
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-gray-600 leading-relaxed">{lesson.content}</p>
                                          {lesson.type === 'interactive' && (
                                            <Button size="sm" variant="outline" className="mt-2">
                                              Try Interactive Exercise
                                            </Button>
                                          )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                {/* Resources Section */}
                                <div>
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Resources
                                  </h4>
                                  <div className="grid gap-2">
                                    {selectedModule.resources.map((resource, index) => (
                                      <button 
                                        key={index} 
                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => openResource(resource)}
                                        data-testid={`resource-${index}`}
                                      >
                                        {resource.type === 'video' && <PlayCircle className="w-4 h-4 text-red-600" />}
                                        {resource.type === 'article' && <BookOpen className="w-4 h-4 text-blue-600" />}
                                        {resource.type === 'tool' && <Lightbulb className="w-4 h-4 text-yellow-600" />}
                                        <span className="flex-1 text-left">{resource.title}</span>
                                        <ChevronRight className="w-3 h-3 text-gray-400" />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Practical Exercises */}
                                <div>
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Practical Exercises
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedModule.practicalExercises.map((exercise, index) => (
                                      <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                                        <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{exercise}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Quiz Section */}
                                {selectedModule.quizzes.length > 0 && (
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-semibold flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Knowledge Check ({selectedModule.quizzes.length} questions)
                                      </h4>
                                      {showResults && (
                                        <Button size="sm" variant="outline" onClick={resetQuiz}>
                                          <RefreshCw className="w-4 h-4 mr-1" />
                                          Retry Quiz
                                        </Button>
                                      )}
                                    </div>
                                    
                                    {!showResults ? (
                                      <div className="space-y-4">
                                        {selectedModule.quizzes.map((quiz, qIndex) => (
                                          <Card key={qIndex} className="border-l-4 border-l-purple-500">
                                            <CardContent className="p-4">
                                              <h5 className="font-medium mb-3">
                                                Question {qIndex + 1}: {quiz.question}
                                              </h5>
                                              <div className="space-y-2">
                                                {quiz.options.map((option, oIndex) => (
                                                  <label key={oIndex} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                                    <input
                                                      type="radio"
                                                      name={`quiz-${qIndex}`}
                                                      value={oIndex}
                                                      checked={quizAnswers[qIndex] === oIndex}
                                                      onChange={() => handleQuizAnswer(qIndex, oIndex)}
                                                    />
                                                    <span className="text-sm">{option}</span>
                                                  </label>
                                                ))}
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                        
                                        <Button 
                                          onClick={submitQuiz}
                                          disabled={Object.keys(quizAnswers).length < selectedModule.quizzes.length}
                                          className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                                        >
                                          Submit Quiz
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        {selectedModule.quizzes.map((quiz, qIndex) => {
                                          const userAnswer = quizAnswers[qIndex];
                                          const isCorrect = userAnswer === quiz.correctAnswer;
                                          
                                          return (
                                            <Card key={qIndex} className={`border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
                                              <CardContent className="p-4">
                                                <h5 className="font-medium mb-2">{quiz.question}</h5>
                                                <p className="text-sm mb-2">
                                                  <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                                                    Your answer: {quiz.options[userAnswer]} {isCorrect ? '✓' : '✗'}
                                                  </span>
                                                </p>
                                                {!isCorrect && (
                                                  <p className="text-sm text-green-800 mb-2">
                                                    Correct answer: {quiz.options[quiz.correctAnswer]}
                                                  </p>
                                                )}
                                                <p className="text-sm text-gray-700">{quiz.explanation}</p>
                                                {quiz.followUp && (
                                                  <p className="text-sm text-blue-700 mt-2 italic">{quiz.followUp}</p>
                                                )}
                                              </CardContent>
                                            </Card>
                                          );
                                        })}
                                        
                                        <div className="text-center p-4 bg-gray-50 rounded">
                                          <p className="text-lg font-semibold">
                                            Score: {Math.round((selectedModule.quizzes.filter((_, i) => quizAnswers[i] === selectedModule.quizzes[i].correctAnswer).length / selectedModule.quizzes.length) * 100)}%
                                          </p>
                                          {Math.round((selectedModule.quizzes.filter((_, i) => quizAnswers[i] === selectedModule.quizzes[i].correctAnswer).length / selectedModule.quizzes.length) * 100) >= 80 ? (
                                            <p className="text-green-600 text-sm">Excellent! Module completed.</p>
                                          ) : (
                                            <p className="text-orange-600 text-sm">Try again to master this topic (80% needed to complete).</p>
                                          )}
                                        </div>
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
      </CardContent>
    </Card>
  );
}