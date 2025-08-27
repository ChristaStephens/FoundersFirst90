import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Target, 
  Calendar, 
  TrendingUp, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Sparkles,
  PiggyBank,
  Rocket
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'revenue' | 'funding' | 'savings' | 'investment';
  priority: 'high' | 'medium' | 'low';
  milestones: {
    amount: number;
    date: string;
    description: string;
    achieved: boolean;
  }[];
  createdAt: string;
}

const goalTemplates = [
  {
    name: 'First $1K Revenue',
    category: 'revenue' as const,
    targetAmount: 1000,
    description: 'Achieve your first $1,000 in revenue',
    icon: DollarSign,
    color: 'from-green-400 to-green-600',
    milestones: [
      { amount: 100, description: 'First $100 in revenue' },
      { amount: 500, description: 'Reach $500 milestone' },
      { amount: 1000, description: 'Hit $1K revenue goal' }
    ]
  },
  {
    name: 'Seed Funding Goal',
    category: 'funding' as const,
    targetAmount: 50000,
    description: 'Raise $50K in seed funding',
    icon: Rocket,
    color: 'from-blue-400 to-blue-600',
    milestones: [
      { amount: 10000, description: 'First $10K raised' },
      { amount: 25000, description: 'Halfway to seed goal' },
      { amount: 50000, description: 'Complete seed round' }
    ]
  },
  {
    name: 'Emergency Fund',
    category: 'savings' as const,
    targetAmount: 10000,
    description: 'Build $10K business emergency fund',
    icon: PiggyBank,
    color: 'from-orange-400 to-orange-600',
    milestones: [
      { amount: 2500, description: 'First $2.5K saved' },
      { amount: 5000, description: 'Halfway to fund goal' },
      { amount: 10000, description: 'Full emergency fund' }
    ]
  },
  {
    name: 'Product Development',
    category: 'investment' as const,
    targetAmount: 5000,
    description: '$5K for product development',
    icon: Sparkles,
    color: 'from-purple-400 to-purple-600',
    milestones: [
      { amount: 1500, description: 'MVP development fund' },
      { amount: 3000, description: 'Feature expansion fund' },
      { amount: 5000, description: 'Full development budget' }
    ]
  }
];

