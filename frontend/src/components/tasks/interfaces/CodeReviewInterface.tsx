'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  Code, Bug, AlertTriangle, Lightbulb, Shield, CheckCircle,
  XCircle, MessageSquare, ChevronDown, ChevronUp, Copy,
  FileCode, GitBranch, Clock, User, AlertCircle, Plus,
  ThumbsUp, ThumbsDown, Send, Trash2, Edit3, Eye,
  Hash, ChevronRight
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Progress } from '../../ui/progress';
import { toast } from 'sonner';

interface ReviewComment {
  id: string;
  lineNumber: number;
  type: 'bug' | 'improvement' | 'security' | 'style' | 'question';
  severity: 'critical' | 'major' | 'minor' | 'info';
  comment: string;
  suggestion?: string;
  resolved: boolean;
  createdAt: string;
}

interface CodeReviewInterfaceProps {
  task: any;
  onReviewChange: (review: any) => void;
  onComplete: (data: any) => void;
}

// Sample code snippets for different languages
const SAMPLE_CODE: Record<string, { language: string; code: string; filename: string }> = {
  python: {
    language: 'python',
    filename: 'data_processor.py',
    code: `import pandas as pd
import numpy as np
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class DataProcessor:
    """Process and validate incoming data streams."""
    
    def __init__(self, config: Dict):
        self.config = config
        self.cache = {}
        self.batch_size = config.get('batch_size', 1000)
    
    def process_batch(self, data: List[Dict]) -> List[Dict]:
        """Process a batch of records."""
        results = []
        
        for record in data:
            # TODO: Add proper error handling
            processed = self._transform(record)
            if processed:
                results.append(processed)
        
        return results
    
    def _transform(self, record: Dict) -> Optional[Dict]:
        """Transform a single record."""
        try:
            # Extract and validate fields
            user_id = record['user_id']
            timestamp = record['timestamp']
            value = float(record['value'])
            
            # Apply transformations
            normalized_value = (value - self.config['min']) / (self.config['max'] - self.config['min'])
            
            return {
                'user_id': user_id,
                'timestamp': timestamp,
                'value': normalized_value,
                'processed_at': pd.Timestamp.now().isoformat()
            }
        except KeyError as e:
            logger.error(f"Missing key: {e}")
            return None
        except Exception as e:
            logger.error(f"Processing error: {e}")
            return None
    
    def validate_data(self, data: List[Dict]) -> bool:
        """Validate data before processing."""
        if not data:
            return False
        
        required_fields = ['user_id', 'timestamp', 'value']
        for record in data:
            for field in required_fields:
                if field not in record:
                    return False
        
        return True
    
    def clear_cache(self):
        """Clear the internal cache."""
        self.cache = {}
        logger.info("Cache cleared")
`
  },
  javascript: {
    language: 'javascript',
    filename: 'api-handler.js',
    code: `const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// User authentication endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user in database
    const user = await db.users.findOne({ email: email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isValid = bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token: token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { router, authMiddleware };
`
  },
  typescript: {
    language: 'typescript',
    filename: 'user-service.ts',
    code: `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 10);
    
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }
}
`
  }
};

const COMMENT_TYPES = [
  { id: 'bug', label: 'Bug', icon: Bug, color: 'text-red-600 bg-red-50' },
  { id: 'security', label: 'Security', icon: Shield, color: 'text-orange-600 bg-orange-50' },
  { id: 'improvement', label: 'Improvement', icon: Lightbulb, color: 'text-blue-600 bg-blue-50' },
  { id: 'style', label: 'Style', icon: Code, color: 'text-purple-600 bg-purple-50' },
  { id: 'question', label: 'Question', icon: MessageSquare, color: 'text-gray-600 bg-gray-50' },
] as const;

const SEVERITY_LEVELS = [
  { id: 'critical', label: 'Critical', color: 'bg-red-500' },
  { id: 'major', label: 'Major', color: 'bg-orange-500' },
  { id: 'minor', label: 'Minor', color: 'bg-yellow-500' },
  { id: 'info', label: 'Info', color: 'bg-blue-500' },
] as const;

