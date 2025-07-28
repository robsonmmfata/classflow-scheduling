import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ScheduleProvider } from "./contexts/ScheduleContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ChatProvider as RealChatProvider } from "./contexts/RealChatContext";
import { StudentsProvider } from "./contexts/StudentsContext";
import { FeedbackProvider } from "./contexts/FeedbackContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ScheduleProvider>
            <ChatProvider>
              <RealChatProvider>
                <StudentsProvider>
                  <FeedbackProvider>
                    <App />
                  </FeedbackProvider>
                </StudentsProvider>
              </RealChatProvider>
            </ChatProvider>
          </ScheduleProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
