/**
 * Debug Dashboard Component
 * Comprehensive debugging tools for development and troubleshooting
 * Shows Redux state, localStorage, environment variables, API config, etc.
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';
import { useLocation } from 'react-router-dom';
import {
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Database,
  HardDrive,
  Globe,
  Terminal,
  Activity,
  AlertCircle,
  Code,
} from 'lucide-react';
import { Card, Button } from '../components';
import { API_BASE_URL, WS_URL } from '../utils';

const DebugDashboard = () => {
  const location = useLocation();
  
  // Redux state
  const auth = useSelector((state: RootState) => state.auth);
  const vehicles = useSelector((state: RootState) => (state as any).vehicles || {});
  const valets = useSelector((state: RootState) => (state as any).valets || {});
  const parkingSlots = useSelector((state: RootState) => (state as any).parkingSlots || {});
  const subscriptions = useSelector((state: RootState) => (state as any).subscriptions || {});
  const invoices = useSelector((state: RootState) => (state as any).invoices || {});
  const payments = useSelector((state: RootState) => (state as any).payments || {});
  const analytics = useSelector((state: RootState) => (state as any).analytics || {});
  const notifications = useSelector((state: RootState) => state.notifications);
  const ui = useSelector((state: RootState) => state.ui);
  
  // Local state
  const [localStorageData, setLocalStorageData] = useState({});
  const [consoleErrors, setConsoleErrors] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [wsStatus, setWsStatus] = useState('checking');
  const [browserInfo, setBrowserInfo] = useState({});

  // Get localStorage data
  useEffect(() => {
    const getLocalStorage = () => {
      const storage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const value = localStorage.getItem(key);
          storage[key] = value;
        } catch (error) {
          storage[key] = `Error reading: ${error.message}`;
        }
      }
      return storage;
    };
    
    setLocalStorageData(getLocalStorage());
  }, []);

  // Get browser info
  useEffect(() => {
    setBrowserInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      vendor: navigator.vendor,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, []);

  // Capture console errors
  useEffect(() => {
    const originalError = console.error;
    const errors = [];
    
    console.error = (...args) => {
      errors.push({
        timestamp: new Date().toISOString(),
        message: args.join(' '),
      });
      setConsoleErrors([...errors].slice(-10)); // Keep last 10 errors
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // Test API connectivity
  const testApiConnection = async () => {
    setApiStatus('checking');
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
    }
  };

  // Test WebSocket connectivity
  const testWsConnection = () => {
    setWsStatus('checking');
    try {
      const ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        setWsStatus('connected');
        ws.close();
      };
      
      ws.onerror = () => {
        setWsStatus('error');
      };
      
      setTimeout(() => {
        if (wsStatus === 'checking') {
          setWsStatus('timeout');
          ws.close();
        }
      }, 5000);
    } catch (error) {
      setWsStatus('error');
    }
  };

  // Clear all localStorage
  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all localStorage? This will log you out.')) {
      localStorage.clear();
      setLocalStorageData({});
      window.location.href = '/login';
    }
  };

  // Refresh data
  const refreshData = () => {
    const getLocalStorage = () => {
      const storage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const value = localStorage.getItem(key);
          storage[key] = value;
        } catch (error) {
          storage[key] = `Error reading: ${error.message}`;
        }
      }
      return storage;
    };
    
    setLocalStorageData(getLocalStorage());
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
      case 'timeout':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'checking':
        return <Activity className="w-5 h-5 text-yellow-400 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const reduxState = {
    auth,
    vehicles,
    valets,
    parkingSlots,
    subscriptions,
    invoices,
    payments,
    analytics,
    notifications,
    ui,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Debug Dashboard</h1>
          <p className="text-white/60">Comprehensive debugging and monitoring tools</p>
        </div>
        <Button
          variant="secondary"
          onClick={refreshData}
          startIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">API Status</span>
            {getStatusIcon(apiStatus)}
          </div>
          <Button
            variant="ghost"
            size="small"
            fullWidth
            onClick={testApiConnection}
          >
            Test API
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">WebSocket Status</span>
            {getStatusIcon(wsStatus)}
          </div>
          <Button
            variant="ghost"
            size="small"
            fullWidth
            onClick={testWsConnection}
          >
            Test WebSocket
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">LocalStorage</span>
            <HardDrive className="w-5 h-5 text-blue-400" />
          </div>
          <Button
            variant="danger"
            size="small"
            fullWidth
            onClick={clearLocalStorage}
            startIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear All
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Online Status</span>
            {navigator.onLine ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className="text-white font-semibold">
            {navigator.onLine ? 'Online' : 'Offline'}
          </div>
        </Card>
      </div>

      {/* Environment & Configuration */}
      <Card
        title="Environment & Configuration"
        subtitle="Current environment variables and API configuration"
        headerAction={<Globe className="w-5 h-5 text-white/50" />}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-white/50 text-sm">API Base URL</span>
              <div className="text-white font-mono text-sm bg-white/5 p-2 rounded mt-1">
                {API_BASE_URL}
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">WebSocket URL</span>
              <div className="text-white font-mono text-sm bg-white/5 p-2 rounded mt-1">
                {WS_URL}
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Node Environment</span>
              <div className="text-white font-mono text-sm bg-white/5 p-2 rounded mt-1">
                {process.env.NODE_ENV || 'Not set'}
              </div>
            </div>
            <div>
              <span className="text-white/50 text-sm">Current Route</span>
              <div className="text-white font-mono text-sm bg-white/5 p-2 rounded mt-1">
                {location.pathname}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Browser Information */}
      <Card
        title="Browser Information"
        subtitle="Client browser and system details"
        headerAction={<Terminal className="w-5 h-5 text-white/50" />}
      >
        <div className="space-y-2">
          {Object.entries(browserInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50 text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-white font-mono text-sm">
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Redux State */}
      <Card
        title="Redux State"
        subtitle="Complete application state from Redux store"
        headerAction={<Database className="w-5 h-5 text-white/50" />}
      >
        <div className="bg-black/30 rounded-lg p-4 overflow-auto max-h-96">
          <pre className="text-xs text-white/80 font-mono">
            {JSON.stringify(reduxState, null, 2)}
          </pre>
        </div>
      </Card>

      {/* LocalStorage Contents */}
      <Card
        title="LocalStorage Contents"
        subtitle="All data stored in browser localStorage"
        headerAction={<HardDrive className="w-5 h-5 text-white/50" />}
      >
        <div className="space-y-2">
          {Object.keys(localStorageData).length > 0 ? (
            Object.entries(localStorageData).map(([key, value]) => (
              <div key={key} className="bg-black/30 rounded-lg p-3">
                <div className="text-white/70 text-sm font-semibold mb-1">{key}</div>
                <div className="bg-black/50 rounded p-2 overflow-auto max-h-32">
                  <pre className="text-xs text-white/80 font-mono">
                    {(() => {
                      if (typeof value === 'string' && value.startsWith('{')) {
                        try {
                          return JSON.stringify(JSON.parse(value), null, 2);
                        } catch (e) {
                          return value;
                        }
                      }
                      return String(value);
                    })()}
                  </pre>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white/50 text-center py-4">No localStorage data</div>
          )}
        </div>
      </Card>

      {/* Console Errors */}
      <Card
        title="Console Errors"
        subtitle="Recent console error messages (last 10)"
        headerAction={<AlertCircle className="w-5 h-5 text-red-400" />}
      >
        <div className="space-y-2">
          {consoleErrors.length > 0 ? (
            consoleErrors.map((error, index) => (
              <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="text-red-400 text-xs mb-1">{error.timestamp}</div>
                <div className="text-white/80 text-sm font-mono">{error.message}</div>
              </div>
            ))
          ) : (
            <div className="text-white/50 text-center py-4">No errors captured</div>
          )}
        </div>
      </Card>

      {/* Navigation State */}
      <Card
        title="Navigation State"
        subtitle="Current route and navigation information"
        headerAction={<Code className="w-5 h-5 text-white/50" />}
      >
        <div className="bg-black/30 rounded-lg p-4">
          <pre className="text-xs text-white/80 font-mono">
            {JSON.stringify(
              {
                pathname: location.pathname,
                search: location.search,
                hash: location.hash,
                state: location.state,
                key: location.key,
              },
              null,
              2
            )}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default DebugDashboard;
