import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { ShieldAlert } from "lucide-react";

const ForbiddenPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-4">
        <div className="flex justify-center">
          <ShieldAlert className="h-20 w-20 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("auth.forbidden.title")}
        </h1>
        <p className="text-muted-foreground">{t("auth.forbidden.message")}</p>
        <Button asChild>
          <Link to="/">{t("auth.forbidden.backHome")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
