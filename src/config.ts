export const isDev = typeof window === 'undefined' ? false : location.hostname.includes('localhost')
