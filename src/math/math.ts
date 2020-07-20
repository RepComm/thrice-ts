
export function lerp (from: number, to: number, by: number): number {
  return from*(1-by)+to*by;
}

export const EPSILON = 0.00001;
