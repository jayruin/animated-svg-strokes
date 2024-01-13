let counter = 0;

export const getUniqueId = (): string => `timestamp${performance.timeOrigin + performance.now()}counter${++counter}`;
