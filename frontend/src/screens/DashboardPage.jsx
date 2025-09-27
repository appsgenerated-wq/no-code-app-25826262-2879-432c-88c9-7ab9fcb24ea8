import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, dinosaurs, mySightings, onLogout, onLoadDinosaurs, onLoadMySightings, onCreateSighting }) => {
  const [newSighting, setNewSighting] = useState({ dinosaurId: '', location: '', notes: '' });

  useEffect(() => {
    onLoadDinosaurs();
    onLoadMySightings();
  }, []);

  const handleCreateSighting = async (evt) => {
    evt.preventDefault();
    if (!newSighting.dinosaurId || !newSighting.location) {
      alert('Please select a dinosaur and enter a location.');
      return;
    }
    await onCreateSighting({ ...newSighting, sightedAt: new Date().toISOString() });
    setNewSighting({ dinosaurId: '', location: '', notes: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DinoPedia Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.name}!</p>
          </div>
          <div className="space-x-4">
             <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition">
              Admin Panel
            </a>
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Dinosaur List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dinosaur Catalog</h2>
              {dinosaurs.length === 0 ? (
                <p className="text-gray-500">No dinosaurs found. An admin needs to add some!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dinosaurs.map(dino => (
                    <div key={dino.id} className="border rounded-lg overflow-hidden bg-gray-50">
                      <img src={dino.image?.thumbnail?.url || 'https://via.placeholder.com/400x300.png?text=No+Image'} alt={dino.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900">{dino.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{dino.period} Period | {dino.diet}</p>
                        <p className="text-sm text-gray-500 mt-1">Length: {dino.lengthInMeters}m</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Sightings and Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Log a New Sighting</h2>
              <form onSubmit={handleCreateSighting} className="space-y-4">
                <div>
                  <label htmlFor="dinosaur" className="block text-sm font-medium text-gray-700">Dinosaur</label>
                  <select
                    id="dinosaur"
                    value={newSighting.dinosaurId}
                    onChange={(e) => setNewSighting({...newSighting, dinosaurId: e.target.value})}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select a dinosaur...</option>
                    {dinosaurs.map(dino => <option key={dino.id} value={dino.id}>{dino.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    id="location"
                    placeholder="e.g., Sector 4 Paddock"
                    value={newSighting.location}
                    onChange={(e) => setNewSighting({...newSighting, location: e.target.value})}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                   <textarea
                    id="notes"
                    rows="3"
                    placeholder="Optional notes about the sighting..."
                    value={newSighting.notes}
                    onChange={(e) => setNewSighting({...newSighting, notes: e.target.value})}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-semibold">
                  Log Sighting
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Sightings</h2>
              {mySightings.length === 0 ? (
                <p className="text-gray-500">You haven't logged any sightings yet.</p>
              ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {mySightings.map(sighting => (
                    <li key={sighting.id} className="border-b pb-3">
                      <p className="font-semibold text-gray-800">{sighting.dinosaur?.name || 'Unknown Dinosaur'}</p>
                      <p className="text-sm text-gray-600">{sighting.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(sighting.sightedAt).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
