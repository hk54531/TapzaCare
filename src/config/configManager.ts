import { festivalConfig } from './festivalConfig';
import { normalConfig } from './normalConfig';
import { validateConfig } from './configSchema';
import type { LayoutConfig } from '../types/config';

export type ConfigMode = 'normal' | 'festival';

let lastGoodConfig: LayoutConfig = normalConfig;

export function getConfig(mode: ConfigMode = 'normal'): LayoutConfig {
  const candidate = mode === 'festival' ? festivalConfig : normalConfig;

  if (validateConfig(candidate)) {
    lastGoodConfig = candidate;
  }

  return lastGoodConfig;
}

export function getLastGoodConfig(): LayoutConfig {
  return lastGoodConfig;
}

export function setLastGoodConfig(value: unknown): LayoutConfig {
  if (validateConfig(value)) {
    lastGoodConfig = value;
  }

  return lastGoodConfig;
}
