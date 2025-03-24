import { formatHours, formatDuration, calculateTotalDuration } from './format';

describe('formatHours', () => {
  it('converts minutes to hours with one decimal place', () => {
    expect(formatHours(60)).toBe('1.0');
    expect(formatHours(90)).toBe('1.5');
    expect(formatHours(30)).toBe('0.5');
    expect(formatHours(120)).toBe('2.0');
    expect(formatHours(0)).toBe('0.0');
  });
});

describe('formatDuration', () => {
  it('formats durations less than an hour', () => {
    expect(formatDuration(30)).toBe('30m');
    expect(formatDuration(1)).toBe('1m');
    expect(formatDuration(0)).toBe('0m');
  });

  it('formats durations of exact hours', () => {
    expect(formatDuration(60)).toBe('1h ');
    expect(formatDuration(120)).toBe('2h ');
    expect(formatDuration(180)).toBe('3h ');
  });

  it('formats mixed hour and minute durations', () => {
    expect(formatDuration(90)).toBe('1h 30m');
    expect(formatDuration(65)).toBe('1h 5m');
    expect(formatDuration(122)).toBe('2h 2m');
  });
});

describe('calculateTotalDuration', () => {
  it('returns 0 for empty array', () => {
    expect(calculateTotalDuration([])).toBe(0);
  });

  it('calculates total duration from an array of workouts', () => {
    const workouts = [{ duration: 60 }, { duration: 90 }, { duration: 30 }];
    expect(calculateTotalDuration(workouts)).toBe(180);
  });

  it('handles array with a single workout', () => {
    const workouts = [{ duration: 45 }];
    expect(calculateTotalDuration(workouts)).toBe(45);
  });
});
