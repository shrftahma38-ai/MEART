/** Tiny class-name joiner (avoids pulling in a dependency for this). */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
