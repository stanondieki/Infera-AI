import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, DollarSign, FileText, Image } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DataAnnotationWorkspace } from './DataAnnotationWorkspace';

interface TaskWorkInterfaceProps {
  task: {
    _id: string;
    title: string;
    description: string;
    instructions: string;
    type: string;
    category: string;
    categories?: string[];
    hourlyRate: number;
    estimatedHours: number;
    sampleData?: string;
    datasetUrl?: string;
  };
  onBack: () => void;
}

export function TaskWorkInterface({ task, onBack }: TaskWorkInterfaceProps) {
  const [showWorkspace, setShowWorkspace] = useState(false);

  if (showWorkspace) {
    return (
      <DataAnnotationWorkspace
        taskId={task._id}
        task={{
          title: task.title,
          instructions: task.instructions,
          categories: task.categories || ['pizza', 'burger', 'salad', 'pasta', 'seafood', 'dessert', 'soup', 'sandwich', 'meat', 'vegetarian', 'other'],
          sampleData: task.sampleData,
          datasetUrl: task.datasetUrl
        }}
        onBack={() => setShowWorkspace(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              {task.type.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <DollarSign size={16} />
              <span>${task.hourlyRate}/hour</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>{task.estimatedHours} hours estimated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image size={16} />
              <span>8 sample images</span>
            </div>
          </div>
        </div>

        {/* Task Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <FileText size={20} />
              <span>Task Description</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          {/* What You'll Do */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">What You'll Do</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>View food images one by one</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Classify each image into the correct food category</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Set confidence level for your classification</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Add notes for edge cases or special observations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Export your annotations when complete</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Step-by-Step Instructions</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="space-y-2 text-sm text-gray-700">
              {task.instructions.split('\n').map((instruction, index) => (
                <p key={index} className="flex items-start space-x-2">
                  <span className="font-medium text-blue-600 flex-shrink-0 w-6">{index + 1}.</span>
                  <span>{instruction.replace(/^\d+\.\s*/, '')}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Food Categories Available</h3>
          <div className="flex flex-wrap gap-2">
            {(task.categories || ['pizza', 'burger', 'salad', 'pasta', 'seafood', 'dessert', 'soup', 'sandwich', 'meat', 'vegetarian', 'other']).map(category => (
              <Badge key={category} variant="outline" className="px-3 py-1">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sample Images Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Sample Images You'll Work With</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Image size={24} className="mx-auto mb-2" />
                <p className="text-xs">Pizza Images</p>
              </div>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Image size={24} className="mx-auto mb-2" />
                <p className="text-xs">Burger Images</p>
              </div>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Image size={24} className="mx-auto mb-2" />
                <p className="text-xs">Salad Images</p>
              </div>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Image size={24} className="mx-auto mb-2" />
                <p className="text-xs">More Food Types</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            You'll work with high-quality food images from restaurant menus and food photography.
          </p>
        </div>

        {/* Start Working */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Start Annotating?</h3>
          <p className="mb-4 opacity-90">
            Click below to open the annotation workspace with all the tools you need.
          </p>
          <Button 
            onClick={() => setShowWorkspace(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold"
          >
            <Play size={20} className="mr-2" />
            Start Data Annotation Work
          </Button>
        </div>
      </div>
    </div>
  );
}