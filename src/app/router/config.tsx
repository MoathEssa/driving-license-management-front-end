import { createBrowserRouter, type RouteObject } from "react-router-dom";
import ApplicationLayout from "@shared/components/layout/ApplicationLayout";
import {
  LoginPage,
  RegisterPage,
  ForbiddenPage,
  SetPasswordPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "@features/auth";
import { PeoplePage } from "@features/people";
import { UsersPage } from "@features/users/pages/UsersPage";
import {
  ApplicationTypesPage,
  LocalDrivingLicenseApplicationsPage,
} from "@features/applications";
import { TestTypesPage } from "@features/tests";
import { DriversPage } from "@features/drivers";
import { RenewLicensePage } from "@features/drivers";
import { ReplaceLicensePage } from "@features/drivers";
import { DetainLicensePage } from "@features/drivers";
import { DetainedLicensesManagePage } from "@features/drivers";
import { AccountSettingsPage } from "@features/auth";
import { DashboardPage } from "@features/dashboard";
import {
  InternationalLicenseApplicationPage,
  InternationalLicenseManagePage,
} from "@features/international";
import { GuestGuard } from "./guards";

const routes: RouteObject[] = [
  // Auth routes (no layout wrapper)
  {
    path: "/auth/sign-in",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
  {
    path: "/auth/forbidden",
    element: <ForbiddenPage />,
  },
  {
    path: "/auth/set-password",
    element: <SetPasswordPage />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPasswordPage />,
  },

  // Protected routes (wrapped in ApplicationLayout which includes AuthGuard)
  {
    path: "/",
    element: <ApplicationLayout />,
    children: [
      {
        path: "applications/local",
        element: <LocalDrivingLicenseApplicationsPage />,
      },
      {
        path: "applications/manage/local",
        element: <LocalDrivingLicenseApplicationsPage />,
      },
      {
        path: "applications/international",
        element: <InternationalLicenseApplicationPage />,
      },
      {
        path: "applications/manage/international",
        element: <InternationalLicenseManagePage />,
      },
      {
        path: "people",
        element: <PeoplePage />,
      },
      {
        path: "admin/users",
        element: <UsersPage />,
      },
      {
        path: "admin/applications/types",
        element: <ApplicationTypesPage />,
      },
      {
        path: "admin/tests/types",
        element: <TestTypesPage />,
      },
      {
        path: "drivers",
        element: <DriversPage />,
      },
      {
        path: "applications/renew",
        element: <RenewLicensePage />,
      },
      {
        path: "applications/replacement",
        element: <ReplaceLicensePage />,
      },
      {
        path: "applications/detain",
        element: <DetainLicensePage />,
      },
      {
        path: "applications/release-detained",
        element: <DetainedLicensesManagePage />,
      },
      {
        path: "account/settings",
        element: <AccountSettingsPage />,
      },
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "*",
        element: (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="text-muted-foreground mt-2">Page not found</p>
          </div>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
