import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import type { IPersonWithUserStatus } from "../store/peopleApi";

interface PersonInfoCardProps {
  person: IPersonWithUserStatus;
}

export function PersonInfoCard({ person }: PersonInfoCardProps) {
  const { t } = useTranslation();

  const fullName = [
    person.firstName,
    person.secondName,
    person.thirdName,
    person.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const genderLabel =
    person.gender === 1
      ? t("people.info.male")
      : person.gender === 2
        ? t("people.info.female")
        : "—";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("people.info.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label={t("people.info.fullName")} value={fullName} />
          <InfoRow
            label={t("people.info.nationalNo")}
            value={person.nationalNo ?? "—"}
          />
          <InfoRow
            label={t("people.info.dateOfBirth")}
            value={person.dateOfBirth ?? "—"}
          />
          <InfoRow label={t("people.info.gender")} value={genderLabel} />
          <InfoRow label={t("people.info.email")} value={person.email ?? "—"} />
          <InfoRow label={t("people.info.phone")} value={person.phone ?? "—"} />
          <div className="sm:col-span-2 lg:col-span-3">
            <InfoRow
              label={t("people.info.address")}
              value={person.address ?? "—"}
            />
          </div>
          <div>
            <span className="text-muted-foreground text-sm">
              {t("people.info.hasAccount")}
            </span>
            <div className="mt-1">
              {person.hasUser ? (
                <Badge variant="secondary">
                  {t("people.info.statusActive")}
                </Badge>
              ) : (
                <Badge variant="outline">
                  {t("people.info.statusNoAccount")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground text-sm">{label}</span>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
