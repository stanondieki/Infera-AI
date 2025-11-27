'use client';

import React, { useState, useEffect } from 'react';

interface BackendStatus {
  status: string;
  database: string;
  email: string;
  environment: string;
  uptime: number;
}

export function DebugPanel() {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/health');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backend status');
      setStatus(null);
    }
  };

  useEffect(() => {
    // Check status on mount
    checkBackendStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm z-50 hover:bg-gray-700 transition-colors"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Backend Status</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <button
        onClick={checkBackendStatus}
        className="mb-3 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
      >
        Refresh
      </button>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          <strong>Connection Error:</strong> {error}
        </div>
      )}

      {status && (
        <div className="space-y-2 text-sm">
          <div className={`flex items-center gap-2 ${status.status === 'OK' ? 'text-green-600' : 'text-yellow-600'}`}>
            <span className={`w-2 h-2 rounded-full ${status.status === 'OK' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <strong>Overall:</strong> {status.status}
          </div>
          
          <div className={`flex items-center gap-2 ${status.database === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${status.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <strong>Database:</strong> {status.database}
          </div>
          
          <div className={`flex items-center gap-2 ${status.email === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${status.email === 'configured' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <strong>Email:</strong> {status.email}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <strong>Environment:</strong> {status.environment}
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Uptime: {Math.floor(status.uptime / 60)}m {Math.floor(status.uptime % 60)}s
          </div>
        </div>
      )}
    </div>
  );
}