import { useState } from 'react';
import { ArrowLeft, Calculator, CheckCircle, AlertTriangle, BookOpen, Target } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';

interface MathSolverProps {
  task?: any;
  onComplete: (taskId: string, submissionData: any) => void;
  onBack: () => void;
}

interface MathProblem {
  id: string;
  type: string;
  difficulty: string;
  problem: string;
  aiSolution: {
    steps: string[];
    finalAnswer: string;
    explanation: string;
  };
  correctAnswer: string;
  commonMistakes: string[];
}

export function MathSolver({ task, onComplete, onBack }: MathSolverProps) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [evaluations, setEvaluations] = useState<{[key: string]: any}>({});
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{[key: string]: string}>({});

  const mathProblems: MathProblem[] = [
    {
      id: 'calc-1',
      type: 'Calculus',
      difficulty: 'Advanced',
      problem: 'Find the derivative of f(x) = x³ sin(2x) using the product rule.',
      aiSolution: {
        steps: [
          'Given: f(x) = x³ sin(2x)',
          'Apply product rule: (uv)\' = u\'v + uv\'',
          'Let u = x³, so u\' = 3x²',
          'Let v = sin(2x), so v\' = 2cos(2x)',
          'f\'(x) = (3x²)(sin(2x)) + (x³)(2cos(2x))',
          'f\'(x) = 3x²sin(2x) + 2x³cos(2x)'
        ],
        finalAnswer: 'f\'(x) = 3x²sin(2x) + 2x³cos(2x)',
        explanation: 'We used the product rule since we have two functions multiplied together. The derivative of x³ is 3x², and the derivative of sin(2x) requires the chain rule, giving us 2cos(2x).'
      },
      correctAnswer: 'f\'(x) = 3x²sin(2x) + 2x³cos(2x)',
      commonMistakes: ['Forgetting to apply chain rule to sin(2x)', 'Incorrect application of product rule', 'Arithmetic errors in coefficients']
    },
    {
      id: 'algebra-1',
      type: 'Algebra',
      difficulty: 'Intermediate',
      problem: 'Solve the quadratic equation: 2x² - 8x + 6 = 0',
      aiSolution: {
        steps: [
          'Given: 2x² - 8x + 6 = 0',
          'Divide by 2: x² - 4x + 3 = 0',
          'Factor: (x - 1)(x - 3) = 0',
          'Solve: x - 1 = 0 or x - 3 = 0',
          'Therefore: x = 1 or x = 3'
        ],
        finalAnswer: 'x = 1 or x = 3',
        explanation: 'We simplified by dividing by 2, then factored the quadratic. We could also use the quadratic formula to verify our answer.'
      },
      correctAnswer: 'x = 1 or x = 3',
      commonMistakes: ['Factoring errors', 'Not simplifying coefficients first', 'Missing one solution']
    },
    {
      id: 'geometry-1',
      type: 'Geometry',
      difficulty: 'Intermediate',
      problem: 'Find the area of a triangle with vertices at A(2,1), B(6,3), and C(4,7).',
      aiSolution: {
        steps: [
          'Given vertices: A(2,1), B(6,3), C(4,7)',
          'Use formula: Area = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|',
          'Substitute: Area = ½|2(3-7) + 6(7-1) + 4(1-3)|',
          'Simplify: Area = ½|2(-4) + 6(6) + 4(-2)|',
          'Calculate: Area = ½|-8 + 36 - 8|',
          'Area = ½|20| = 10'
        ],
        finalAnswer: 'Area = 10 square units',
        explanation: 'We used the coordinate formula for the area of a triangle. This formula works by calculating the area using the cross product of vectors formed by the vertices.'
      },
      correctAnswer: '10 square units',
      commonMistakes: ['Sign errors in calculation', 'Forgetting absolute value', 'Coordinate substitution errors']
    }
  ];

  const currentMath = mathProblems[currentProblem];

  const handleEvaluation = (aspect: string, value: any) => {
    setEvaluations(prev => ({
      ...prev,
      [`${currentMath.id}-${aspect}`]: value
    }));
  };

  const handleFeedback = (text: string) => {
    setFeedback(prev => ({
      ...prev,
      [currentMath.id]: text
    }));
  };

  const completeCurrentProblem = () => {
    setCompletedProblems(prev => [...prev, currentMath.id]);
    if (currentProblem < mathProblems.length - 1) {
      setCurrentProblem(currentProblem + 1);
    } else {
      // All problems completed
      const submissionData = {
        completedProblems: completedProblems.length + 1,
        evaluations,
        feedback,
        totalProblems: mathProblems.length,
        accuracy: Object.keys(evaluations).filter(k => k.includes('correct_answer') && evaluations[k] === true).length
      };
      onComplete('quantum-math-solver', submissionData);
    }
  };

  const isCurrentCompleted = () => {
    const requiredEvals = ['correct_answer', 'step_clarity', 'pedagogical_value'];
    return requiredEvals.every(aspect => 
      evaluations[`${currentMath.id}-${aspect}`] !== undefined
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quantum Math Solver B2</h1>
              <p className="text-gray-600">Evaluate mathematical reasoning AI for accuracy and pedagogical value</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <Calculator className="w-4 h-4 mr-1" />
              Mathematics
            </Badge>
            <Badge variant="secondary">
              Problem {currentProblem + 1} of {mathProblems.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedProblems.length}/{mathProblems.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedProblems.length / mathProblems.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {currentMath.type} - {currentMath.difficulty}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium text-gray-900 mb-4">
                  {currentMath.problem}
                </div>
              </CardContent>
            </Card>

            {/* AI Solution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Solution Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentMath.aiSolution.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800 mb-2">Final Answer:</div>
                  <div className="font-mono text-lg text-green-900">{currentMath.aiSolution.finalAnswer}</div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800 mb-2">Explanation:</div>
                  <div className="text-blue-900">{currentMath.aiSolution.explanation}</div>
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Common Mistakes to Watch For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentMath.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Evaluation Panel */}
          <div className="space-y-6">
            {/* Evaluation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluate Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Correctness Check */}
                <div>
                  <div className="font-medium text-sm mb-2">Is the final answer correct?</div>
                  <div className="text-xs text-gray-600 mb-3">Correct answer: {currentMath.correctAnswer}</div>
                  <div className="flex gap-2">
                    <Button
                      variant={evaluations[`${currentMath.id}-correct_answer`] === true ? "default" : "outline"}
                      onClick={() => handleEvaluation('correct_answer', true)}
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Correct
                    </Button>
                    <Button
                      variant={evaluations[`${currentMath.id}-correct_answer`] === false ? "destructive" : "outline"}
                      onClick={() => handleEvaluation('correct_answer', false)}
                      size="sm"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Incorrect
                    </Button>
                  </div>
                </div>

                {/* Step Clarity */}
                <div>
                  <div className="font-medium text-sm mb-2">Step-by-step clarity (1-5)</div>
                  <div className="text-xs text-gray-600 mb-3">Are the steps logical and easy to follow?</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleEvaluation('step_clarity', rating)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          evaluations[`${currentMath.id}-step_clarity`] === rating
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pedagogical Value */}
                <div>
                  <div className="font-medium text-sm mb-2">Educational value (1-5)</div>
                  <div className="text-xs text-gray-600 mb-3">Would this help a student learn the concept?</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleEvaluation('pedagogical_value', rating)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          evaluations[`${currentMath.id}-pedagogical_value`] === rating
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="text-sm font-medium block mb-2">Detailed Feedback</label>
                  <Textarea
                    placeholder="Provide specific feedback about the solution quality, missing steps, or improvements..."
                    value={feedback[currentMath.id] || ''}
                    onChange={(e) => handleFeedback(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={completeCurrentProblem}
                  disabled={!isCurrentCompleted()}
                  className="w-full"
                >
                  {currentProblem === mathProblems.length - 1 ? 'Complete Evaluation' : 'Next Problem'}
                </Button>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            {completedProblems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {completedProblems.map((problemId) => {
                      const problem = mathProblems.find(p => p.id === problemId);
                      return (
                        <div key={problemId} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{problem?.type}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}