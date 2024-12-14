import React, { useState } from 'react';
import { Box } from '../types/organigram';
import { ChevronRight, ChevronLeft, Search, ZoomIn, ZoomOut } from 'lucide-react';

interface SidebarProps {
  onAddBox: (box: Box) => void;
  onSave: () => string;
  onLoad: (hash: string) => void;
  onToggleDrawingLine: () => void;
  isDrawingLine: boolean;
  onSearch: (term: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddBox,
  onSave,
  onLoad,
  onToggleDrawingLine,
  isDrawingLine,
  onSearch,
  onZoomIn,
  onZoomOut,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [hash, setHash] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddBox = () => {
    if (name && company && position) {
      onAddBox({
        id: Date.now().toString(),
        name,
        company,
        position,
        x: Math.random() * (window.innerWidth - 250 - 150),
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-gray-800 shadow-xl transition-all duration-300 ${isOpen ? 'w-64' : 'w-12'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-8 top-4 p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-full shadow-md hover:bg-gray-600 transition-colors"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 overflow-y-auto h-full text-gray-200">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Search size={20} className="mr-2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-between gap-2 mb-4">
              <button
                onClick={onZoomIn}
                className="flex items-center justify-center flex-1 p-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={onZoomOut}
                className="flex items-center justify-center flex-1 p-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-200">Add New Box</h2>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
              className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position"
              className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddBox}
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Box
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-200">Draw Lines</h2>
          <div className="mb-4">
            <button
              onClick={onToggleDrawingLine}
              className={`w-full p-2 ${
                isDrawingLine ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white rounded transition-colors`}
            >
              {isDrawingLine ? 'Stop Drawing' : 'Start Drawing'}
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-200">Save/Load</h2>
          <div className="mb-4">
            <button
              onClick={handleSave}
              className="w-full p-2 mb-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Enter hash"
              className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleLoad}
              className="w-full p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Load
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

