import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { PersonInfoCard } from "./PersonInfoCard";
import { useLazyGetPersonByNationalNoQuery } from "../store/peopleApi";
import type { IPersonWithUserStatus } from "../store/peopleApi";

interface PersonLookupTabProps {
  onPersonSelected: (person: IPersonWithUserStatus) => void;
  selectedPerson: IPersonWithUserStatus | null;
}

export function PersonLookupTab({
  onPersonSelected,
  selectedPerson,
}: PersonLookupTabProps) {
  const { t } = useTranslation();
  const [nationalNo, setNationalNo] = useState("");
  const [searchPerson, { isFetching, error }] =
    useLazyGetPersonByNationalNoQuery();

  const handleSearch = async () => {
    if (!nationalNo.trim()) return;
    const result = await searchPerson(nationalNo.trim());
    if (result.data?.data) {
      onPersonSelected(result.data.data);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const hasError = error && "status" in error;

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <label htmlFor="nationalNo" className="text-sm font-medium">
            {t("people.lookup.nationalNoLabel")}
          </label>
          <Input
            id="nationalNo"
            value={nationalNo}
            onChange={(e) => setNationalNo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("people.lookup.nationalNoPlaceholder")}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isFetching || !nationalNo.trim()}
        >
          <Search className="me-2 h-4 w-4" />
          {isFetching
            ? t("people.lookup.searching")
            : t("people.lookup.search")}
        </Button>
      </div>

      {/* Error state */}
      {hasError && !selectedPerson && (
        <p className="text-destructive text-sm">
          {t("people.lookup.personNotFound")}
        </p>
      )}

      {/* Person info card */}
      {selectedPerson && <PersonInfoCard person={selectedPerson} />}
    </div>
  );
}
