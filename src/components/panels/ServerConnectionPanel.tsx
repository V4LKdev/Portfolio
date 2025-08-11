// ServerConnectionPanel.tsx
// Game-style server connection panel showing real network latency and stats
// Measures actual HTTP request latency to provide authentic network quality data

import { useState, useEffect } from "react";

interface ServerConnectionPanelProps {
  readonly className?: string;
}

// Signal strength bars component
interface SignalBarsProps {
  readonly ping: number;
}

const SignalBars = ({ ping }: SignalBarsProps) => {
  const getConnectionQuality = (ping: number) => {
    if (ping <= 30) return { strength: 3, color: "green" };
    if (ping <= 60) return { strength: 2, color: "yellow" };
    return { strength: 1, color: "red" };
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "theme-signal-good";
      case "yellow":
        return "theme-signal-medium";
      case "red":
        return "theme-signal-poor";
      default:
        return "theme-signal-inactive";
    }
  };

  const { strength, color } = getConnectionQuality(ping);
  const activeColorClass = getColorClass(color);

  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3].map((bar) => (
        <div
          key={`signal-bar-${bar}`}
          className={`w-1 transition-colors duration-300 ${
            bar <= strength ? activeColorClass : "theme-signal-inactive"
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
function ServerConnectionPanel({ className = "" }: ServerConnectionPanelProps) {
  // Network stats state with real HTTP latency measurement
  const [networkStats, setNetworkStats] = useState({
    ping: 0,
    packetLoss: 0,
    jitter: 0,
    serverLocation: "EU-Central (Munich)",
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
        const response = await fetch(
          "https://dns.google/resolve?name=google.com&type=A",
          {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
          },
        );

        if (response.ok) {
          const endTime = performance.now();
          results.push(endTime - startTime);
        } else {
          failures++;
        }
      } catch {
        failures++;
        // Silently handle latency measurement failures
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (results.length > 0) {
      const avgLatency = results.reduce((a, b) => a + b, 0) / results.length;
      const jitter =
        results.length > 1
          ? Math.sqrt(
              results.reduce(
                (sum, val) => sum + Math.pow(val - avgLatency, 2),
                0,
              ) / results.length,
            )
          : 0;

      setNetworkStats((prev) => ({
        ...prev,
        ping: avgLatency,
        packetLoss: (failures / attempts) * 100,
        jitter: jitter,
      }));
    } else {
      // All requests failed
      setNetworkStats((prev) => ({
        ...prev,
        ping: 999,
        packetLoss: 100,
      }));
    }
  };

  // Measure latency on component mount and then every 3 seconds, if page is visible
  useEffect(() => {
    const measureIfVisible = () => {
      if (!document.hidden) {
        measureLatency();
      }
    };

    // Run on mount if visible
    measureIfVisible();

    // Set up interval for periodic checks
    const interval = setInterval(measureIfVisible, 3000);

    // Add event listener to measure immediately when tab becomes visible
    document.addEventListener("visibilitychange", measureIfVisible);

    // Cleanup function
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", measureIfVisible);
    };
  }, []);
  return (
    <div
      className={`backdrop-blur-sm rounded-md p-3 atmospheric-glow ${className}`}
      style={{
        backgroundColor: "var(--theme-panel-bg, rgba(30, 41, 59, 0.9))",
        borderColor: "var(--theme-panel-border, rgb(59 130 246))",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      {/* Signal bars and server location on top row */}
      <div className="flex items-center gap-2 mb-2">
        <SignalBars ping={networkStats.ping} />
        <span
          className="font-mono text-xs font-medium"
          style={{ color: "var(--theme-panel-text, rgb(254 243 199))" }}
        >
          {networkStats.serverLocation}
        </span>
      </div>

      {/* Network stats */}
      <div
        className="flex items-center gap-4 text-xs font-mono"
        style={{ color: "var(--theme-panel-text, rgb(253 230 138 / 0.7))" }}
      >
        <span>
          PING{" "}
          <span
            className="ml-1 font-medium"
            style={{
              color: (() => {
                if (networkStats.ping <= 30)
                  return "var(--theme-signal-good, #4ade80)";
                if (networkStats.ping <= 60)
                  return "var(--theme-signal-medium, #facc15)";
                return "var(--theme-signal-poor, #f87171)";
              })(),
            }}
          >
            {Math.round(networkStats.ping)}ms
          </span>
        </span>
        <span>
          PKT{" "}
          <span
            style={{ color: "var(--theme-panel-text, rgb(253 230 138 / 0.6))" }}
          >
            {networkStats.packetLoss.toFixed(1)}%
          </span>
        </span>
      </div>
    </div>
  );
}

export default ServerConnectionPanel;
