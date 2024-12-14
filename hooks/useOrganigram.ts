import { useState, useCallback } from 'react';
import { Box, Line } from '../types/organigram';
import { generateHash, parseHash } from '../utils/hash';

export function useOrganigram() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false);

  const addBox = useCallback((box: Box) => {
    setBoxes((prevBoxes) => [...prevBoxes, box]);
  }, []);

  const updateBox = useCallback((id: string, updates: Partial<Box>) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, ...updates } : box))
    );
  }, []);

  const removeBox = useCallback((id: string) => {
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
    setLines((prevLines) =>
      prevLines.filter((line) => line.from !== id && line.to !== id)
    );
  }, []);

  const toggleLine = useCallback((from: string, to: string) => {
    setLines((prevLines) => {
      const existingLineIndex = prevLines.findIndex(
        (line) => (line.from === from && line.to === to) || (line.from === to && line.to === from)
      );
      if (existingLineIndex !== -1) {
        // Remove the line if it exists
        return prevLines.filter((_, index) => index !== existingLineIndex);
      } else {
        // Add the line if it doesn't exist
        return [...prevLines, { id: `${from}-${to}`, from, to }];
      }
    });
  }, []);

  const toggleDrawingLine = useCallback(() => {
    setIsDrawingLine((prev) => !prev);
    setSelectedBoxId(null);
  }, []);

  const saveState = useCallback(() => {
    return generateHash(boxes, lines);
  }, [boxes, lines]);

  const loadState = useCallback((hash: string) => {
    const { boxes: loadedBoxes, lines: loadedLines } = parseHash(hash);
    setBoxes(loadedBoxes);
    setLines(loadedLines);
  }, []);

  return {
    boxes,
    lines,
    selectedBoxId,
    isDrawingLine,
    setSelectedBoxId,
    addBox,
    updateBox,
    removeBox,
    toggleLine,
    toggleDrawingLine,
    saveState,
    loadState,
  };
}