export function CodeReviewInterface({ task, onReviewChange, onComplete }: CodeReviewInterfaceProps) {
  // Get code from task or use sample
  const getCodeData = useCallback(() => {
    if (task?.taskData?.code) {
      return {
        language: task.taskData.language || 'javascript',
        filename: task.taskData.filename || 'code.js',
        code: task.taskData.code
      };
    }
    const lang = task?.taskData?.language || 'typescript';
    return SAMPLE_CODE[lang] || SAMPLE_CODE.typescript;
  }, [task]);

  const codeData = getCodeData();
  const codeLines = useMemo(() => codeData.code.split('\n'), [codeData.code]);

  // State
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState({
    type: 'bug' as ReviewComment['type'],
    severity: 'minor' as ReviewComment['severity'],
    comment: '',
    suggestion: ''
  });
  const [overallRating, setOverallRating] = useState<'approve' | 'request_changes' | 'comment' | null>(null);
  const [summary, setSummary] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Add comment
  const handleAddComment = () => {
    if (!selectedLine || !newComment.comment.trim()) {
      toast.error('Please select a line and add a comment');
      return;
    }

    const comment: ReviewComment = {
      id: `comment-${Date.now()}`,
      lineNumber: selectedLine,
      type: newComment.type,
      severity: newComment.severity,
      comment: newComment.comment,
      suggestion: newComment.suggestion || undefined,
      resolved: false,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...comments, comment].sort((a, b) => a.lineNumber - b.lineNumber);
    setComments(updatedComments);
    onReviewChange({ comments: updatedComments, summary, rating: overallRating });
    
    setNewComment({ type: 'bug', severity: 'minor', comment: '', suggestion: '' });
    setShowAddComment(false);
    setSelectedLine(null);
    toast.success('Comment added');
  };

  // Delete comment
  const handleDeleteComment = (id: string) => {
    const updatedComments = comments.filter(c => c.id !== id);
    setComments(updatedComments);
    onReviewChange({ comments: updatedComments, summary, rating: overallRating });
    toast.success('Comment deleted');
  };

  // Toggle comment resolved
  const toggleResolved = (id: string) => {
    const updatedComments = comments.map(c =>
      c.id === id ? { ...c, resolved: !c.resolved } : c
    );
    setComments(updatedComments);
    onReviewChange({ comments: updatedComments, summary, rating: overallRating });
  };

  // Complete review
  const handleComplete = () => {
    if (!overallRating) {
      toast.error('Please select an overall rating');
      return;
    }
    if (!summary.trim()) {
      toast.error('Please add a review summary');
      return;
    }

    onComplete({
      comments,
      summary,
      rating: overallRating,
      codeFile: codeData.filename,
      completedAt: new Date().toISOString()
    });
  };

  // Get comments for a specific line
  const getLineComments = (lineNumber: number) => {
    return comments.filter(c => c.lineNumber === lineNumber);
  };

  // Get comment type icon and color
  const getCommentTypeInfo = (type: string) => {
    return COMMENT_TYPES.find(t => t.id === type) || COMMENT_TYPES[0];
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(codeData.code);
    toast.success('Code copied to clipboard');
  };

  // Stats
  const stats = useMemo(() => ({
    bugs: comments.filter(c => c.type === 'bug').length,
    security: comments.filter(c => c.type === 'security').length,
    improvements: comments.filter(c => c.type === 'improvement').length,
    critical: comments.filter(c => c.severity === 'critical').length,
    resolved: comments.filter(c => c.resolved).length,
  }), [comments]);

  return (
    <div className="space-y-4">
      {/* File Header */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                <span className="font-mono font-medium">{codeData.filename}</span>
              </div>
              <Badge variant="secondary">{codeData.language}</Badge>
              <Badge variant="outline">{codeLines.length} lines</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowLineNumbers(!showLineNumbers)}>
                <Hash className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code View */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <pre className="text-sm font-mono">
                  <code>
                    {codeLines.map((line: string, index: number) => {
                      const lineNumber = index + 1;
                      const lineComments = getLineComments(lineNumber);
                      const hasComments = lineComments.length > 0;
                      const isSelected = selectedLine === lineNumber;
                      
                      return (
                        <div key={index}>
                          <div
                            className={`group flex transition-colors ${
                              isSelected
                                ? 'bg-blue-100'
                                : hasComments
                                ? 'bg-yellow-50 hover:bg-yellow-100'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedLine(lineNumber)}
                          >
                            {showLineNumbers && (
                              <div className="w-12 flex-shrink-0 text-right pr-4 py-1 text-gray-400 select-none border-r bg-gray-50">
                                {lineNumber}
                              </div>
                            )}
                            <div className="flex-1 px-4 py-1 whitespace-pre">
                              {line || ' '}
                            </div>
                            {hasComments && (
                              <div className="flex-shrink-0 pr-2 py-1">
                                <Badge className="text-xs" variant="secondary">
                                  {lineComments.length}
                                </Badge>
                              </div>
                            )}
                            <div className="flex-shrink-0 pr-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLine(lineNumber);
                                  setShowAddComment(true);
                                }}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Show inline comments */}
                          {hasComments && lineComments.map(comment => {
                            const typeInfo = getCommentTypeInfo(comment.type);
                            const TypeIcon = typeInfo.icon;
                            
                            return (
                              <div key={comment.id} className={`ml-12 p-3 border-l-4 ${
                                comment.resolved ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'
                              }`}>
                                <div className="flex items-start gap-3">
                                  <div className={`p-1 rounded ${typeInfo.color}`}>
                                    <TypeIcon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant={comment.severity === 'critical' ? 'destructive' : 'outline'} className="text-xs">
                                        {comment.severity}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {comment.type}
                                      </Badge>
                                      {comment.resolved && (
                                        <Badge className="bg-green-500 text-xs">Resolved</Badge>
                                      )}
                                    </div>
                                    <p className="text-sm">{comment.comment}</p>
                                    {comment.suggestion && (
                                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono">
                                        <span className="text-gray-500">Suggestion:</span> {comment.suggestion}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleResolved(comment.id)}
                                      >
                                        {comment.resolved ? (
                                          <>
                                            <XCircle className="w-3 h-3 mr-1" /> Reopen
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle className="w-3 h-3 mr-1" /> Resolve
                                          </>
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteComment(comment.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="space-y-4">
          {/* Add Comment Form */}
          {showAddComment && selectedLine && (
            <Card className="border-blue-300 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Add Comment - Line {selectedLine}</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddComment(false)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Type Selection */}
                <div>
                  <label className="text-xs font-medium text-gray-700">Type</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {COMMENT_TYPES.map(type => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant={newComment.type === type.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewComment({ ...newComment, type: type.id as ReviewComment['type'] })}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Severity Selection */}
                <div>
                  <label className="text-xs font-medium text-gray-700">Severity</label>
                  <div className="flex gap-1 mt-1">
                    {SEVERITY_LEVELS.map(severity => (
                      <Button
                        key={severity.id}
                        variant={newComment.severity === severity.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewComment({ ...newComment, severity: severity.id as ReviewComment['severity'] })}
                      >
                        <span className={`w-2 h-2 rounded-full ${severity.color} mr-1`} />
                        {severity.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <div>
                  <label className="text-xs font-medium text-gray-700">Comment</label>
                  <Textarea
                    value={newComment.comment}
                    onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                    placeholder="Describe the issue or suggestion..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Suggestion */}
                <div>
                  <label className="text-xs font-medium text-gray-700">Suggestion (optional)</label>
                  <Textarea
                    value={newComment.suggestion}
                    onChange={(e) => setNewComment({ ...newComment, suggestion: e.target.value })}
                    placeholder="Suggested fix or improvement..."
                    className="mt-1 font-mono text-sm"
                    rows={2}
                  />
                </div>

                <Button className="w-full" onClick={handleAddComment}>
                  <Send className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Review Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Review Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{stats.bugs}</div>
                  <div className="text-xs text-gray-500">Bugs</div>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{stats.security}</div>
                  <div className="text-xs text-gray-500">Security</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{stats.improvements}</div>
                  <div className="text-xs text-gray-500">Improve</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Critical Issues</span>
                <Badge variant={stats.critical > 0 ? 'destructive' : 'secondary'}>
                  {stats.critical}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Resolved</span>
                <span className="text-green-600">{stats.resolved}/{comments.length}</span>
              </div>

              {comments.length > 0 && (
                <Progress value={(stats.resolved / comments.length) * 100} />
              )}
            </CardContent>
          </Card>

          {/* Overall Rating */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Overall Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Button
                  variant={overallRating === 'approve' ? 'default' : 'outline'}
                  className={`w-full justify-start ${overallRating === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setOverallRating('approve')}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant={overallRating === 'request_changes' ? 'default' : 'outline'}
                  className={`w-full justify-start ${overallRating === 'request_changes' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setOverallRating('request_changes')}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Request Changes
                </Button>
                <Button
                  variant={overallRating === 'comment' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setOverallRating('comment')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comment Only
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Review Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  onReviewChange({ comments, summary: e.target.value, rating: overallRating });
                }}
                placeholder="Write an overall review summary..."
                rows={4}
              />

              <Button
                className="w-full"
                onClick={handleComplete}
                disabled={!overallRating || !summary.trim()}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
