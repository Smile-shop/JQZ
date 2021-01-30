import { env } from '@/config/index';

export function getEnv() {
  const { host } =  new URL(window.VUE_APP_BASE_API);

  for (const [key, value] of Object.entries(env)) {
    if (host === value.host) {
      return value;
    }
  }

  return env.production;
}
