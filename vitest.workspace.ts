/**
 * Vitest Workspace Configuration
 * 
 * Groups all package test configurations to avoid VSCode extension limit (5 projects).
 * Each package can still have its own vite.config.ts for building.
 */
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Core packages (no UI dependencies)
  'packages/core',
  'packages/media',
  
  // UI packages (React dependencies)
  'packages/ui',
  'packages/audio',
  'packages/canvas',
  'packages/timeline',
  'packages/studio',
  
  // Examples app (not typically tested in workspace)
  // 'packages/examples',
]);
