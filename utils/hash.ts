import { Box, Line } from '../types/organigram';

export function generateHash(boxes: Box[], lines: Line[]): string {
  const state = { boxes, lines };
  return btoa(JSON.stringify(state));
}

export function parseHash(hash: string): { boxes: Box[], lines: Line[] } {
  try {
    const state = JSON.parse(atob(hash));
    return state;
  } catch (error) {
    console.error('Invalid hash:', error);
    return { boxes: [], lines: [] };
  }
}

