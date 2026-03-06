import { Provider } from "react-redux";
import { store } from "@app/store";
import { ThemeProvider } from "./ThemeProvider";
import { I18nProvider } from "./I18nProvider";
import { AuthProvider } from "./AuthProvider";
import { Toaster } from "@shared/ui/sonner";
import { TooltipProvider } from "@shared/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster position="top-right" richColors />
              {children}
            </TooltipProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  );
}
