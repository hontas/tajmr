declare namespace NodeJS {
  interface ProcessEnv {
    BUILD_TIME: string;
    RELEASE: string;
    SENTRY_DSN?: string;
  }
}

declare module 'virtual:pwa-register' {
  export function registerSW(options?: {
    onNeedRefresh?: () => void;
    onNeedReload?: () => void;
    onRegisteredSW?: (url: string, registration?: ServiceWorkerRegistration) => void;
  }): (reloadPage?: boolean) => Promise<void>;
}
