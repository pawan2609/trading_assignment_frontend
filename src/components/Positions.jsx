import { Card, Table, Tag, Empty } from 'antd';

const fmt = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const columns = [
    {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
        render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
        title: 'Side',
        dataIndex: 'side',
        key: 'side',
        render: (side) => (
            <Tag color={side === 'BUY' ? 'success' : 'error'} style={{ fontWeight: 700, letterSpacing: 0.5 }}>
                {side}
            </Tag>
        ),
    },
    {
        title: 'Qty',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Entry',
        dataIndex: 'entry_price',
        key: 'entry_price',
        render: (v) => fmt(v),
    },
    {
        title: 'Current',
        dataIndex: 'current_price',
        key: 'current_price',
        render: (v) => fmt(v),
    },
    {
        title: 'Unrealized PnL',
        dataIndex: 'unrealized_pnl',
        key: 'unrealized_pnl',
        render: (v) => {
            const val = v || 0;
            const color = val > 0 ? '#34d399' : val < 0 ? '#f87171' : undefined;
            return (
                <span style={{ color, fontWeight: 600 }}>
                    {val >= 0 ? '+' : '−'}₹{Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            );
        },
    },
    {
        title: 'Stop Loss',
        dataIndex: 'stop_loss',
        key: 'stop_loss',
        render: (v) => (v ? fmt(v) : '—'),
    },
];

export default function Positions({ positions }) {
    return (
        <Card
            title="Open Positions"
            size="small"
            extra={positions.length > 0 && <Tag>{positions.length}</Tag>}
        >
            {positions.length === 0 ? (
                <Empty description="No open positions" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={positions}
                    rowKey={(r, i) => r.trade_id || r.order_id || i}
                    pagination={false}
                    size="small"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
            )}
        </Card>
    );
}
