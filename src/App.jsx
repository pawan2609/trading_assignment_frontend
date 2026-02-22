import { useEffect } from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import useWebSocket from './hooks/useWebSocket';
import { api } from './api';
import Controls from './components/Controls';
import SystemStatus from './components/SystemStatus';
import PnLPanel from './components/PnLPanel';
import Positions from './components/Positions';
import TradesTable from './components/TradesTable';
import BacktestPanel from './components/BacktestPanel';
import './index.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const {
    connected,
    trades,
    positions,
    pnl,
    systemState,
    setTrades,
    setPositions,
    setPnl,
    setSystemState,
  } = useWebSocket();

  useEffect(() => {
    (async () => {
      try {
        const [stateRes, tradesRes, posRes, pnlRes] = await Promise.all([
          api.getState(),
          api.getTrades(),
          api.getPositions(),
          api.getPnl(),
        ]);
        if (stateRes?.state) setSystemState(stateRes.state);
        if (tradesRes?.trades) setTrades(tradesRes.trades.reverse().slice(0, 200));
        if (posRes?.positions) setPositions(posRes.positions);
        if (pnlRes) setPnl(pnlRes);
      } catch {
        console.log('Backend might not be running yet');
      }
    })();
  }, []);

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={3} className="app-title">⚡ Trading Terminal</Title>
        <Text className="subtitle">Live Execution · Risk Management · Kill Switch</Text>
      </Header>

      <Content className="app-content">
        <Row gutter={[20, 20]}>
          <Col xs={24} md={12}>
            <SystemStatus systemState={systemState} connected={connected} />
          </Col>
          <Col xs={24} md={12}>
            <PnLPanel pnl={pnl} />
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Controls systemState={systemState} onStateUpdate={setSystemState} />
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Positions positions={positions} />
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col span={24}>
            <TradesTable trades={trades} />
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col span={24}>
            <BacktestPanel />
          </Col>
        </Row>
      </Content>

      <Footer className="app-footer">
        SMA Crossover Strategy · Fyers API · v1.0
      </Footer>
    </Layout>
  );
}
