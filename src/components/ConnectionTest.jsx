import { useState, useEffect } from 'react';
import { systemAPI, authAPI, convertAPI, apiHelpers } from '../services/api';

export default function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState({
    backend: 'checking',
    database: 'checking',
    auth: 'checking',
    conversion: 'checking'
  });
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (test, status, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runConnectionTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setConnectionStatus({
      backend: 'checking',
      database: 'checking',
      auth: 'checking',
      conversion: 'checking'
    });

    // Test 1: Backend Health Check
    try {
      addTestResult('Backend Health', 'running', 'Checking backend server...');
      const healthResponse = await systemAPI.healthCheck();

      setConnectionStatus(prev => ({ ...prev, backend: 'success' }));
      addTestResult('Backend Health', 'success', 'Backend server is running', healthResponse.data);

      // Check database status from health response
      if (healthResponse.data.database?.status === 'connected') {
        setConnectionStatus(prev => ({ ...prev, database: 'success' }));
        addTestResult('Database', 'success', 'Database connected successfully', healthResponse.data.database);
      } else {
        setConnectionStatus(prev => ({ ...prev, database: 'error' }));
        addTestResult('Database', 'error', 'Database connection failed');
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, backend: 'error', database: 'error' }));
      addTestResult('Backend Health', 'error', apiHelpers.handleError(error));
    }

    // Test 2: Test Route
    try {
      addTestResult('Test Route', 'running', 'Testing basic API route...');
      const testResponse = await systemAPI.testConnection();
      addTestResult('Test Route', 'success', 'Test route working', testResponse.data);
    } catch (error) {
      addTestResult('Test Route', 'error', apiHelpers.handleError(error));
    }

    // Test 3: Authentication (if token exists)
    if (apiHelpers.isAuthenticated()) {
      try {
        addTestResult('Authentication', 'running', 'Testing authentication...');
        const authResponse = await authAPI.getProfile();
        setConnectionStatus(prev => ({ ...prev, auth: 'success' }));
        addTestResult('Authentication', 'success', 'User authenticated', authResponse.data);
      } catch (error) {
        setConnectionStatus(prev => ({ ...prev, auth: 'error' }));
        addTestResult('Authentication', 'error', 'Authentication failed - please login');
      }
    } else {
      setConnectionStatus(prev => ({ ...prev, auth: 'warning' }));
      addTestResult('Authentication', 'warning', 'No authentication token found');
    }

    // Test 4: Conversion API
    try {
      addTestResult('Conversion API', 'running', 'Testing text-to-sign conversion...');
      const conversionResponse = await convertAPI.textToSign({
        text: 'hello world',
        language: 'en',
        speed: 'normal'
      });
      setConnectionStatus(prev => ({ ...prev, conversion: 'success' }));
      addTestResult('Conversion API', 'success', 'Text-to-sign conversion working', {
        word_count: conversionResponse.data.word_count,
        duration: conversionResponse.data.total_duration
      });
    } catch (error) {
      if (error.response?.status === 401) {
        setConnectionStatus(prev => ({ ...prev, conversion: 'warning' }));
        addTestResult('Conversion API', 'warning', 'Conversion API requires authentication');
      } else {
        setConnectionStatus(prev => ({ ...prev, conversion: 'error' }));
        addTestResult('Conversion API', 'error', apiHelpers.handleError(error));
      }
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runConnectionTests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'checking': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'checking': return 'hourglass_empty';
      default: return 'help';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Frontend ↔ Backend Connection Test</h1>
          <p className="text-gray-600">Testing all API connections and services</p>

          <button
            onClick={runConnectionTests}
            disabled={isRunning}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isRunning ? 'Running Tests...' : 'Run Tests Again'}
          </button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(connectionStatus).map(([service, status]) => (
            <div key={service} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-2xl ${getStatusColor(status).split(' ')[0]}`}>
                  {getStatusIcon(status)}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">{service}</h3>
                  <p className={`text-sm px-2 py-1 rounded-full ${getStatusColor(status)} capitalize`}>
                    {status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Test Results</h2>
            <p className="text-sm text-gray-600">Detailed results from connection tests</p>
          </div>

          <div className="p-6">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No test results yet. Click "Run Tests" to start.</p>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${getStatusColor(result.status).split(' ')[0]}`}>
                          {getStatusIcon(result.status)}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">{result.test}</h3>
                          <p className="text-sm text-gray-600">{result.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{result.timestamp}</span>
                    </div>

                    {result.data && (
                      <div className="mt-3 ml-9">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                            View Response Data
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Backend Server (v1)</h3>
              <p className="text-gray-600">URL: {import.meta.env.VITE_API_BASE_URL || 'https://signlingo-gateway-xozh.onrender.com/api/v1'}</p>
              <p className="text-gray-600">Status: {connectionStatus.backend}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Frontend Server</h3>
              <p className="text-gray-600">URL: http://localhost:3000</p>
              <p className="text-gray-600">Proxy: Configured</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Authentication</h3>
              <p className="text-gray-600">Token: {apiHelpers.isAuthenticated() ? 'Present' : 'Missing'}</p>
              <p className="text-gray-600">Status: {connectionStatus.auth}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Core Features</h3>
              <p className="text-gray-600">ISL Conversion: {connectionStatus.conversion}</p>
              <p className="text-gray-600">Database: {connectionStatus.database}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}