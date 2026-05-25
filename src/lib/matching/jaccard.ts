export function jaccardMultiset(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;

  const countA = new Map<string, number>();
  const countB = new Map<string, number>();

  for (const x of a) countA.set(x, (countA.get(x) ?? 0) + 1);
  for (const x of b) countB.set(x, (countB.get(x) ?? 0) + 1);

  let intersection = 0;
  let union = 0;

  const allKeys = new Set<string>();
  countA.forEach((_, k) => allKeys.add(k));
  countB.forEach((_, k) => allKeys.add(k));

  allKeys.forEach((key) => {
    const ca = countA.get(key) ?? 0;
    const cb = countB.get(key) ?? 0;
    intersection += Math.min(ca, cb);
    union += Math.max(ca, cb);
  });

  return union === 0 ? 0 : intersection / union;
}
