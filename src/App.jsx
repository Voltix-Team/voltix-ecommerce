import React from 'react';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-electricBlue text-6xl font-extrabold mb-4">
        VOLTIX
      </h1>
      <p className="text-deepCharcoal text-xl font-medium">
        Power Your Future. Project Structure is LIVE.
      </p>
      
      {/* Test your new brand color */}
      <div className="mt-8 p-4 bg-silverMist rounded-lg border border-electricBlue text-electricBlue">
        Tailwind & React are officially linked!
      </div>
    </div>
  );
}

export default App; // THIS IS THE LINE YOU ARE MISSING!