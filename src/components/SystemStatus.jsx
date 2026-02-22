import { Card, Tag, Badge, Space, Row, Col } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const stateConfig = {
    RUNNING: { color: 'success', label: 'RUNNING' },
    PAUSED: { color: 'warning', label: 'PAUSED' },
    KILLED: { color: 'error', label: 'KILLED' },
};

export default function SystemStatus({ systemState, connected }) {
    const sc = stateConfig[systemState] || stateConfig.RUNNING;

    return (
        <Card title="System Status" size="small" style={{ height: '100%' }}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <div className="stat-block">
                        <span className="stat-label">State</span>
                        <Tag color={sc.color} style={{ fontSize: 13, padding: '2px 12px', fontWeight: 700, letterSpacing: 1 }}>
                            {sc.label}
                        </Tag>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="stat-block">
                        <span className="stat-label">WebSocket</span>
                        <Space>
                            <Badge status={connected ? 'processing' : 'error'} />
                            {connected ? (
                                <Tag icon={<CheckCircleFilled />} color="success">Connected</Tag>
                            ) : (
                                <Tag icon={<CloseCircleFilled />} color="error">Disconnected</Tag>
                            )}
                        </Space>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}
