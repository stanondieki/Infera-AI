import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Save, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  Star,
  Target,
  FileText,
  Lightbulb,
  Brain,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import TaskApp from '../tasks/TaskApp';

interface WorkData {
  answers: Record<string, any>;
  outputText: string;
  confidence: number;
  submissionNotes: string;
  additionalData: Record<string, any>;
}

interface TaskWorkingInterfaceProps {
  task: any;
  onSubmit: (submissionData: any) => void;
  onSave: (draftData: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function TaskWorkingInterface({ task, onSubmit, onSave, onClose, isOpen }: TaskWorkingInterfaceProps) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [workData, setWorkData] = useState<WorkData>({
    answers: {},
    outputText: '',
    confidence: 0,
    submissionNotes: '',
    additionalData: {}
  });
  const [currentTab, setCurrentTab] = useState('instructions');

  useEffect(() => {
    if (isOpen && !startTime) {
      setStartTime(new Date());
      setIsWorking(true);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60); // minutes
        setTimeSpent(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking, startTime]);

  const handleSaveDraft = () => {
    const draftData = {
      ...workData,
      timeSpent,
      lastSaved: new Date()
    };
    onSave(draftData);
    toast.success('Draft saved successfully');
  };

  const handleSubmit = () => {
    if (!workData.outputText && !workData.answers) {
      toast.error('Please provide your work output before submitting');
      return;
    }

    const submissionData = {
      ...workData,
      timeSpent,
      submittedAt: new Date(),
      confidence: workData.confidence || 80
    };

    onSubmit(submissionData);
    setIsWorking(false);
    toast.success('Task submitted successfully!');
    onClose();
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const getCategoryIcon = () => {
    if (!task.taskData) return <FileText className="w-5 h-5" />;
    
    switch (task.taskData.category) {
      case 'computer_vision': return <Eye className="w-5 h-5" />;
      case 'natural_language': return <FileText className="w-5 h-5" />;
      case 'generative_ai': return <Brain className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const renderTaskContent = () => {
    // Generate realistic content based on task title and company
    if (task.title?.includes('Tesla Autopilot')) {
      return (
        <div className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              🚗 Tesla Autopilot Training - Traffic Light Recognition
            </h4>
            <p className="text-red-800 mb-4">Analyze the intersection image below and identify all traffic lights with their current status. Your accuracy is critical for autonomous vehicle safety.</p>
            
            <div className="bg-white p-4 rounded border shadow-sm">
              <div className="bg-gray-200 h-48 rounded flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚦</div>
                  <p className="text-gray-600 font-medium">Live Traffic Camera Feed</p>
                  <p className="text-sm text-gray-500">Intersection_Main_St_5th_Ave.jpg</p>
                  <p className="text-xs text-gray-400 mt-2">Timestamp: 2025-11-25 14:32:15 PST</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h6 className="font-medium text-gray-800 mb-2">Traffic Light A (North-South)</h6>
                  <select 
                    className="w-full p-2 border rounded bg-white"
                    value={workData.answers.lightA || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, lightA: e.target.value }
                    }))}
                  >
                    <option value="">Select Status</option>
                    <option value="red_solid">🔴 Red (Solid)</option>
                    <option value="yellow_solid">🟡 Yellow (Solid)</option>
                    <option value="green_solid">🟢 Green (Solid)</option>
                    <option value="red_arrow_left">🔴 Red Left Arrow</option>
                    <option value="green_arrow_left">🟢 Green Left Arrow</option>
                    <option value="flashing_yellow">🟡 Flashing Yellow</option>
                    <option value="off_malfunctioning">⚫ Off/Malfunctioning</option>
                  </select>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <h6 className="font-medium text-gray-800 mb-2">Confidence Level</h6>
                  <select 
                    className="w-full p-2 border rounded bg-white"
                    value={workData.answers.confidenceA || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, confidenceA: e.target.value }
                    }))}
                  >
                    <option value="">Select Confidence</option>
                    <option value="very_high">Very High (95-100%) - Clear visibility</option>
                    <option value="high">High (85-94%) - Good visibility</option>
                    <option value="medium">Medium (70-84%) - Partial obstruction</option>
                    <option value="low">Low (50-69%) - Poor visibility</option>
                    <option value="uncertain">Uncertain (under 50%) - Cannot determine</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <Label className="text-sm font-medium text-gray-700">Safety Assessment & Edge Cases</Label>
                <Textarea
                  placeholder="Describe any safety concerns, obstructions, weather conditions, or edge cases that might affect autonomous vehicle decision-making..."
                  value={workData.outputText}
                  onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, outputText: e.target.value }))}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (task.title?.includes('Google Search Quality')) {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              🏥 Google Health Search Quality - YMYL Evaluation
            </h4>
            <p className="text-blue-800 mb-4">Evaluate medical search results for accuracy, authority, and potential patient harm. This is a Your Money Your Life (YMYL) assessment.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="border-b pb-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">Search Query:</span>
              </div>
              <h5 className="text-lg font-medium text-gray-900">"chest pain shortness breath should I go hospital"</h5>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 bg-green-50 pl-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <h6 className="font-semibold text-green-900">Result #1: Mayo Clinic</h6>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Featured Snippet</span>
                </div>
                <p className="text-gray-800 mb-3">
                  "Chest pain with shortness of breath can indicate a heart attack or other serious conditions. 
                  <strong> Seek immediate emergency care if you experience: crushing chest pain, pain radiating to arm/jaw, 
                  cold sweats, nausea, or severe shortness of breath. Call 911 immediately.</strong> 
                  Do not drive yourself to the hospital."
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-700">✓ mayoclinic.org/diseases-conditions/chest-pain</span>
                  <span className="text-green-600">Medical Review: Dr. Sarah Johnson, MD</span>
                  <span className="text-green-600">Updated: Nov 2025</span>
                </div>
              </div>
              
              <div className="border-l-4 border-yellow-400 bg-yellow-50 pl-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <h6 className="font-semibold text-yellow-900">Result #2: WebMD</h6>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Standard Result</span>
                </div>
                <p className="text-gray-800 mb-3">
                  "Chest pain and breathing problems can have many causes including anxiety, muscle strain, 
                  or heart conditions. While chest pain can be serious, many cases are not life-threatening. 
                  Consider seeing a doctor if symptoms persist or worsen."
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-yellow-700">webmd.com/heart-disease/chest-pain-causes</span>
                  <span className="text-yellow-600">Last Updated: Sep 2025</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">Mayo Clinic Result Assessment</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Medical Accuracy (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.accuracy1 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, accuracy1: e.target.value }
                    }))}
                  >
                    <option value="">Rate Accuracy</option>
                    <option value="5">5 - Completely Accurate & Evidence-Based</option>
                    <option value="4">4 - Mostly Accurate, Minor Issues</option>
                    <option value="3">3 - Somewhat Accurate, Some Concerns</option>
                    <option value="2">2 - Mostly Inaccurate, Major Issues</option>
                    <option value="1">1 - Completely Inaccurate/Dangerous</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Source Authority (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.authority1 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, authority1: e.target.value }
                    }))}
                  >
                    <option value="">Rate Authority</option>
                    <option value="5">5 - Highest Medical Authority (Mayo, Hopkins)</option>
                    <option value="4">4 - High Authority (Medical Institutions)</option>
                    <option value="3">3 - Moderate Authority (Health Websites)</option>
                    <option value="2">2 - Low Authority (General Sites)</option>
                    <option value="1">1 - No Medical Authority</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">WebMD Result Assessment</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Potential Patient Harm (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.harm2 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, harm2: e.target.value }
                    }))}
                  >
                    <option value="">Rate Harm Risk</option>
                    <option value="5">5 - High Risk (Delays Emergency Care)</option>
                    <option value="4">4 - Moderate-High Risk</option>
                    <option value="3">3 - Moderate Risk</option>
                    <option value="2">2 - Low Risk</option>
                    <option value="1">1 - No Risk of Harm</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Overall Recommendation</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.recommendation || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, recommendation: e.target.value }
                    }))}
                  >
                    <option value="">Select Recommendation</option>
                    <option value="promote">Promote - Excellent medical advice</option>
                    <option value="neutral">Neutral - Acceptable with caveats</option>
                    <option value="demote">Demote - Potentially harmful advice</option>
                    <option value="remove">Remove - Dangerous misinformation</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">YMYL Quality Assessment & Justification</Label>
            <Textarea
              placeholder="Provide detailed justification for your ratings. Consider: medical accuracy, source credibility, potential patient outcomes, emergency guidance appropriateness..."
              value={workData.outputText}
              onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, outputText: e.target.value }))}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      );
    }
    
    if (task.title?.includes('Amazon Alexa')) {
      return (
        <div className="space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              🎤 Amazon Alexa Training - Voice Intent Recognition
            </h4>
            <p className="text-orange-800 mb-4">Evaluate Alexa's understanding and response to voice commands across different accents and contexts.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h6 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    🔊 Voice Input Analysis
                  </h6>
                  <div className="bg-gray-50 p-4 rounded border">
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">User Profile</span>
                      <p className="text-sm"><strong>Age:</strong> 34 | <strong>Accent:</strong> British English | <strong>Context:</strong> Kitchen</p>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Original Audio Transcript</span>
                      <p className="italic text-gray-800 bg-white p-2 rounded border mt-1">
                        "Alexa, could you please set a timer for twenty-five minutes for my roast chicken, and also play some classical music at medium volume"
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Alexa's Interpretation</span>
                      <p className="text-blue-800 bg-blue-50 p-2 rounded border mt-1">
                        Intent: SET_TIMER + PLAY_MUSIC | Duration: 25min | Item: roast chicken | Music: classical | Volume: medium
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h6 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    🤖 Alexa's Response
                  </h6>
                  <div className="bg-blue-50 p-4 rounded border">
                    <div className="mb-3">
                      <span className="text-xs text-blue-600 uppercase tracking-wide">Spoken Response</span>
                      <p className="text-blue-900 bg-white p-2 rounded border mt-1">
                        "I've set a timer for 25 minutes for your roast chicken. Now playing classical music from Amazon Music at medium volume."
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-600 uppercase tracking-wide">Actions Performed</span>
                      <ul className="text-sm text-blue-800 bg-white p-2 rounded border mt-1 list-disc pl-4">
                        <li>✅ Timer set: 25:00 (labeled "roast chicken")</li>
                        <li>✅ Music started: Classical playlist</li>
                        <li>✅ Volume adjusted: Level 5/10</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h6 className="font-medium text-gray-900 mb-4">Performance Evaluation</h6>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Intent Recognition (1-10)</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={workData.answers.intentScore || ''}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, intentScore: e.target.value }
                      }))}
                    >
                      <option value="">Rate Understanding</option>
                      <option value="10">10 - Perfect (100% accurate)</option>
                      <option value="9">9 - Excellent (90-99%)</option>
                      <option value="8">8 - Very Good (80-89%)</option>
                      <option value="7">7 - Good (70-79%)</option>
                      <option value="6">6 - Adequate (60-69%)</option>
                      <option value="5">5 - Partial (50-59%)</option>
                      <option value="4">4 - Poor (40-49%)</option>
                      <option value="3">3 - Very Poor (30-39%)</option>
                      <option value="2">2 - Minimal (20-29%)</option>
                      <option value="1">1 - Failed (0-19%)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Response Quality (1-10)</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={workData.answers.responseScore || ''}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, responseScore: e.target.value }
                      }))}
                    >
                      <option value="">Rate Response</option>
                      <option value="10">10 - Perfect Natural Response</option>
                      <option value="9">9 - Excellent Communication</option>
                      <option value="8">8 - Very Good</option>
                      <option value="7">7 - Good</option>
                      <option value="6">6 - Adequate</option>
                      <option value="5">5 - Acceptable</option>
                      <option value="4">4 - Poor Communication</option>
                      <option value="3">3 - Confusing Response</option>
                      <option value="2">2 - Inadequate</option>
                      <option value="1">1 - Completely Wrong</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Accent Handling (1-10)</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={workData.answers.accentScore || ''}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, accentScore: e.target.value }
                      }))}
                    >
                      <option value="">Rate Accent Processing</option>
                      <option value="10">10 - Flawless Accent Recognition</option>
                      <option value="9">9 - Excellent</option>
                      <option value="8">8 - Very Good</option>
                      <option value="7">7 - Good</option>
                      <option value="6">6 - Minor Issues</option>
                      <option value="5">5 - Some Difficulty</option>
                      <option value="4">4 - Noticeable Problems</option>
                      <option value="3">3 - Significant Issues</option>
                      <option value="2">2 - Major Problems</option>
                      <option value="1">1 - Failed to Understand Accent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Detailed Analysis & Improvement Suggestions</Label>
            <Textarea
              placeholder="Provide detailed analysis of Alexa's performance. Include: accuracy of intent recognition, naturalness of response, handling of British accent, multi-task processing, and specific suggestions for improvement..."
              value={workData.outputText}
              onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, outputText: e.target.value }))}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      );
    }
    
    if (task.title?.includes('Meta') || task.title?.includes('Instagram')) {
      return (
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              📱 Meta Content Moderation - Instagram Safety Review
            </h4>
            <p className="text-purple-800 mb-4">Review Instagram posts for community guideline violations. Your decisions help protect millions of users.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  FT
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h6 className="font-semibold text-gray-900">@fitnesstrainer_mike</h6>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Verified</span>
                    <span className="text-gray-500 text-sm">• 2.3M followers</span>
                  </div>
                  <p className="text-gray-800 mb-3 leading-relaxed">
                    🔥 LOSE 30 LBS in 30 DAYS! 🔥<br/>
                    This MIRACLE supplement burns fat while you sleep! No diet or exercise needed! 
                    Doctors HATE this one simple trick! 💊✨<br/><br/>
                    
                    ⚡ Results GUARANTEED or money back!<br/>
                    💯 FDA approved (NOT true - no FDA approval)<br/>
                    🎯 Celebrity endorsed by Kim K!<br/><br/>
                    
                    DM me "MIRACLE" for 50% off! Limited time offer! ⏰<br/>
                    Link in bio 👆 #weightloss #miracle #supplement #fatburner
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>❤️ 15,420 likes</span>
                    <span>💬 892 comments</span>
                    <span>📤 1,203 shares</span>
                    <span>⏰ Posted 3 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <h6 className="font-medium text-gray-800 mb-2">⚠️ Flagged by Automated Systems</h6>
                <div className="text-sm text-gray-700">
                  <p><strong>Detected Issues:</strong> Medical misinformation, False health claims, Deceptive advertising</p>
                  <p><strong>Risk Level:</strong> High - Health-related false claims</p>
                  <p><strong>User Reports:</strong> 47 users reported this post</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">Content Violation Assessment</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Primary Violation Type</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.violationType || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, violationType: e.target.value }
                    }))}
                  >
                    <option value="">Select Primary Violation</option>
                    <option value="medical_misinformation">Medical Misinformation</option>
                    <option value="false_advertising">False Advertising Claims</option>
                    <option value="deceptive_practices">Deceptive Business Practices</option>
                    <option value="health_scam">Health/Weight Loss Scam</option>
                    <option value="no_violation">No Violation</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Severity Level (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.severity || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, severity: e.target.value }
                    }))}
                  >
                    <option value="">Rate Severity</option>
                    <option value="5">5 - Severe (Immediate harm risk)</option>
                    <option value="4">4 - High (Significant harm potential)</option>
                    <option value="3">3 - Moderate (Misleading content)</option>
                    <option value="2">2 - Minor (Borderline violation)</option>
                    <option value="1">1 - Minimal (Low concern)</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Confidence in Assessment</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.confidence || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, confidence: e.target.value }
                    }))}
                  >
                    <option value="">Select Confidence</option>
                    <option value="very_high">Very High (95-100%)</option>
                    <option value="high">High (85-94%)</option>
                    <option value="medium">Medium (70-84%)</option>
                    <option value="low">Low (50-69%)</option>
                    <option value="uncertain">Uncertain (under 50%)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">Recommended Action</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Moderation Decision</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.action || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, action: e.target.value }
                    }))}
                  >
                    <option value="">Select Action</option>
                    <option value="remove_immediately">Remove Post Immediately</option>
                    <option value="remove_with_strike">Remove + Community Guidelines Strike</option>
                    <option value="restrict_reach">Restrict Reach & Add Warning</option>
                    <option value="add_warning_label">Add Health Information Warning</option>
                    <option value="shadow_ban">Reduce Distribution (Shadow Ban)</option>
                    <option value="escalate_review">Escalate to Senior Moderator</option>
                    <option value="no_action">No Action Required</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Account-Level Action</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.accountAction || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, accountAction: e.target.value }
                    }))}
                  >
                    <option value="">Select Account Action</option>
                    <option value="temporary_restriction">Temporary Posting Restriction</option>
                    <option value="warning_message">Send Warning Message</option>
                    <option value="require_verification">Require Business Verification</option>
                    <option value="demonetize">Remove Monetization Privileges</option>
                    <option value="flag_for_investigation">Flag for Investigation Team</option>
                    <option value="no_account_action">No Account Action</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Repeat Offense Risk</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.repeatRisk || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, repeatRisk: e.target.value }
                    }))}
                  >
                    <option value="">Assess Repeat Risk</option>
                    <option value="very_high">Very High - Systematic violator</option>
                    <option value="high">High - Pattern of violations</option>
                    <option value="medium">Medium - Some prior issues</option>
                    <option value="low">Low - Isolated incident</option>
                    <option value="first_offense">First Offense</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Detailed Moderation Justification</Label>
            <Textarea
              placeholder="Provide detailed reasoning for your moderation decision. Include: specific policy violations, potential user harm, precedent considerations, and rationale for chosen actions..."
              value={workData.outputText}
              onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, outputText: e.target.value }))}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      );
    }

    if (task.title?.includes('Apple Siri')) {
      return (
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              🍎 Apple Siri Enhancement - Voice Command Accuracy
            </h4>
            <p className="text-purple-800 mb-4">Evaluate Siri voice command responses for accuracy and naturalness. Your assessments help improve Siri's understanding of natural language.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="border-b pb-3 mb-4">
              <h5 className="text-lg font-medium text-gray-900 mb-2">Voice Command Test Scenario</h5>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">🎤 User said: "Hey Siri, set a reminder to call mom tomorrow at 3 PM"</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-3">
                <h6 className="font-semibold text-blue-900 mb-2">Siri Response A</h6>
                <p className="text-gray-800 mb-2">
                  "I've set a reminder to call mom for tomorrow at 3:00 PM. Is there anything else I can help you with?"
                </p>
                <div className="text-sm text-blue-600">✓ Reminder created successfully</div>
              </div>
              
              <div className="border-l-4 border-orange-400 bg-orange-50 pl-4 py-3">
                <h6 className="font-semibold text-orange-900 mb-2">Siri Response B</h6>
                <p className="text-gray-800 mb-2">
                  "I can help you set a reminder. What would you like to be reminded about?"
                </p>
                <div className="text-sm text-orange-600">⚠️ Did not process the full command</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">Response A Evaluation</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Command Understanding (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.understanding1 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, understanding1: e.target.value }
                    }))}
                  >
                    <option value="">Rate Understanding</option>
                    <option value="5">5 - Perfect: Understood everything correctly</option>
                    <option value="4">4 - Good: Minor misunderstanding</option>
                    <option value="3">3 - Fair: Some confusion</option>
                    <option value="2">2 - Poor: Major misunderstanding</option>
                    <option value="1">1 - Failed: Completely wrong</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Response Quality (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.quality1 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, quality1: e.target.value }
                    }))}
                  >
                    <option value="">Rate Quality</option>
                    <option value="5">5 - Excellent: Natural and helpful</option>
                    <option value="4">4 - Good: Clear and appropriate</option>
                    <option value="3">3 - Fair: Adequate response</option>
                    <option value="2">2 - Poor: Awkward or unhelpful</option>
                    <option value="1">1 - Bad: Confusing or wrong</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">Response B Evaluation</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Command Understanding (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.understanding2 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, understanding2: e.target.value }
                    }))}
                  >
                    <option value="">Rate Understanding</option>
                    <option value="5">5 - Perfect: Understood everything correctly</option>
                    <option value="4">4 - Good: Minor misunderstanding</option>
                    <option value="3">3 - Fair: Some confusion</option>
                    <option value="2">2 - Poor: Major misunderstanding</option>
                    <option value="1">1 - Failed: Completely wrong</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Response Quality (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.quality2 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, quality2: e.target.value }
                    }))}
                  >
                    <option value="">Rate Quality</option>
                    <option value="5">5 - Excellent: Natural and helpful</option>
                    <option value="4">4 - Good: Clear and appropriate</option>
                    <option value="3">3 - Fair: Adequate response</option>
                    <option value="2">2 - Poor: Awkward or unhelpful</option>
                    <option value="1">1 - Bad: Confusing or wrong</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Professional Assessment Notes</Label>
            <Textarea
              placeholder="Explain which response is better and why. Consider accuracy, naturalness, completeness, and user experience..."
              value={workData.submissionNotes}
              onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, submissionNotes: e.target.value }))}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      );
    }

    if (task.title?.includes('OpenAI GPT') || task.title?.includes('Code Explanation')) {
      return (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              🤖 OpenAI GPT-5 Training - Code Explanation Quality
            </h4>
            <p className="text-green-800 mb-4">Evaluate AI-generated code explanations for accuracy, clarity, and educational value. Your assessments help train the next generation of GPT models.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="border-b pb-3 mb-4">
              <h5 className="text-lg font-medium text-gray-900 mb-2">Code Sample for Explanation</h5>
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
{`function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}`}
              </pre>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-3">
                <h6 className="font-semibold text-blue-900 mb-2">GPT Explanation A</h6>
                <p className="text-gray-800">
                  "This is a quicksort algorithm implemented in JavaScript. It works by selecting a pivot element, 
                  then partitioning the array into elements smaller and larger than the pivot. The algorithm 
                  recursively sorts the left and right partitions, then combines them with the pivot to produce 
                  the final sorted array. The time complexity is O(n log n) on average, but O(n²) in worst case 
                  when the pivot is always the smallest or largest element."
                </p>
              </div>
              
              <div className="border-l-4 border-purple-400 bg-purple-50 pl-4 py-3">
                <h6 className="font-semibold text-purple-900 mb-2">GPT Explanation B</h6>
                <p className="text-gray-800">
                  "This function sorts numbers. It picks a middle number and puts smaller numbers on the left 
                  and bigger numbers on the right. Then it does the same thing again for each side until 
                  everything is sorted."
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">Explanation A Assessment</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Technical Accuracy (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.accuracy1 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, accuracy1: e.target.value }
                    }))}
                  >
                    <option value="">Rate Accuracy</option>
                    <option value="5">5 - Completely accurate</option>
                    <option value="4">4 - Mostly accurate</option>
                    <option value="3">3 - Some inaccuracies</option>
                    <option value="2">2 - Several errors</option>
                    <option value="1">1 - Mostly incorrect</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Educational Value (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.educational1 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, educational1: e.target.value }
                    }))}
                  >
                    <option value="">Rate Educational Value</option>
                    <option value="5">5 - Excellent learning resource</option>
                    <option value="4">4 - Good explanation</option>
                    <option value="3">3 - Adequate information</option>
                    <option value="2">2 - Limited value</option>
                    <option value="1">1 - Not helpful</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Clarity (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.clarity1 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, clarity1: e.target.value }
                    }))}
                  >
                    <option value="">Rate Clarity</option>
                    <option value="5">5 - Very clear and well-structured</option>
                    <option value="4">4 - Clear and understandable</option>
                    <option value="3">3 - Somewhat clear</option>
                    <option value="2">2 - Confusing in places</option>
                    <option value="1">1 - Very confusing</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h6 className="font-medium text-gray-800">Explanation B Assessment</h6>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Technical Accuracy (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.accuracy2 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, accuracy2: e.target.value }
                    }))}
                  >
                    <option value="">Rate Accuracy</option>
                    <option value="5">5 - Completely accurate</option>
                    <option value="4">4 - Mostly accurate</option>
                    <option value="3">3 - Some inaccuracies</option>
                    <option value="2">2 - Several errors</option>
                    <option value="1">1 - Mostly incorrect</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Educational Value (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.educational2 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, educational2: e.target.value }
                    }))}
                  >
                    <option value="">Rate Educational Value</option>
                    <option value="5">5 - Excellent learning resource</option>
                    <option value="4">4 - Good explanation</option>
                    <option value="3">3 - Adequate information</option>
                    <option value="2">2 - Limited value</option>
                    <option value="1">1 - Not helpful</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm">Clarity (1-5)</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={workData.answers.clarity2 || ''}
                    onChange={(e) => setWorkData((prev: WorkData) => ({
                      ...prev,
                      answers: { ...prev.answers, clarity2: e.target.value }
                    }))}
                  >
                    <option value="">Rate Clarity</option>
                    <option value="5">5 - Very clear and well-structured</option>
                    <option value="4">4 - Clear and understandable</option>
                    <option value="3">3 - Somewhat clear</option>
                    <option value="2">2 - Confusing in places</option>
                    <option value="1">1 - Very confusing</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Professional Analysis</Label>
            <Textarea
              placeholder="Compare both explanations. Which is better for different audiences (beginners vs experienced developers)? Explain your reasoning..."
              value={workData.submissionNotes}
              onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, submissionNotes: e.target.value }))}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      );
    }

    if (task.title?.includes('Data Annotation') || task.title?.includes('Computer Vision')) {
      return (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              👁️ Computer Vision Data Annotation - Object Detection
            </h4>
            <p className="text-indigo-800 mb-4">Accurately identify and label objects in images to train autonomous vehicle perception systems. Precision is critical for safety.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="border-b pb-3 mb-4">
              <h5 className="text-lg font-medium text-gray-900 mb-2">Street Scene Analysis</h5>
              <div className="bg-gray-200 h-64 rounded flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-6xl mb-2">🚗🚶‍♂️🚦</div>
                  <p className="text-gray-600 font-medium">Street_Scene_Downtown_IMG_4572.jpg</p>
                  <p className="text-sm text-gray-500">Resolution: 1920x1080 | Time: 14:30 | Weather: Clear</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-3">
                <h6 className="font-medium text-gray-800">Vehicles Detected</h6>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="sedan"
                      checked={workData.answers.sedan || false}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, sedan: e.target.checked }
                      }))}
                    />
                    <label htmlFor="sedan" className="text-sm">White Sedan (center-left)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="truck"
                      checked={workData.answers.truck || false}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, truck: e.target.checked }
                      }))}
                    />
                    <label htmlFor="truck" className="text-sm">Delivery Truck (background)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="motorcycle"
                      checked={workData.answers.motorcycle || false}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, motorcycle: e.target.checked }
                      }))}
                    />
                    <label htmlFor="motorcycle" className="text-sm">Red Motorcycle (right side)</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h6 className="font-medium text-gray-800">Pedestrians & Signs</h6>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="pedestrian1"
                      checked={workData.answers.crosswalk || false}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, crosswalk: e.target.checked }
                      }))}
                    />
                    <label htmlFor="pedestrian1" className="text-sm">Person in crosswalk</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="pedestrian2"
                      checked={workData.answers.sidewalk || false}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, sidewalk: e.target.checked }
                      }))}
                    />
                    <label htmlFor="pedestrian2" className="text-sm">2 People on sidewalk</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="stopsign"
                      checked={workData.answers.stopsign || false}
                      onChange={(e) => setWorkData((prev: WorkData) => ({
                        ...prev,
                        answers: { ...prev.answers, stopsign: e.target.checked }
                      }))}
                    />
                    <label htmlFor="stopsign" className="text-sm">Stop sign (partially visible)</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Risk Assessment</Label>
              <select 
                className="w-full p-2 border rounded"
                value={workData.answers.risk || ''}
                onChange={(e) => setWorkData((prev: WorkData) => ({
                  ...prev,
                  answers: { ...prev.answers, risk: e.target.value }
                }))}
              >
                <option value="">Assess Safety Risk Level</option>
                <option value="high">High Risk - Immediate hazards present</option>
                <option value="medium">Medium Risk - Potential hazards to monitor</option>
                <option value="low">Low Risk - Normal traffic conditions</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Detailed Annotation Notes</Label>
            <Textarea
              placeholder="Describe object positions, potential hazards, edge cases, and any annotations that require special attention for autonomous vehicle training..."
              value={workData.submissionNotes}
              onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, submissionNotes: e.target.value }))}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      );
    }

    // Default case for other tasks - now more professional
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            🎯 Professional AI Training Task
          </h4>
          <p className="text-gray-700 mb-4">Complete this specialized AI training task according to the detailed instructions. Your expert evaluation helps improve AI system performance across multiple domains.</p>
        </div>
        
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="border-b pb-3 mb-4">
            <h5 className="text-lg font-medium text-gray-900">Task Instructions</h5>
            <p className="text-gray-600 mt-2">{task.instructions || "Follow the detailed task guidelines provided. Ensure accuracy and thoroughness in your work."}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Professional Work Output</Label>
              <Textarea
                placeholder="Provide your detailed analysis, findings, and professional assessment. Include specific examples and reasoning where applicable..."
                value={workData.outputText}
                onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, outputText: e.target.value }))}
                className="mt-2 min-h-32"
                rows={6}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Quality Assessment</Label>
              <select 
                className="w-full p-2 border rounded mt-2"
                value={workData.answers.quality || ''}
                onChange={(e) => setWorkData((prev: WorkData) => ({
                  ...prev,
                  answers: { ...prev.answers, quality: e.target.value }
                }))}
              >
                <option value="">Rate Work Confidence</option>
                <option value="5">5 - Completely confident in assessment</option>
                <option value="4">4 - Very confident</option>
                <option value="3">3 - Moderately confident</option>
                <option value="2">2 - Somewhat uncertain</option>
                <option value="1">1 - Requires additional review</option>
              </select>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Professional Notes & Methodology</Label>
              <Textarea
                placeholder="Explain your methodology, decision-making process, challenges encountered, and any recommendations for improvement..."
                value={workData.submissionNotes}
                onChange={(e) => setWorkData((prev: WorkData) => ({ ...prev, submissionNotes: e.target.value }))}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getCategoryIcon()}
              <div>
                <DialogTitle className="text-xl">{task.title}</DialogTitle>
                <DialogDescription className="mt-1">
                  {task.taskData ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.taskData.category.replace('_', ' ')}</Badge>
                      <Badge variant="outline">{task.taskData.difficultyLevel}</Badge>
                      <span className="text-sm">Est. {task.estimatedTime || task.estimatedHours * 60}min</span>
                    </div>
                  ) : (
                    <span>Standard Task • Est. {task.estimatedHours}h</span>
                  )}
                </DialogDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="font-medium">${task.hourlyRate}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="work">Work Area</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="instructions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Task Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{task.taskData?.guidelines || task.instructions}</p>
                  </div>

                  {task.taskData?.qualityMetrics && (
                    <div>
                      <h4 className="font-medium mb-2">Quality Metrics:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {task.taskData.qualityMetrics.map((metric: string, index: number) => (
                          <li key={index} className="text-sm">{metric}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {task.qualityStandards && (
                    <div>
                      <h4 className="font-medium mb-2">Quality Standards:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {task.qualityStandards.map((standard: string, index: number) => (
                          <li key={index} className="text-sm">{standard}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Area</CardTitle>
                  <CardDescription>
                    Complete your work according to the guidelines. Save drafts frequently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTaskContent()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Examples & References
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {task.taskData?.examples && task.taskData.examples.length > 0 ? (
                    <div className="space-y-4">
                      {task.taskData.examples.map((example: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Example {index + 1}</h4>
                          {example.input && (
                            <div className="mb-2">
                              <strong>Input:</strong>
                              <pre className="bg-gray-50 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
                                {typeof example.input === 'string' ? example.input : JSON.stringify(example.input, null, 2)}
                              </pre>
                            </div>
                          )}
                          {example.expectedOutput && (
                            <div className="mb-2">
                              <strong>Expected Output:</strong>
                              <pre className="bg-gray-50 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
                                {typeof example.expectedOutput === 'string' ? example.expectedOutput : JSON.stringify(example.expectedOutput, null, 2)}
                              </pre>
                            </div>
                          )}
                          {example.explanation && (
                            <div>
                              <strong>Explanation:</strong>
                              <p className="text-sm mt-1">{example.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No examples available for this task.</p>
                      <p className="text-sm">Follow the instructions and quality guidelines.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Use the new modular task system */}
        <TaskApp
          task={task}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}