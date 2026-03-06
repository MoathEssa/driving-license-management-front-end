// Pages
export { PeoplePage } from "./pages/PeoplePage";

// Components
export { AddPersonDialog } from "./components/AddPersonDialog";
export { EditPersonDialog } from "./components/EditPersonDialog";
export { DeletePersonDialog } from "./components/DeletePersonDialog";
export { PersonForm } from "./components/PersonForm";
export { PersonInfoCard } from "./components/PersonInfoCard";
export { PersonLookupTab } from "./components/PersonLookupTab";
export { usePeopleColumns } from "./components/columns";

// Store / API
export {
  peopleApi,
  useGetAllPersonsQuery,
  useGetPersonByIdQuery,
  useLazyGetPersonByNationalNoQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
  type IPerson,
  type IPersonWithUserStatus,
  type ICreatePersonRequest,
  type IUpdatePersonRequest,
} from "./store/peopleApi";

// Schemas
export {
  personFormSchema,
  personFormDefaultValues,
  type TPersonFormSchema,
} from "./schemas/personSchema";

// i18n
export { peopleEn, peopleAr } from "./i18n";
