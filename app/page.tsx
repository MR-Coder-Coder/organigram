'use client'

import React, { useState } from 'react';
import Organigram from '../components/Organigram';
import Sidebar from '../components/Sidebar';
import { useOrganigram } from '../hooks/useOrganigram';

const App: React.FC = () => {
  const {
    boxes,
    lines,
    selectedBoxId,
    isDrawingLine,
    setSelectedBoxId,
    addBox,
    updateBox,
    toggleLine,
    toggleDrawingLine,
    saveState,
    loadState,
  } = useOrganigram();

  const [searchTerm, setSearchTerm] = useState('');
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const handleBoxSelect = (id: string) => {
    if (isDrawingLine) {
      if (selectedBoxId && selectedBoxId !== id) {
        toggleLine(selectedBoxId, id);
        setSelectedBoxId(null);
      } else {
        setSelectedBoxId(id);
      }
    }
  };

  const handleBoxMove = (id: string, x: number, y: number) => {
    updateBox(id, { x, y });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 5));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
  };

  return (
    <div className="relative h-screen dark bg-gray-900">
      <div className="absolute inset-0">
        <Organigram
          boxes={boxes}
          lines={lines}
          isDrawingLine={isDrawingLine}
          onBoxSelect={handleBoxSelect}
          onBoxMove={handleBoxMove}
          onLineToggle={toggleLine}
          searchTerm={searchTerm}
          scale={scale}
          setScale={setScale}
          translate={translate}
          setTranslate={setTranslate}
        />
      </div>
      <Sidebar
        onAddBox={addBox}
        onSave={saveState}
        onLoad={loadState}
        onToggleDrawingLine={toggleDrawingLine}
        isDrawingLine={isDrawingLine}
        onSearch={handleSearch}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
};

export default App;

