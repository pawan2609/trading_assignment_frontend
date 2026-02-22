import { Card, Table, Tag, Empty } from 'antd';

const fmt = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const columns = [
    {
        title: 'Time',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (ts) =>
            ts
                ? new Date(ts).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
                : '—',
        width: 160,
    },
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
        width: 80,
    },
    {
        title: 'Qty',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 70,
    },
    {
        title: 'Entry',
        dataIndex: 'entry_price',
        key: 'entry_price',
        render: (v) => fmt(v),
    },
    {
        title: 'Exit',
        dataIndex: 'exit_price',
        key: 'exit_price',
        render: (v) => (v ? fmt(v) : '—'),
    },
    {
        title: 'PnL',
        key: 'pnl',
        render: (_, record) => {
            if (!record.closed) return '—';
            const pnl = record.pnl ?? 0;
            const color = pnl > 0 ? '#34d399' : pnl < 0 ? '#f87171' : undefined;
            return (
                <span style={{ color, fontWeight: 600 }}>
                    {pnl >= 0 ? '+' : '−'}₹{Math.abs(pnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            );
        },
    },
    {
        title: 'Status',
        key: 'status',
        render: (_, record) => (
            <Tag color={record.closed ? 'geekblue' : 'orange'}>
                {record.closed ? 'Closed' : 'Open'}
            </Tag>
        ),
        width: 90,
    },
];

export default function TradesTable({ trades }) {
    return (
        <Card
            title="Trade History"
            size="small"
            extra={trades.length > 0 && <Tag>{trades.length} trade{trades.length !== 1 ? 's' : ''}</Tag>}
        >
            {trades.length === 0 ? (
                <Empty description="No trades yet — signals will appear here in real-time" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={trades}
                    rowKey={(r, i) => r.trade_id || r.order_id || i}
                    pagination={{ pageSize: 20, size: 'small', showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] }}
                    size="small"
                    scroll={{ x: 800 }}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
            )}
        </Card>
    );
}
