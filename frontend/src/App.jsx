import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [dinosaurs, setDinosaurs] = useState([]);
  const [mySightings, setMySightings] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const manifest = new Manifest();

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);
      
      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
        } catch (err) {
          setUser(null);
          setCurrentScreen('landing');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
      setIsLoading(false);
    };
    
    initializeApp();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const loggedInUser = await manifest.from('User').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
    setMySightings([]);
    setCurrentScreen('landing');
  };

  const loadDinosaurs = async () => {
    try {
      const response = await manifest.from('Dinosaur').find({ sort: { name: 'asc' } });
      setDinosaurs(response.data);
    } catch (err) {
      console.error('Failed to load dinosaurs:', err);
    }
  };

  const loadMySightings = async () => {
    if (!user) return;
    try {
      const response = await manifest.from('Sighting').find({
        include: ['dinosaur'],
        filter: { observerId: user.id },
        sort: { sightedAt: 'desc' },
      });
      setMySightings(response.data);
    } catch (err) {
      console.error('Failed to load sightings:', err);
    }
  };

  const createSighting = async (sightingData) => {
    try {
      const newSighting = await manifest.from('Sighting').create(sightingData);
      const enrichedSighting = {
        ...newSighting,
        dinosaur: dinosaurs.find(d => d.id === newSighting.dinosaurId)
      };
      setMySightings([enrichedSighting, ...mySightings]);
    } catch (err) {
      console.error('Failed to create sighting:', err);
      alert('Could not create sighting. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading DinoPedia...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-medium ${backendConnected ? 'text-gray-700' : 'text-red-700'}`}>
          {backendConnected ? 'API Connected' : 'API Disconnected'}
        </span>
      </div>
      
      {currentScreen === 'landing' || !user ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <DashboardPage 
          user={user} 
          dinosaurs={dinosaurs}
          mySightings={mySightings}
          onLogout={handleLogout} 
          onLoadDinosaurs={loadDinosaurs}
          onLoadMySightings={loadMySightings}
          onCreateSighting={createSighting}
        />
      )}
    </div>
  );
}

export default App;
