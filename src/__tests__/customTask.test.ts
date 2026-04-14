import { execFileSync } from 'node:child_process';

function computeChecksum(data: string): number {
  let checksum = 0;
  for (let i = 0; i < data.length; i++) {
    checksum = (checksum + data.charCodeAt(i)) % 100000;
  }
  return checksum;
}

describe('custom scheduled task script', () => {
  const FAKE_NOW = '2025-01-02T03:04:05.000Z';

  it('emits valid JSON with deterministic checksum when FAKE_NOW is set', () => {
    const env = { ...process.env, FAKE_NOW };
    const stdout = execFileSync('node', ['scripts/custom-task.js'], { encoding: 'utf8', env });

    const lastLine = stdout.trim().split(/\r?\n/).pop() as string;
    expect(lastLine).toBeTruthy();

    const obj = JSON.parse(lastLine);

    // Basic shape assertions
    expect(obj.task).toBe('custom-scheduled-task');
    expect(typeof obj.package).toBe('string');
    expect(obj.package.length).toBeGreaterThan(0);
    expect(typeof obj.node).toBe('string');
    expect(/^v\d+\./.test(obj.node)).toBe(true);

    // Deterministic date when FAKE_NOW provided
    const expectedIso = new Date(FAKE_NOW).toISOString();
    expect(obj.date).toBe(expectedIso);

    // Checksum computed from package name and date-only string
    const dateOnly = expectedIso.split('T')[0];
    const data = `${obj.package}:${dateOnly}`;
    const expectedChecksum = computeChecksum(data);
    expect(obj.checksum).toBe(expectedChecksum);
  });
});
