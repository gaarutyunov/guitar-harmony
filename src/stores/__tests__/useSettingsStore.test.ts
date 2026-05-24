import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/stores/useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      locale: 'es',
      showFingering: true,
      mode: 'major',
      selectedKey: null,
    });
  });

  it('starts with default values', () => {
    const state = useSettingsStore.getState();
    expect(state.locale).toBe('es');
    expect(state.showFingering).toBe(true);
    expect(state.mode).toBe('major');
    expect(state.selectedKey).toBeNull();
  });

  it('sets locale', () => {
    useSettingsStore.getState().setLocale('en');
    expect(useSettingsStore.getState().locale).toBe('en');
  });

  it('toggles fingering', () => {
    useSettingsStore.getState().toggleFingering();
    expect(useSettingsStore.getState().showFingering).toBe(false);
    useSettingsStore.getState().toggleFingering();
    expect(useSettingsStore.getState().showFingering).toBe(true);
  });

  it('sets mode', () => {
    useSettingsStore.getState().setMode('minor');
    expect(useSettingsStore.getState().mode).toBe('minor');
  });

  it('sets selected key', () => {
    useSettingsStore.getState().setSelectedKey('C');
    expect(useSettingsStore.getState().selectedKey).toBe('C');
    useSettingsStore.getState().setSelectedKey(null);
    expect(useSettingsStore.getState().selectedKey).toBeNull();
  });
});
