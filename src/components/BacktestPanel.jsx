import { useState } from 'react';
import { Card, Button, Input, DatePicker, Space, Statistic, Row, Col, Alert } from 'antd';
import { CaretRightOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { api } from '../api';

const fmt = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function BacktestPanel() {
    const [symbol, setSymbol] = useState('NSE:SBIN-EQ');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const runBacktest = async () => {
        setLoading(true);
        setError('');
        setResults(null);
        try {
            const sd = startDate ? startDate.format('YYYY-MM-DD') : '';
            const ed = endDate ? endDate.format('YYYY-MM-DD') : '';
            const res = await api.backtest(symbol, sd, ed);
            if (res.error) {
                setError(res.error);
            } else {
                setResults(res);
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <Card title="Backtester" size="small">
            <Space wrap size="middle" style={{ marginBottom: results || error ? 20 : 0 }}>
                <div>
                    <div className="stat-label">Symbol</div>
                    <Input
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="NSE:SBIN-EQ"
                        style={{ width: 180, fontFamily: "'JetBrains Mono', monospace" }}
                    />
                </div>
                <div>
                    <div className="stat-label">Start Date</div>
                    <DatePicker value={startDate} onChange={setStartDate} />
                </div>
                <div>
                    <div className="stat-label">End Date</div>
                    <DatePicker value={endDate} onChange={setEndDate} />
                </div>
                <Button
                    type="primary"
                    icon={<CaretRightOutlined />}
                    loading={loading}
                    onClick={runBacktest}
                    style={{ background: '#10b981', borderColor: '#10b981', marginTop: 20 }}
                >
                    Run Backtest
                </Button>
            </Space>

            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

            {results && (
                <Row gutter={[14, 14]}>
                    <Col xs={12} md={6}>
                        <Statistic
                            title="Total PnL"
                            value={fmt(Math.abs(results.total_pnl))}
                            prefix={results.total_pnl >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            valueStyle={{
                                color: results.total_pnl >= 0 ? '#34d399' : '#f87171',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 16,
                            }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic
                            title="Max Drawdown"
                            value={`${results.max_drawdown_pct?.toFixed(2)}%`}
                            valueStyle={{ color: '#f87171', fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic
                            title="Win Rate"
                            value={`${results.win_rate?.toFixed(1)}%`}
                            valueStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic
                            title="Total Trades"
                            value={results.total_trades}
                            valueStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic
                            title="Wins / Losses"
                            value={`${results.winning_trades} / ${results.losing_trades}`}
                            valueStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic
                            title="Avg Win"
                            value={`+${fmt(Math.abs(results.avg_win))}`}
                            valueStyle={{ color: '#34d399', fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Statistic
                            title="Avg Loss"
                            value={`−${fmt(Math.abs(results.avg_loss))}`}
                            valueStyle={{ color: '#f87171', fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}
                        />
                    </Col>
                </Row>
            )}
        </Card>
    );
}
