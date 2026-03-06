// Pages
export { DriversPage } from "./pages/DriversPage";
export { RenewLicensePage } from "./pages/RenewLicensePage";
export { ReplaceLicensePage } from "./pages/ReplaceLicensePage";
export { DetainLicensePage } from "./pages/DetainLicensePage";
export { DetainedLicensesManagePage } from "./pages/DetainedLicensesManagePage";

// Components
export { IssueLicenseDialog } from "./components/IssueLicenseDialog";
export { LicenseDetailsDialog } from "./components/LicenseDetailsDialog";
export { LicenseInfoCard } from "./components/LicenseInfoCard";
export { RenewalPreviewCard } from "./components/RenewalPreviewCard";
export { ReplacementPreviewCard } from "./components/ReplacementPreviewCard";
export { DriverLicensesDialog } from "./components/DriverLicensesDialog";
export { PersonHistoryDialog } from "./components/PersonHistoryDialog";
export { DetainPreviewCard } from "./components/DetainPreviewCard";
export { ReleaseDetainedDialog } from "./components/ReleaseDetainedDialog";

// Store
export {
  driverApi,
  useGetAllDriversQuery,
  useGetDriverLicensesQuery,
  useGetLicenseByIdQuery,
  useLazyGetLicenseByIdQuery,
  useGetLicenseByApplicationIdQuery,
  useIssueLicenseFirstTimeMutation,
  useGetLicensesByPersonIdQuery,
  type IDriver,
  type IDriverLicense,
  type ILicenseDetails,
  type IIssueLicenseRequest,
  type IIssueLicenseResponse,
} from "./store/driverApi";

export {
  renewalApi,
  useGetRenewalPreviewQuery,
  useRenewLicenseMutation,
  type IRenewLicensePreview,
  type IRenewLicenseResponse,
} from "./store/renewalApi";

export {
  replacementApi,
  useGetReplacementPreviewQuery,
  useReplaceLicenseMutation,
  type IReplaceLicensePreview,
  type IReplaceLicenseResponse,
  type IReplaceLicenseRequest,
} from "./store/replacementApi";

export {
  detainedLicenseApi,
  useGetAllDetainedLicensesQuery,
  useGetDetainPreviewQuery,
  useDetainLicenseMutation,
  useReleaseLicenseMutation,
  type IDetainLicensePreview,
  type IDetainedLicenseView,
  type IDetainLicenseRequest,
  type IDetainLicenseResponse,
  type IReleaseLicenseRequest,
  type IReleaseLicenseResponse,
} from "./store/detainedLicenseApi";

// i18n
export { driversEn, driversAr } from "./i18n";
