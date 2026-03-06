import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@app/providers";
import { router } from "@app/router";

// Initialize i18n
import "@shared/lib/i18n";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
