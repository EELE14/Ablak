/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { Routes, Route } from "react-router-dom";
import AblakDemo from "./pages/AblakDemo";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AblakDemo />} />
    </Routes>
  );
}
