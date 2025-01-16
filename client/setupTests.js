import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polifill dla TextEncoder i TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
