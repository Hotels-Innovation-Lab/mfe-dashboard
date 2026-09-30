// RTL auto-registers `cleanup` because `globals: true` exposes `afterEach`.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});
