import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ── Response DTOs ──────────────────────────────────────────────────────────

export interface IDashboardKpis {
  totalPeople: number;
  totalActiveUsers: number;
  totalDrivers: number;
  totalActiveLicenses: number;
  totalExpiredLicenses: number;
  totalActiveIntlLicenses: number;
  totalApplications: number;
  applicationsThisMonth: number;
  totalTestsTaken: number;
  totalTestsPassed: number;
  currentlyDetained: number;
  totalFineFeesCollected: number;
  totalFeesCollected: number;
  feesCollectedThisMonth: number;
}

export interface IApplicationByType {
  applicationTypeId: number;
  applicationTypeTitle: string;
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  totalFees: number;
}

export interface IApplicationByStatus {
  status: number;
  statusLabel: string;
  count: number;
}

export interface IMonthlyTrend {
  year: number;
  month: number;
  yearMonth: string;
  totalApplications: number;
  completed: number;
  totalFees: number;
}

export interface ITestPassRate {
  testTypeId: number;
  testTypeTitle: string;
  total: number;
  passed: number;
  failed: number;
  passRatePct: number;
}

export interface ILicenseByClass {
  licenseClassId: number;
  className: string;
  total: number;
  active: number;
  totalFees: number;
}

export interface ILicenseByIssueReason {
  issueReason: number;
  issueReasonLabel: string;
  count: number;
  totalFees: number;
}

export interface IDetainStats {
  total: number;
  currentlyDetained: number;
  released: number;
  totalFines: number;
  collectedFines: number;
  pendingFines: number;
}

export interface IDashboardData {
  kpis: IDashboardKpis;
  applicationsByType: IApplicationByType[];
  applicationsByStatus: IApplicationByStatus[];
  monthlyTrend: IMonthlyTrend[];
  testPassRates: ITestPassRate[];
  licensesByClass: ILicenseByClass[];
  licensesByIssueReason: ILicenseByIssueReason[];
  detainStats: IDetainStats;
}

// ── API ────────────────────────────────────────────────────────────────────

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<IDashboardData, void>({
      query: () => "Dashboard",
      transformResponse: (response: IGenericApiResponse<IDashboardData>) =>
        response.data!,
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
