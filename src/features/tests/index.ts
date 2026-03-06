// Pages
export { TestTypesPage } from "./pages/TestTypesPage";

// TestTypes sub-module
export { useTestTypesColumns } from "./testTypes/components/columns";
export { EditTestTypeDialog } from "./testTypes/components/EditTestTypeDialog";
export {
  testTypesApi,
  useGetAllTestTypesQuery,
  useUpdateTestTypeMutation,
  type ITestType,
  type IUpdateTestTypeRequest,
} from "./store/testTypesApi";
export {
  testTypeSchema,
  type TTestTypeSchema,
} from "./testTypes/schemas/testTypeSchema";

// TestAppointments sub-module
export { TestAppointmentsDialog } from "./testAppointments/components/TestAppointmentsDialog";
export { ScheduleTestDialog } from "./testAppointments/components/ScheduleTestDialog";
export { TakeTestDialog } from "./testAppointments/components/TakeTestDialog";
export {
  testAppointmentsApi,
  useGetLdlaDetailsQuery,
  useGetTestAppointmentsByTypeQuery,
  useScheduleTestAppointmentMutation,
  useTakeTestMutation,
  type ILdlaDetails,
  type ITestAppointment,
  type IScheduleTestAppointmentRequest,
  type IScheduleTestAppointmentResponse,
  type ITakeTestRequest,
  type ITakeTestResponse,
} from "./store/testAppointmentsApi";

// i18n
export { testsEn, testsAr } from "./i18n";
