import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ScheduleProvider } from "./contexts/ScheduleContext";
import { ChatProvider } from "./contexts/ChatContext";
import { StudentsProvider } from "./contexts/StudentsContext";
import { FeedbackProvider } from "./contexts/FeedbackContext";
import { PackageLimitationProvider } from "./contexts/PackageLimitationContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ScheduleProvider>
            <ChatProvider>
              <StudentsProvider>
                <FeedbackProvider>
                  <PackageLimitationProvider>
                    <App />
                  </PackageLimitationProvider>
                </FeedbackProvider>
              </StudentsProvider>
            </ChatProvider>
          </ScheduleProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);