import React, { useState, useRef, useEffect } from 'react';
import { Box, Line } from '../types/organigram';

interface OrganigramProps {
  boxes: Box[];
  lines: Line[];
  isDrawingLine: boolean;
  onBoxSelect: (id: string) => void;
  onBoxMove: (id: string, x: number, y: number) => void;
  onLineToggle: (from: string, to: string) => void;
  searchTerm: string;
  scale: number;
  setScale: (scale: number | ((prev: number) => number)) => void;
  translate: { x: number; y: number };
  setTranslate: (translate: { x: number; y: number }) => void;
}

const Organigram: React.FC<OrganigramProps> = ({
  boxes,
  lines,
  isDrawingLine,
  onBoxSelect,
  onBoxMove,
  onLineToggle,
  searchTerm,
  scale,
  setScale,
  translate,
  setTranslate,
}) => {
  const [draggedBox, setDraggedBox] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY;
        setScale((prevScale) => Math.max(0.1, Math.min(prevScale - delta * 0.001, 5)));
      }
    };

    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (svg) {
        svg.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<SVGRectElement>, id: string) => {
    if (isDrawingLine) {
      onBoxSelect(id);
    } else {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const mouseX = (e.clientX - svgRect.left - translate.x) / scale;
        const mouseY = (e.clientY - svgRect.top - translate.y) / scale;
        setDraggedBox(id);
        const box = boxes.find((b) => b.id === id);
        if (box) {
          setDragOffset({
            x: mouseX - box.x,
            y: mouseY - box.y
          });
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggedBox) {
      const svgRect = e.currentTarget.getBoundingClientRect();
      const mouseX = (e.clientX - svgRect.left - translate.x) / scale;
      const mouseY = (e.clientY - svgRect.top - translate.y) / scale;
      onBoxMove(draggedBox, mouseX - dragOffset.x, mouseY - dragOffset.y);
    } else if (isDragging) {
      setTranslate({
        x: translate.x + (e.clientX - dragStart.x),
        y: translate.y + (e.clientY - dragStart.y),
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggedBox(null);
    setIsDragging(false);
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedBox && e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const renderLine = (line: Line) => {
    const fromBox = boxes.find((box) => box.id === line.from);
    const toBox = boxes.find((box) => box.id === line.to);
    if (!fromBox || !toBox) return null;

    return (
      <g key={line.id}>
        <line
          x1={fromBox.x + 75}
          y1={fromBox.y + 75}
          x2={toBox.x + 75}
          y2={toBox.y + 75}
          stroke="#94a3b8" // slate-400 for better visibility in dark mode
          strokeWidth={2 / scale}
          onClick={() => onLineToggle(line.from, line.to)}
          style={{ cursor: 'pointer' }}
        />
      </g>
    );
  };

  const isBoxHighlighted = (box: Box) => {
    return searchTerm && (
      box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleSvgMouseDown}
      className="bg-gray-900"
    >
      <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
        {lines.map(renderLine)}
        {boxes.map((box) => (
          <g key={box.id}>
            <rect
              x={box.x}
              y={box.y}
              width={150}
              height={150}
              fill={isBoxHighlighted(box) ? "#fbbf24" : "#1f2937"} // amber-400 for highlight, gray-800 for normal
              stroke="#475569" // slate-600
              strokeWidth={2 / scale}
              onClick={() => onBoxSelect(box.id)}
              onMouseDown={(e) => handleMouseDown(e, box.id)}
              style={{ cursor: isDrawingLine ? 'crosshair' : 'move' }}
              className="shadow-lg"
            />
            <line
              x1={box.x}
              y1={box.y + 100}
              x2={box.x + 150}
              y2={box.y + 100}
              stroke="#475569" // slate-600
              strokeWidth={1 / scale}
            />
            <text
              x={box.x + 75}
              y={box.y + 30}
              textAnchor="middle"
              fontSize={16 / scale}
              fontWeight="bold"
              fill="#e2e8f0" // slate-200
            >
              {box.name}
            </text>
            <text
              x={box.x + 75}
              y={box.y + 60}
              textAnchor="middle"
              fontSize={14 / scale}
              fill="#cbd5e1" // slate-300
            >
              {box.company}
            </text>
            <text
              x={box.x + 75}
              y={box.y + 130}
              textAnchor="middle"
              fontSize={14 / scale}
              fontStyle="italic"
              fill="#94a3b8" // slate-400
            >
              {box.position}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default Organigram;

