import { getConfig, type ConfigMode } from '../../config/configManager';
import { simulateRequest } from './mockSettings';
import type { LayoutConfig } from '../../types/config';

export async function getMockConfig(
  mode: ConfigMode = 'normal',
): Promise<LayoutConfig> {
  await simulateRequest();
  return getConfig(mode);
}
