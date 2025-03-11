import React from 'react';

const Loader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading..."
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900"
    >
      {/* Spinner Container (unchanged design) */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 animate-spin">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                // Rotate the dot container then translate it upward to position it on the circle’s perimeter.
                transform: `rotate(${i * 45}deg) translate(0, -20px)`,
              }}
            >
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-fade"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </div>
          ))}
        </div>

        {/* Pulsating Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full opacity-50 animate-ping"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* Branding with an intriguing animated title */}
      <h1 className="mt-6 text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-whisper">
        Radialwisper
      </h1>

      {/* Engaging tagline */}
      <p className="mt-2 text-sm text-gray-300">
        Shaping whispers into motion...
      </p>
    </div>
  );
};

export default Loader;
