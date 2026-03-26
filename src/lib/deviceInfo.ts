export interface DeviceInfo {
  platform: string;
  language: string;
  timezone: string;
  screen: {
    width: number;
    height: number;
  };
  viewport: {
    width: number;
    height: number;
  };
}

export const getDeviceInfo = (): DeviceInfo => {
  return {
    platform: navigator.platform || "unknown",
    language: navigator.language || "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
};
