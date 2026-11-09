import React, { useState, useEffect } from 'react';
import '../CSS/LoadingOverlay.css';

const STATUS_MESSAGES = [
  'Retrieving dispatches from the hangar...',
  'Calibrating radar and flight manifest...',
  'Compiling latest aerospace intelligence...',
];

export default function LoadingOverlay({ isVisible, maxDisplayDuration = 2000, onDone }) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [fadingOut, setFadingOut] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  // Cycle status messages smoothly
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 700);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Handle smooth fadeout transition
  useEffect(() => {
    let fadeTimer;
    let removeTimer;
    let maxTimer;

    if (!isVisible) {
      fadeTimer = setTimeout(() => {
        setFadingOut(true);
        removeTimer = setTimeout(() => {
          setShouldRender(false);
          if (onDone) onDone();
        }, 250);
      }, 0);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }

    fadeTimer = setTimeout(() => {
      setShouldRender(true);
      setFadingOut(false);
    }, 0);

    // Hard limit: strictly no more than maxDisplayDuration total display time
    const fadeOutDelay = Math.max(0, maxDisplayDuration - 250);
    maxTimer = setTimeout(() => {
      setFadingOut(true);
      removeTimer = setTimeout(() => {
        setShouldRender(false);
        if (onDone) onDone();
      }, 250);
    }, fadeOutDelay);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      clearTimeout(maxTimer);
    };
  }, [isVisible, maxDisplayDuration, onDone]);

  if (!shouldRender) return null;

  return (
    <div
      className={`aero-loading-overlay ${fadingOut ? 'aero-fade-out' : 'aero-fade-in'}`}
      role="status"
      aria-live="polite"
      id="aero-loading-screen"
    >
      <div className="aero-floating-loader">
        <div className="aero-loader-header">
          <span className="aero-loader-kicker">Flight Operations &amp; Intelligence</span>
          <h2 className="aero-loader-title">AeroXplore</h2>
          <div className="aero-loader-rule" />
        </div>

        {/* Aviation Radar */}
        <div className="aero-radar-disk">
          <div className="aero-radar-ring ring-1" />
          <div className="aero-radar-ring ring-2" />
          <div className="aero-radar-ring ring-3" />
          <div className="aero-radar-crosshair horizontal" />
          <div className="aero-radar-crosshair vertical" />
          <div className="aero-radar-sweep" />

          {/* Jet Center */}
          <div className="aero-jet-silhouette">
            <svg
              viewBox="0 0 100 100"
              className="aero-jet-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 8 
                   L53 28 
                   L55 42 
                   L84 64 
                   L84 72 
                   L56 65 
                   L56 82 
                   L66 91 
                   L66 96 
                   L50 92 
                   L34 96 
                   L34 91 
                   L44 82 
                   L44 65 
                   L16 72 
                   L16 64 
                   L45 42 
                   L47 28 
                   Z"
                fill="currentColor"
              />
            </svg>
            <span className="aero-mach-pulse pulse-1" />
            <span className="aero-mach-pulse pulse-2" />
          </div>

          {/* Cardinal points */}
          <span className="aero-cardinal north">N</span>
          <span className="aero-cardinal east">E</span>
          <span className="aero-cardinal south">S</span>
          <span className="aero-cardinal west">W</span>
        </div>

        {/* Floating status text */}
        <p className="aero-loading-status" key={statusIndex}>
          {STATUS_MESSAGES[statusIndex]}
        </p>
      </div>
    </div>
  );
}
