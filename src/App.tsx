import AcceptQuotePage from "./pages/AcceptQuotePage";
import ExpiredPage from "./pages/ExpiredPage";
import PayQuotePage from "./pages/PayQuotePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-[#EBEDF3] flex items-center justify-center p-4">
      <BrowserRouter>
        <Routes>
          <Route path="/payin/:uuid" element={<AcceptQuotePage />} />
          <Route path="/payin/:uuid/pay" element={<PayQuotePage />} />
          <Route path="/payin/:uuid/expired" element={<ExpiredPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
