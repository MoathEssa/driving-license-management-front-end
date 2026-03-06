/**
 * Generic API response wrapper matching backend ApiResponse<T>
 */
export interface IGenericApiResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: T;
  meta: unknown;
}

/**
 * Gender type matching backend (1=Male, 2=Female)
 * Using const as pattern for erasableSyntaxOnly compatibility
 */
export const Gender = {
  Male: 1,
  Female: 2,
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

/**
 * User-friendly label map for gender
 */
export const GenderLabels: Record<Gender, string> = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
};

/**
 * Get gender label with i18n namespace prefix
 */
export function getGenderI18nKey(gender: Gender): string {
  return gender === Gender.Male ? "auth.register.male" : "auth.register.female";
}
