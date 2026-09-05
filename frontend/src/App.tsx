import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CheckPayment } from './pages/CheckPayment';
import { NewTransaction } from './pages/NewTransaction';
import { HistoryScanner } from './pages/HistoryScanner';
import { RiskResult } from './pages/RiskResult';
import { Analytics } from './pages/Analytics';
import { NotFound } from './pages/NotFound';

import { ThemeProvider } from './context/ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="check-payment" element={<CheckPayment />} />
            <Route path="new-transaction" element={<NewTransaction />} />
            <Route path="history" element={<HistoryScanner />} />
            <Route path="result/:id" element={<RiskResult />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
