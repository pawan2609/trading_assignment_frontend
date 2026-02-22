import { Card, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function PnLPanel({ pnl }) {
    const running = pnl?.running_pnl ?? 0;
    const daily = pnl?.daily_pnl ?? 0;
    const commission = pnl?.total_commission ?? 0;
    const openCount = pnl?.open_positions ?? 0;

    const pnlColor = (v) => (v > 0 ? '#10b981' : v < 0 ? '#ef4444' : '#a0a8c0');
    const pnlPrefix = (v) => (v > 0 ? <ArrowUpOutlined /> : v < 0 ? <ArrowDownOutlined /> : null);

    const fmt = (v) => `₹${Math.abs(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <Card title="Profit & Loss" size="small" style={{ height: '100%' }}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Statistic
                        title="Running PnL"
                        value={fmt(running)}
                        prefix={pnlPrefix(running)}
                        valueStyle={{ color: pnlColor(running), fontFamily: "'JetBrains Mono', monospace", fontSize: 20 }}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title="Daily PnL"
                        value={fmt(daily)}
                        prefix={pnlPrefix(daily)}
                        valueStyle={{ color: pnlColor(daily), fontFamily: "'JetBrains Mono', monospace", fontSize: 20 }}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title="Commission"
                        value={`₹${commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        valueStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title="Open Positions"
                        value={openCount}
                        valueStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                    />
                </Col>
            </Row>
        </Card>
    );
}