export function FinancialGoalWizard() {
  const [goals, setGoals] = useLocalStorage<FinancialGoal[]>('financial-goals', []);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof goalTemplates[0] | null>(null);
  const [customGoal, setCustomGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: 'revenue' as const,
    priority: 'medium' as const
  });

  const categoryColors = {
    revenue: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    funding: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    savings: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    investment: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
  };

  const createGoalFromTemplate = (template: typeof goalTemplates[0], targetDate: string) => {
    const goal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      name: template.name,
      targetAmount: template.targetAmount,
      currentAmount: 0,
      targetDate,
      category: template.category,
      priority: 'high',
      milestones: template.milestones.map((milestone, index) => ({
        amount: milestone.amount,
        date: new Date(new Date(targetDate).getTime() - (template.milestones.length - index - 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: milestone.description,
        achieved: false
      })),
      createdAt: new Date().toISOString()
    };
    return goal;
  };

  const createCustomGoal = () => {
    const milestones = [];
    const targetAmount = parseInt(customGoal.targetAmount);
    const milestoneAmounts = [
      Math.round(targetAmount * 0.25),
      Math.round(targetAmount * 0.5),
      Math.round(targetAmount * 0.75),
      targetAmount
    ];

    milestoneAmounts.forEach((amount, index) => {
      milestones.push({
        amount,
        date: new Date(new Date(customGoal.targetDate).getTime() - (milestoneAmounts.length - index - 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Reach $${amount.toLocaleString()} milestone`,
        achieved: false
      });
    });

    const goal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      name: customGoal.name,
      targetAmount,
      currentAmount: 0,
      targetDate: customGoal.targetDate,
      category: customGoal.category,
      priority: customGoal.priority,
      milestones,
      createdAt: new Date().toISOString()
    };
    return goal;
  };

  const handleCreateGoal = (targetDate: string) => {
    const goal = selectedTemplate 
      ? createGoalFromTemplate(selectedTemplate, targetDate)
      : createCustomGoal();
    
    setGoals((prev: FinancialGoal[]) => [...prev, goal]);
    setShowWizard(false);
    setCurrentStep(1);
    setSelectedTemplate(null);
    setCustomGoal({
      name: '',
      targetAmount: '',
      targetDate: '',
      category: 'revenue',
      priority: 'medium'
    });
  };

  const updateGoalProgress = (goalId: string, newAmount: number) => {
    setGoals((prev: FinancialGoal[]) => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => ({
          ...milestone,
          achieved: newAmount >= milestone.amount
        }));
        return { ...goal, currentAmount: newAmount, milestones: updatedMilestones };
      }
      return goal;
    }));
  };

  const getGoalProgress = (goal: FinancialGoal) => {
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  };

  const getNextMilestone = (goal: FinancialGoal) => {
    return goal.milestones.find(m => !m.achieved);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Financial Goal Tracker
          </CardTitle>
          <p className="text-green-100">
            Set and track your startup's financial milestones
          </p>
        </CardHeader>
      </Card>

      {/* Active Goals */}
      {goals.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Your Active Goals</h3>
          {goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const nextMilestone = getNextMilestone(goal);
            const categoryStyle = categoryColors[goal.category];
            
            return (
              <Card key={goal.id} className="border-2 border-gray-100 hover:border-purple-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                      <Badge className={`text-xs ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}>
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        ${goal.currentAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        / ${goal.targetAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <Progress value={progress} className="mb-3 h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {Math.round(progress)}% complete
                    </span>
                    <span className="text-gray-600">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {nextMilestone && (
                    <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-800">Next milestone:</span>
                        <span className="font-medium text-purple-800">
                          ${nextMilestone.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-purple-600 mt-1">{nextMilestone.description}</p>
                    </div>
                  )}
                  
                  <div className="mt-3 flex gap-2">
                    <Input
                      type="number"
                      placeholder="Update amount"
                      className="flex-1 h-8"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseInt((e.target as HTMLInputElement).value);
                          if (value >= 0) {
                            updateGoalProgress(goal.id, value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      data-testid={`update-goal-${goal.id}`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create New Goal */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg font-semibold rounded-xl" data-testid="create-goal">
            <Target className="w-5 h-5 mr-2" />
            {goals.length === 0 ? 'Set Your First Financial Goal' : 'Create New Goal'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Financial Goal Wizard
            </DialogTitle>
            <DialogDescription>
              Step {currentStep} of 3 - Let's set up your financial goal
            </DialogDescription>
          </DialogHeader>
          
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Choose a goal template or create custom</h4>
              <div className="grid grid-cols-1 gap-3">
                {goalTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <div
                      key={template.name}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTemplate?.name === template.name
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                      data-testid={`template-${template.name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">{template.name}</h5>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <p className="text-xs text-purple-600">${template.targetAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === null
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                  onClick={() => setSelectedTemplate(null)}
                  data-testid="template-custom"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Custom Goal</h5>
                      <p className="text-sm text-gray-600">Create your own financial goal</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                data-testid="next-step-1"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
          
          {currentStep === 2 && selectedTemplate === null && (
            <div className="space-y-4">
              <h4 className="font-semibold">Customize Your Goal</h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input
                    id="goal-name"
                    value={customGoal.name}
                    onChange={(e) => setCustomGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., First Product Launch"
                    data-testid="custom-goal-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="target-amount">Target Amount ($)</Label>
                  <Input
                    id="target-amount"
                    type="number"
                    value={customGoal.targetAmount}
                    onChange={(e) => setCustomGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    placeholder="5000"
                    data-testid="custom-goal-amount"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={customGoal.category} onValueChange={(value: any) => setCustomGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger data-testid="custom-goal-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="funding">Funding</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={customGoal.priority} onValueChange={(value: any) => setCustomGoal(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger data-testid="custom-goal-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!customGoal.name || !customGoal.targetAmount}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  data-testid="next-step-2"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && selectedTemplate !== null && (
            <div className="space-y-4">
              <h4 className="font-semibold">Review Your Selected Goal</h4>
              
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedTemplate.color}`}>
                      <selectedTemplate.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">{selectedTemplate.name}</h5>
                      <p className="text-sm text-gray-600">${selectedTemplate.targetAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h6 className="text-sm font-medium text-gray-700">Milestones:</h6>
                    {selectedTemplate.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>${milestone.amount.toLocaleString()} - {milestone.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  data-testid="next-step-2"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Set Target Date</h4>
              
              <div className="space-y-3">
                <Label htmlFor="target-date">When do you want to achieve this goal?</Label>
                <Input
                  id="target-date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={customGoal.targetDate}
                  onChange={(e) => setCustomGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  data-testid="target-date"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => handleCreateGoal(customGoal.targetDate)}
                  disabled={!customGoal.targetDate}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  data-testid="create-financial-goal"
                >
                  Create Goal <CheckCircle className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}