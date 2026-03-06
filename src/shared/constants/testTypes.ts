/**
 * Well-known test type IDs — must match the seeded data in TestTypes table.
 */
export const TestType = {
  Vision: 1,
  Written: 2,
  Practical: 3,
} as const;

export type TestTypeValue = (typeof TestType)[keyof typeof TestType];
