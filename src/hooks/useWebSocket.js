import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws';

export default function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [pnl, setPnl] = useState({ running_pnl: 0, daily_pnl: 0 });
  const [systemState, setSystemState] = useState('RUNNING');
  const ws = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const { event: evt, data } = msg;

        switch (evt) {
          case 'trade':
            setTrades((prev) => {
              const idx = prev.findIndex((t) => t.trade_id === data.trade_id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = data;
                return updated;
              }
              return [data, ...prev].slice(0, 200);
            });
            break;
          case 'positions':
            setPositions(data.positions || []);
            break;
          case 'pnl':
            setPnl(data);
            break;
          case 'state_change':
            setSystemState(data.to_state);
            break;
          case 'pong':
            break;
          default:
            console.log('Unknown event:', evt);
        }
      } catch (err) {
        console.error('WS message parse error:', err);
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected, reconnecting in 3s...');
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    connect();
    const ping = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send('ping');
      }
    }, 30000);

    return () => {
      clearInterval(ping);
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  return { connected, trades, positions, pnl, systemState, setTrades, setPositions, setPnl, setSystemState };
}
