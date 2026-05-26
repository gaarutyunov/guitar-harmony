export function longestCommonContiguous(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  let max = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let len = 0;
      while (
        i + len < a.length &&
        j + len < b.length &&
        a[i + len] === b[j + len]
      ) {
        len++;
      }
      if (len > max) max = len;
    }
  }
  return max;
}
