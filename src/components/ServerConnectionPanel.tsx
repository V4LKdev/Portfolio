// ServerConnectionPanel.tsx
// Game-style server connection panel showing real network latency and stats
// Measures actual HTTP request latency to provide authentic network quality data

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
 * Shows real HTTP latency and estimated network quality metrics
 */
const ServerConnectionPanel: React.FC<ServerConnectionPanelProps> = ({ 
  className = '' 
}) => {
  // Network stats state with real HTTP latency measurement
  const [networkStats, setNetworkStats] = useState({
    ping: 0,
    packetLoss: 0,
    jitter: 0,
    serverLocation: 'EU-Central (Munich)',
    status: 'Connecting' as 'Connected' | 'Reconnecting' | 'Unstable' | 'Connecting'
  });

  // Measure actual HTTP request latency
  const measureLatency = async () => {
    const attempts = 3;
    const results: number[] = [];
    let failures = 0;

    for (let i = 0; i < attempts; i++) {
      try {
        const startTime = performance.now();
        
        // Use a fast, reliable endpoint (Google's public DNS over HTTPS)
        // This gives us real network latency to a nearby server
        const response = await fetch('https://dns.google/resolve?name=google.com&type=A', {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const endTime = performance.now();
          results.push(endTime - startTime);
        } else {
          failures++;
        }
      } catch (error) {
        failures++;
        console.log('Latency measurement failed:', error);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }    if (results.length > 0) {
      const avgLatency = results.reduce((a, b) => a + b, 0) / results.length;
      const jitter = results.length > 1 ? 
        Math.sqrt(results.reduce((sum, val) => sum + Math.pow(val - avgLatency, 2), 0) / results.length) : 0;
      
      let connectionStatus: 'Connected' | 'Unstable' | 'Reconnecting';
      if (failures === 0) {
        connectionStatus = 'Connected';
      } else if (failures < attempts) {
        connectionStatus = 'Unstable';
      } else {
        connectionStatus = 'Reconnecting';
      }
      
      setNetworkStats(prev => ({
        ...prev,
        ping: avgLatency,
        packetLoss: (failures / attempts) * 100,
        jitter: jitter,
        status: connectionStatus
      }));
    } else {
      // All requests failed
      setNetworkStats(prev => ({
        ...prev,
        ping: 999,
        packetLoss: 100,
        status: 'Reconnecting'
      }));
    }
  };

  // Measure latency on component mount and then every 5 seconds
  useEffect(() => {
    measureLatency(); // Initial measurement
    
    const interval = setInterval(() => {
      measureLatency();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-black/80 backdrop-blur-sm border border-amber-500/30 rounded-lg p-3 atmospheric-glow ${className}`}>      {/* Header with signal bars and server location */}
      <div className="flex items-center gap-2 mb-2">
        <SignalBars ping={networkStats.ping} />
        <span className="text-amber-100 font-mono text-xs font-medium">
          {networkStats.serverLocation}
        </span>
      </div>

      {/* Network stats on same line */}
      <div className="flex items-center gap-4 text-xs font-mono text-amber-200/70">
        <span>
          PING <span className={`ml-1 font-medium ${
            (() => {
              if (networkStats.ping <= 30) return 'text-green-400';
              if (networkStats.ping <= 60) return 'text-yellow-400';
              return 'text-red-400';
            })()
          }`}>
            {Math.round(networkStats.ping)}ms
          </span>
        </span>
        <span>
          PKT <span className="text-amber-200/60">{networkStats.packetLoss.toFixed(1)}%</span>
        </span>
      </div>
    </div>
  );
};

export default ServerConnectionPanel;
