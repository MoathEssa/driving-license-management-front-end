import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui/tabs";
import { User } from "lucide-react";
import { useGetPersonByNationalNoQuery } from "@features/people/store/peopleApi";
import { useGetLicensesByPersonIdQuery } from "../store/driverApi";
import { useGetInternationalLicensesByDriverIdQuery } from "@features/international/store/internationalLicenseApi";

interface PersonHistoryDialogProps {
  nationalNo: string | null;
  personName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverId?: number | null;
}

const ISSUE_REASON_KEYS: Record<number, string> = {
  1: "drivers.licenseDetails.issueReasons.firstTime",
  2: "drivers.licenseDetails.issueReasons.renewal",
  3: "drivers.licenseDetails.issueReasons.replacementDamaged",
  4: "drivers.licenseDetails.issueReasons.replacementLost",
};

const GENDER_KEYS: Record<number, string> = {
  1: "drivers.licenseDetails.genders.male",
  2: "drivers.licenseDetails.genders.female",
};

export function PersonHistoryDialog({
  nationalNo,
  personName,
  open,
  onOpenChange,
  driverId,
}: PersonHistoryDialogProps) {
  const { t } = useTranslation();

  // Step 1: get person details (includes photo + personId)
  const { data: personData, isLoading: personLoading } =
    useGetPersonByNationalNoQuery(nationalNo!, {
      skip: !open || !nationalNo,
    });

  const person = personData?.data;

  // Step 2: get all licenses for that person (uses personId from step 1)
  const { data: licensesData, isLoading: licensesLoading } =
    useGetLicensesByPersonIdQuery(person?.personId ?? 0, {
      skip: !person?.personId,
    });

  const licenses = licensesData?.data ?? [];

  // Step 3: international licenses (only when driverId provided)
  const { data: intlData, isLoading: intlLoading } =
    useGetInternationalLicensesByDriverIdQuery(driverId ?? 0, {
      skip: !open || !driverId,
    });
  const intlLicenses = intlData?.data ?? [];

  const isLoading = personLoading || licensesLoading;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="max-h-[92vh] flex flex-col gap-0 p-0 overflow-hidden"
      >
        <DialogHeader className="px-6 pt-5 pb-3">
          <DialogTitle>
            {t("drivers.personHistory.title", { name: personName })}
          </DialogTitle>
        </DialogHeader>

        {!nationalNo ? (
          <div className="px-6 pb-6 py-10 text-center text-muted-foreground text-sm">
            {t("drivers.personHistory.noNationalNo")}
          </div>
        ) : isLoading ? (
          <div className="px-6 pb-6 py-10 text-center text-muted-foreground text-sm">
            {t("drivers.personHistory.loading")}
          </div>
        ) : (
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex-1 px-6 pb-6 space-y-5">
            {/* ── Person card ─────────────────────────────────────────── */}
            {person && (
              <div className="flex gap-5 items-start pt-2">
                {/* Photo */}
                <div className="shrink-0 w-24 h-28 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
                  {person.imagePath ? (
                    <img
                      src={person.imagePath}
                      alt={personName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>

                {/* Person info grid */}
                <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
                  <PersonField
                    label={t("drivers.licenseDetails.fullName")}
                    value={person.fullName}
                    highlight
                  />
                  <PersonField
                    label={t("drivers.licenseDetails.nationalNo")}
                    value={person.nationalNo}
                  />
                  <PersonField
                    label={t("drivers.licenseDetails.dob")}
                    value={
                      person.dateOfBirth
                        ? new Date(person.dateOfBirth).toLocaleDateString()
                        : null
                    }
                  />
                  <PersonField
                    label={t("drivers.licenseDetails.gender")}
                    value={
                      person.gender != null
                        ? t(GENDER_KEYS[person.gender] ?? "")
                        : null
                    }
                  />
                  <PersonField
                    label={t("drivers.licenseDetails.phone")}
                    value={person.phone}
                  />
                  <PersonField
                    label={t("drivers.licenseDetails.email")}
                    value={person.email}
                  />
                  {person.address && (
                    <div className="col-span-2">
                      <PersonField
                        label={t("drivers.licenseDetails.address")}
                        value={person.address}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* ── License history ────────────────────────────────────── */}
            {driverId ? (
              <Tabs defaultValue="local">
                <TabsList className="w-full">
                  <TabsTrigger value="local" className="flex-1">
                    {t("drivers.driverLicenses.tabs.local")}
                  </TabsTrigger>
                  <TabsTrigger value="international" className="flex-1">
                    {t("drivers.driverLicenses.tabs.international")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="local" className="mt-4">
                  <LocalLicenseHistoryTable
                    licenses={licenses}
                    fmt={fmt}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="international" className="mt-4">
                  {intlLoading ? (
                    <div className="py-6 text-center text-muted-foreground text-sm">
                      {t("drivers.personHistory.loading")}
                    </div>
                  ) : intlLicenses.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground text-sm">
                      {t("drivers.driverLicenses.noInternationalLicenses")}
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 text-left">
                            <Th>
                              {t("drivers.personHistory.columns.licenseId")}
                            </Th>
                            <Th>{t("drivers.licenseDetails.localClass")}</Th>
                            <Th>
                              {t("drivers.personHistory.columns.issueDate")}
                            </Th>
                            <Th>
                              {t("drivers.personHistory.columns.expiryDate")}
                            </Th>
                            <Th>{t("drivers.personHistory.columns.fees")}</Th>
                            <Th>{t("drivers.personHistory.columns.status")}</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {intlLicenses.map((lic, i) => (
                            <tr
                              key={lic.internationalLicenseId}
                              className={i % 2 === 0 ? "" : "bg-muted/20"}
                            >
                              <Td>{lic.internationalLicenseId}</Td>
                              <Td>{lic.localLicenseClass ?? "—"}</Td>
                              <Td>{fmt(lic.issueDate)}</Td>
                              <Td>{fmt(lic.expirationDate)}</Td>
                              <Td>${lic.paidFees.toFixed(2)}</Td>
                              <Td>
                                <div className="flex gap-1 flex-wrap">
                                  <Badge
                                    variant={
                                      lic.isActive ? "default" : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {lic.isActive
                                      ? t("drivers.licenseDetails.active")
                                      : t("drivers.licenseDetails.inactive")}
                                  </Badge>
                                  {lic.isDetained && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      {t("drivers.licenseDetails.detained")}
                                    </Badge>
                                  )}
                                </div>
                              </Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <LocalLicenseHistoryTable licenses={licenses} fmt={fmt} t={t} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Local license history table (extracted for reuse in both views) ────────

type TFn = (key: string) => string;

function LocalLicenseHistoryTable({
  licenses,
  fmt,
  t,
}: {
  licenses: ReturnType<typeof Array.prototype.map> extends never[]
    ? never[]
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any[];
  fmt: (iso: string) => string;
  t: TFn;
}) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3">
        {t("drivers.personHistory.historyTitle")}
        {licenses.length > 0 && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            ({licenses.length})
          </span>
        )}
      </p>
      {licenses.length === 0 ? (
        <div className="py-6 text-center text-muted-foreground text-sm">
          {t("drivers.personHistory.noLicenses")}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <Th>{t("drivers.personHistory.columns.licenseId")}</Th>
                <Th>{t("drivers.personHistory.columns.class")}</Th>
                <Th>{t("drivers.personHistory.columns.issueDate")}</Th>
                <Th>{t("drivers.personHistory.columns.expiryDate")}</Th>
                <Th>{t("drivers.personHistory.columns.issueReason")}</Th>
                <Th>{t("drivers.personHistory.columns.fees")}</Th>
                <Th>{t("drivers.personHistory.columns.status")}</Th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(
                (
                  lic: {
                    licenseId: number;
                    className: string;
                    issueDate: string;
                    expirationDate: string;
                    issueReason: number;
                    paidFees: number;
                    isActive: boolean;
                    isDetained: boolean;
                  },
                  i: number,
                ) => (
                  <tr
                    key={lic.licenseId}
                    className={i % 2 === 0 ? "" : "bg-muted/20"}
                  >
                    <Td>{lic.licenseId}</Td>
                    <Td>{lic.className}</Td>
                    <Td>{fmt(lic.issueDate)}</Td>
                    <Td>{fmt(lic.expirationDate)}</Td>
                    <Td>
                      {t(
                        ISSUE_REASON_KEYS[lic.issueReason] ??
                          "drivers.licenseDetails.issueReasons.unknown",
                      )}
                    </Td>
                    <Td>${lic.paidFees.toFixed(2)}</Td>
                    <Td>
                      <div className="flex gap-1 flex-wrap">
                        <Badge
                          variant={lic.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {lic.isActive
                            ? t("drivers.licenseDetails.active")
                            : t("drivers.licenseDetails.inactive")}
                        </Badge>
                        {lic.isDetained && (
                          <Badge variant="destructive" className="text-xs">
                            {t("drivers.licenseDetails.detained")}
                          </Badge>
                        )}
                      </div>
                    </Td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PersonField({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground font-medium">
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${highlight ? "text-primary" : ""}`}
      >
        {value ?? (
          <span className="text-muted-foreground font-normal italic text-xs">
            —
          </span>
        )}
      </span>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-3 py-2 border-b text-xs whitespace-nowrap">{children}</td>
  );
}
