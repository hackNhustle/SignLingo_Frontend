import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ASLDictionaryTest = () => {
  const [tests, setTests] = useState([
    { name: 'Get Categories', status: 'pending', endpoint: '/asl/dictionary/categories' },
    { name: 'Search for "hello"', status: 'pending', endpoint: '/asl/dictionary/search?q=hello' },
    { name: 'Get word "cat"', status: 'pending', endpoint: '/asl/dictionary/word/cat' },
    { name: 'Get letter "A"', status: 'pending', endpoint: '/asl/dictionary/letter/A' },
    { name: 'Get Animals category', status: 'pending', endpoint: '/asl/dictionary/category/animals' },
    { name: 'Spell "DOG"', status: 'pending', endpoint: '/asl/dictionary/spell/DOG' },
  ]);

  const runTest = async (index) => {
    const test = tests[index];
    const updatedTests = [...tests];
    updatedTests[index].status = 'testing';
    setTests(updatedTests);

    try {
      const response = await api.get(test.endpoint);
      console.log(`✓ ${test.name}:`, response.data);
      updatedTests[index].status = 'success';
      updatedTests[index].data = response.data;
      setTests([...updatedTests]);
    } catch (error) {
      console.error(`✗ ${test.name}:`, error);
      updatedTests[index].status = 'failed';
      updatedTests[index].error = error.message;
      setTests([...updatedTests]);
    }
  };

  const runAllTests = async () => {
    for (let i = 0; i < tests.length; i++) {
      await runTest(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-indigo-600 text-4xl">menu_book</span>
            <h1 className="text-3xl font-bold text-gray-800">ASL Dictionary API Tests</h1>
          </div>

          <button
            onClick={runAllTests}
            className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Run All Tests
          </button>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {test.status === 'success' && (
                      <span className="material-symbols-outlined text-green-500">check_circle</span>
                    )}
                    {test.status === 'failed' && (
                      <span className="material-symbols-outlined text-red-500">cancel</span>
                    )}
                    {test.status === 'testing' && (
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {test.status === 'pending' && (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                    <span className="font-semibold text-gray-800">{test.name}</span>
                  </div>
                  <button
                    onClick={() => runTest(index)}
                    disabled={test.status === 'testing'}
                    className="px-4 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>

                <div className="text-sm text-gray-500 mb-2">
                  <code className="bg-gray-100 px-2 py-1 rounded">GET {test.endpoint}</code>
                </div>

                {test.status === 'success' && test.data && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">Response:</p>
                    <pre className="text-xs text-green-700 overflow-auto max-h-40">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </div>
                )}

                {test.status === 'failed' && test.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Error: {test.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/asl-dictionary"
              className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium"
            >
              Open ASL Dictionary
            </a>
            <a
              href={`${import.meta.env.VITE_API_BASE_URL || 'https://signlingo-backend-ei3t.onrender.com/api/v1'}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
            >
              API Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASLDictionaryTest;
