import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', type: 'input', data: { label: '🎵 Discovery / Landing' }, position: { x: 250, y: 0 }, style: { background: '#B3E5FC', borderRadius: 10, padding: 10, color: '#000' } },
  { id: '2', data: { label: '🔑 Authentication' }, position: { x: 250, y: 100 }, style: { background: '#81D4FA', borderRadius: 10, padding: 10 } },
  { id: '3', data: { label: '😊 Mood Selection / Goal Setting' }, position: { x: 250, y: 200 }, style: { background: '#AED581', borderRadius: 10, padding: 10 } },
  { id: '4', data: { label: '🎶 Playlist Recommendation' }, position: { x: 250, y: 300 }, style: { background: '#FFCC80', borderRadius: 10, padding: 10 } },
  { id: '5', data: { label: '▶️ Music Session' }, position: { x: 250, y: 400 }, style: { background: '#FFAB91', borderRadius: 10, padding: 10 } },
  { id: '6', data: { label: '💬 Post-Session Feedback' }, position: { x: 250, y: 500 }, style: { background: '#CE93D8', borderRadius: 10, padding: 10 } },
  { id: '7', data: { label: '📊 Session Reflection / Analytics' }, position: { x: 250, y: 600 }, style: { background: '#90CAF9', borderRadius: 10, padding: 10 } },
  { id: '8', data: { label: '🔄 Repeat / Personalization' }, position: { x: 250, y: 700 }, style: { background: '#A5D6A7', borderRadius: 10, padding: 10 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
  { id: 'e5-6', source: '5', target: '6', animated: true },
  { id: 'e6-7', source: '6', target: '7', animated: true },
  { id: 'e7-8', source: '7', target: '8', animated: true },
];

const UserJourneyFlow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <MiniMap nodeColor={(node) => node.style.background} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default UserJourneyFlow;