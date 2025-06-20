// ServerConnectionPanel.tsx
// Game-style server connection panel showing network stats and location
// Inspired by FPS/multiplayer game UIs with authentic gaming aesthetics

import * as React from 'react';
import { useState, useEffect } from 'react';

interface ServerConnectionPanelProps {
  className?: string;
}

// Signal strength bars component
const SignalBars: React.FC<{ ping: number }> = ({ ping }) => {
  const getConnectionQuality = (ping: number) => {
    if (ping <= 30) return { strength: 3, color: 'green' };
    if (ping <= 60) return { strength: 2, color: 'yellow' };
    return { strength: 1, color: 'red' };
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-400';
      case 'yellow': return 'bg-yellow-400';
      case 'red': return 'bg-red-400';
      default: return 'bg-gray-600';
    }
  };

  const { strength, color } = getConnectionQuality(ping);
  const activeColorClass = getColorClass(color);
  
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`w-1 transition-colors duration-300 ${
            bar <= strength ? activeColorClass : 'bg-gray-600/50'
          }`}
          style={{ height: `${bar * 3 + 2}px` }}
        />
      ))}
    </div>
  );
};

/**
 * Server connection panel component styled like a game networking UI
 * Shows fake but realistic network statistics and server location
 */
const ServerConnectionPanel: React.FC<ServerConnectionPanelProps> = ({ 
  className = '' 
}) => {
  // Network stats state with realistic fake data
  const [networkStats, setNetworkStats] = useState({
    ping: 23,
    packetLoss: 0.1,
    jitter: 2,
    serverLocation: 'EU-Central (Munich)',
    status: 'Connected' as 'Connected' | 'Reconnecting' | 'Unstable'
  });
  // Simulate slight network fluctuations for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        ping: Math.max(15, Math.min(45, prev.ping + (Math.random() - 0.5) * 8)),
        packetLoss: Math.max(0, Math.min(2, prev.packetLoss + (Math.random() - 0.5) * 0.3)),
        jitter: Math.max(1, Math.min(5, prev.jitter + (Math.random() - 0.5) * 2))
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-black/80 backdrop-blur-sm border border-amber-500/30 rounded-lg p-3 atmospheric-glow ${className}`}>
      {/* Header with signal bars and server location */}
      <div className="flex items-center justify-between mb-2">        <div className="flex items-center gap-2">
          <SignalBars ping={networkStats.ping} />
          <span className="text-amber-100 font-mono text-xs font-medium">
            {networkStats.serverLocation}
          </span>
        </div>
      </div>

      {/* Network stats */}
      <div className="space-y-1">        {/* Ping */}
        <div className="flex justify-between items-center">
          <span className="text-amber-200/80 text-xs font-mono">PING</span>
          <span className={`text-xs font-mono font-medium ${
            (() => {
              if (networkStats.ping <= 30) return 'text-green-400';
              if (networkStats.ping <= 60) return 'text-yellow-400';
              return 'text-red-400';
            })()
          }`}>
            {Math.round(networkStats.ping)}ms
          </span>
        </div>

        {/* Packet Loss - smaller and less prominent */}
        <div className="flex justify-between items-center opacity-70">
          <span className="text-amber-200/60 text-xs font-mono">PKT</span>
          <span className="text-xs font-mono text-amber-200/60">
            {networkStats.packetLoss.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServerConnectionPanel;
