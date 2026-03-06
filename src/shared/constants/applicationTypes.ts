/**
 * Well-known application type IDs — must match the seeded data in ApplicationTypes table.
 */
export const ApplicationType = {
  NewLocalDrivingLicense: 1,
  RenewDrivingLicense: 2,
  ReplacementLicense: 3,
  ReleaseDetainedLicense: 4,
  DrivingTest: 5,
  NewInternationalLicense: 6,
  RetakeTest: 7,
} as const;

export type ApplicationTypeValue =
  (typeof ApplicationType)[keyof typeof ApplicationType];
