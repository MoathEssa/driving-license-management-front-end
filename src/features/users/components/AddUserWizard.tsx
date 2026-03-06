import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@app/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { PersonLookupTab } from "@features/people/components/PersonLookupTab";
import { UserInfoTab } from "./UserInfoTab";
import type { IPersonWithUserStatus } from "@features/people/store/peopleApi";

interface AddUserWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUserWizard({ open, onOpenChange }: AddUserWizardProps) {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const [activeTab, setActiveTab] = useState("lookup");
  const [selectedPerson, setSelectedPerson] =
    useState<IPersonWithUserStatus | null>(null);

  const canProceed = selectedPerson !== null && !selectedPerson.hasUser;

  const handlePersonSelected = (person: IPersonWithUserStatus) => {
    setSelectedPerson(person);
  };

  const handleNext = () => {
    if (canProceed) {
      setActiveTab("user-info");
    }
  };

  const handleBack = () => {
    setActiveTab("lookup");
  };

  const handleSuccess = () => {
    setSelectedPerson(null);
    setActiveTab("lookup");
    onOpenChange(false);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setSelectedPerson(null);
      setActiveTab("lookup");
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir={dir}
        size="xl"
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{t("users.wizard.title")}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="lookup" className="flex-1">
              {t("users.wizard.tab1")}
            </TabsTrigger>
            <TabsTrigger
              value="user-info"
              className="flex-1"
              disabled={!canProceed}
            >
              {t("users.wizard.tab2")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lookup" className="mt-4 space-y-4">
            <PersonLookupTab
              onPersonSelected={handlePersonSelected}
              selectedPerson={selectedPerson}
            />

            {/* Next button */}
            {selectedPerson && (
              <div className="flex justify-end">
                {selectedPerson.hasUser ? (
                  <p className="text-destructive text-sm">
                    {t("users.wizard.alreadyHasAccount")}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium"
                  >
                    {t("users.wizard.next")}
                  </button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="user-info" className="mt-4">
            {selectedPerson && !selectedPerson.hasUser && (
              <UserInfoTab
                person={selectedPerson}
                onSuccess={handleSuccess}
                onBack={handleBack}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
