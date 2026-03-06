// Pages
export { ApplicationTypesPage } from "./pages/ApplicationTypesPage";
export { LocalDrivingLicenseApplicationsPage } from "./localDrivingLicense/pages/LocalDrivingLicenseApplicationsPage";

// ApplicationTypes sub-module
export { useApplicationTypesColumns } from "./applicationTypes/components/columns";
export { EditApplicationTypeDialog } from "./applicationTypes/components/EditApplicationTypeDialog";
export {
  applicationTypesApi,
  useGetAllApplicationTypesQuery,
  useUpdateApplicationTypeMutation,
  type IApplicationType,
  type IUpdateApplicationTypeRequest,
} from "./store/applicationTypesApi";
export {
  applicationTypeSchema,
  type TApplicationTypeSchema,
} from "./applicationTypes/schemas/applicationTypeSchema";

// i18n
export { applicationsEn, applicationsAr } from "./i18n";

// LocalDrivingLicense sub-module
export {
  localDrivingLicenseApi,
  useGetLicenseClassesQuery,
  useGetLocalDrivingLicenseApplicationsQuery,
  useCreateLocalDrivingLicenseApplicationMutation,
  useCancelLocalDrivingLicenseApplicationMutation,

  type ILicenseClass,
  type ILocalDrivingLicenseApplicationView,
  type ICreateLocalDrivingLicenseApplicationRequest,
  type ICreateLocalDrivingLicenseApplicationResponse,

} from "./localDrivingLicense/store/localDrivingLicenseApi";
export { useLocalDrivingLicenseColumns } from "./localDrivingLicense/components/columns";
export { NewLocalLicenseDialog } from "./localDrivingLicense/components/NewLocalLicenseDialog";
