import React from 'react';
import config from '../constants.js';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen bg-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1599427303039-4f275ab28bcb?q=80&w=2070&auto=format&fit=crop)'}}></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
          DinoPedia
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-300 mb-8">
          Explore the prehistoric world. Catalog dinosaurs, log your own sightings, and become a part of the paleontological community.
        </p>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => onLogin('user@manifest.build', 'password')}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105 shadow-lg"
          >
            Enter as Demo User
          </button>
          <a 
            href={`${config.BACKEND_URL}/admin`} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105 shadow-lg"
          >
            Admin Panel
          </a>
        </div>
        <div className="mt-8 text-sm text-gray-400">
          <p>Default Admin: admin@manifest.build / admin</p>
          <p>Default User: user@manifest.build / password</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
