import { getChannels, getTraffic } from './data';

describe('analytics data', () => {
  it('returns one point per day in the range', () => {
    expect(getTraffic('7d')).toHaveLength(7);
    expect(getTraffic('90d')).toHaveLength(90);
  });

  it('is deterministic for the same range', () => {
    expect(getTraffic('30d')).toEqual(getTraffic('30d'));
  });

  it('scales channel visits with the range', () => {
    expect(getChannels('30d')[0]?.visits).toBeCloseTo((getChannels('7d')[0]!.visits / 7) * 30);
  });
});
