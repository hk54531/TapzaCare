
import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {normalDayConfig} from '../config/normalDayConfig';
import {festivalDayConfig} from '../config/festivalDayConfig';
import type {LayoutConfig} from '../types/config';

const CONFIG_CACHE_KEY = '@tapzacare/last-good-config';

export type ConfigMode = 'normal' | 'festival';

type UseConfigResult = {
  config: LayoutConfig;
  mode: ConfigMode;
  loading: boolean;
  error: string | null;
  switchMode: (nextMode: ConfigMode) => Promise<void>;
  retry: () => Promise<void>;
};

async function fetchConfig(mode: ConfigMode): Promise<LayoutConfig> {
  // Mock GET /config. Replace with the API client when wiring the backend.
  await new Promise<void>(resolve => setTimeout(resolve, 400));

  return mode === 'festival' ? festivalDayConfig : normalDayConfig;
}

export function useConfig(): UseConfigResult {
  const [config, setConfig] = useState<LayoutConfig>(normalDayConfig);
  const [mode, setMode] = useState<ConfigMode>('normal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async (nextMode: ConfigMode) => {
    setLoading(true);
    setError(null);

    try {
      const cached = await AsyncStorage.getItem(CONFIG_CACHE_KEY);

      if (cached) {
        try {
          const parsed = JSON.parse(cached) as LayoutConfig;
          if (parsed.version && parsed.theme && Array.isArray(parsed.sections)) {
            setConfig(parsed);
          }
        } catch {
          // Ignore an invalid cache and continue with the mock config.
        }
      }

      const freshConfig = await fetchConfig(nextMode);

      setConfig(freshConfig);
      setMode(nextMode);

      await AsyncStorage.setItem(
        CONFIG_CACHE_KEY,
        JSON.stringify(freshConfig),
      );
    } catch {
      setError('Unable to refresh configuration. Showing saved settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfig('normal');
  }, [loadConfig]);

  const switchMode = useCallback(
    async (nextMode: ConfigMode) => {
      await loadConfig(nextMode);
    },
    [loadConfig],
  );

  const retry = useCallback(async () => {
    await loadConfig(mode);
  }, [loadConfig, mode]);

  return {config, mode, loading, error, switchMode, retry};
}
