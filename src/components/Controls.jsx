import { useState } from 'react';
import { Card, Button, Input, Space, Tag, Popconfirm } from 'antd';
import {
    CaretRightOutlined,
    PauseOutlined,
    StopOutlined,
    CloseCircleOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import { api } from '../api';

const stateColors = {
    RUNNING: 'success',
    PAUSED: 'warning',
    KILLED: 'error',
};

export default function Controls({ systemState, onStateUpdate }) {
    const [symbol, setSymbol] = useState('NSE:SBIN-EQ');
    const [loading, setLoading] = useState('');

    const handleAction = async (action, label) => {
        setLoading(label);
        try {
            const res = await action();
            if (res.state) onStateUpdate(res.state);
        } catch (err) {
            console.error(`${label} failed:`, err);
        }
        setLoading('');
    };

    return (
        <Card
            title="Controls"
            size="small"
            extra={
                <Tag
                    color={stateColors[systemState] || 'default'}
                    style={{ fontWeight: 700, letterSpacing: 1, fontSize: 12 }}
                >
                    ● {systemState}
                </Tag>
            }
        >
            <Space wrap size="middle">
                <Input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="NSE:SBIN-EQ"
                    style={{ width: 200, fontFamily: "'JetBrains Mono', monospace" }}
                />

                <Button
                    type="primary"
                    icon={<CaretRightOutlined />}
                    loading={loading === 'start'}
                    onClick={() => handleAction(() => api.start(symbol), 'start')}
                    disabled={systemState === 'KILLED'}
                    style={{ background: '#10b981', borderColor: '#10b981' }}
                >
                    Start Trading
                </Button>

                <Button
                    icon={<StopOutlined />}
                    loading={loading === 'stop'}
                    onClick={() => handleAction(api.stop, 'stop')}
                >
                    Stop Feed
                </Button>

                <Button
                    icon={<PauseOutlined />}
                    loading={loading === 'pause'}
                    onClick={() => handleAction(api.pause, 'pause')}
                    disabled={systemState !== 'RUNNING'}
                    style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#fff' }}
                >
                    Pause
                </Button>

                <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    loading={loading === 'resume'}
                    onClick={() => handleAction(api.resume, 'resume')}
                    disabled={systemState !== 'PAUSED'}
                >
                    Resume
                </Button>

                <Popconfirm
                    title="Kill system and close all positions?"
                    onConfirm={() => handleAction(api.kill, 'kill')}
                    okText="Yes, Kill"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                >
                    <Button
                        danger
                        type="primary"
                        icon={<CloseCircleOutlined />}
                        loading={loading === 'kill'}
                        disabled={systemState === 'KILLED'}
                    >
                        Kill Switch
                    </Button>
                </Popconfirm>
            </Space>
        </Card>
    );
}
