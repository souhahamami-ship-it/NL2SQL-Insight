import { Routes, Route, Navigate } from "react-router-dom";

import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}