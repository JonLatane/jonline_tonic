import { isClient } from 'tamagui'
import { config } from './tamagui.config'

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf { }
}

export default config

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator?.userAgent ?? '');
}

export function needsScrollPreservers(): boolean {
  return true;

  // if (!isClient) return false;

  // if (!isSafari()) return false;

  // const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  // const result = ['back_forward', 'reload'].includes(nav.type);
  // // console.log(`NavigationType=${nav.type}, needsScrollPreservers=${result}`);
  // return result;
}

export function dismissScrollPreserver(setShowScrollPreserver: (show: boolean) => void) {
  setTimeout(() => setShowScrollPreserver(false), 100);
}