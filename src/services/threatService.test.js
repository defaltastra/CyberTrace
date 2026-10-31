import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';

const SNAPSHOT = JSON.parse(
  readFileSync(new URL('../../public/data/cisa_kev_snapshot.json', import.meta.url), 'utf8')
);

const DEV_URL = '/api/cisa';
const OFFICIAL_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const SNAPSHOT_URL = '/data/cisa_kev_snapshot.json';

const ok = (body) => ({ ok: true, json: async () => body });

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('bundled CISA snapshot', () => {
  it('holds exactly the mapped window, newest first', () => {
    expect(SNAPSHOT.vulnerabilities).toHaveLength(140);
    expect(SNAPSHOT.count).toBe(140);
    const dates = SNAPSHOT.vulnerabilities.map((v) => new Date(v.dateAdded).getTime());
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });
});

describe('fetchLiveThreats', () => {
  it('falls back to the snapshot when both live feeds fail', async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url === SNAPSHOT_URL) return ok(SNAPSHOT);
      throw new Error('offline');
    });
    vi.stubGlobal('fetch', fetchMock);

    const { fetchLiveThreats } = await import('./threatService');
    const { threats } = await fetchLiveThreats({ maxItems: 5 });

    const real = threats.filter((t) => t.isReal);
    expect(real).toHaveLength(5);
    expect(real.every((t) => t.dataSource === 'CISA KEV (Live Gov Feed)')).toBe(true);
    expect(threats.length).toBeGreaterThan(real.length);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([DEV_URL, OFFICIAL_URL, SNAPSHOT_URL]);
  });

  it('sorts newest first even when the feed is unsorted', async () => {
    const shuffled = [...SNAPSHOT.vulnerabilities].reverse();
    vi.stubGlobal('fetch', vi.fn(async (url) => ok(url === DEV_URL ? { ...SNAPSHOT, vulnerabilities: shuffled } : SNAPSHOT)));

    const { fetchLiveThreats } = await import('./threatService');
    const { threats } = await fetchLiveThreats({ maxItems: 3 });

    const newest = Math.max(...shuffled.map((v) => new Date(v.dateAdded).getTime()));
    expect(new Date(threats[0].timestamp).getTime()).toBe(newest);
  });

  it('caches the first result instead of refetching', async () => {
    const fetchMock = vi.fn(async () => ok(SNAPSHOT));
    vi.stubGlobal('fetch', fetchMock);

    const { fetchLiveThreats } = await import('./threatService');
    const first = await fetchLiveThreats({ maxItems: 3 });
    const second = await fetchLiveThreats({ maxItems: 3 });

    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
