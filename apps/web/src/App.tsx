import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/common/Header.js";
import { Footer } from "./components/common/Footer.js";
import { LandingPage } from "./features/home/LandingPage.js";
import { CreateCasePage } from "./features/case-creation/CreateCasePage.js";
import { CaseBriefingPage } from "./features/investigation/CaseBriefingPage.js";
import { InvestigationRoomPage } from "./features/investigation/InvestigationRoomPage.js";
import { VerdictPage } from "./features/accusation/VerdictPage.js";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#07090d] text-slate-100">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateCasePage />} />
            <Route path="/cases/:caseId" element={<CaseBriefingPage />} />
            <Route path="/cases/:caseId/investigate" element={<InvestigationRoomPage />} />
            <Route path="/investigations/:investigationId/result" element={<VerdictPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
