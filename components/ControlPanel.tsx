import React, { useState } from 'react';
import { Box } from '../types/organigram';

interface ControlPanelProps {
  onAddBox: (box: Box) => void;
  onSave: () => string;
  onLoad: (hash: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddBox,
  onSave,
  onLoad,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [hash, setHash] = useState('');

  const handleAddBox = () => {
    if (name && company && position) {
      onAddBox({
        id: Date.now().toString(),
        name,
        company,
        position,
        x: Math.random() * (window.innerWidth - 150),
        y: Math.random() * (window.innerHeight - 150),
      });
      setName('');
      setCompany('');
      setPosition('');
    }
  };

  const handleSave = () => {
    const savedHash = onSave();
    setHash(savedHash);
  };

  const handleLoad = () => {
    if (hash) {
      onLoad(hash);
    }
  };

  return (
    <div className="fixed top-0 left-0 p-4 bg-white shadow-md">
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddBox}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Add Box
        </button>
      </div>
      <div className="mb-4">
        <button
          onClick={handleSave}
          className="w-full p-2 mb-2 bg-green-500 text-white rounded"
        >
          Save
        </button>
        <input
          type="text"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="Enter hash"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleLoad}
          className="w-full p-2 bg-yellow-500 text-white rounded"
        >
          Load
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;

