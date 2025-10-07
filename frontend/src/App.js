import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import CTF from "./pages/CTF";
import "./index.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AppRoot() {
  useEffect(() => {
    // backend hello (kept as-is; not used in mock flow)
    const hello = async () => {
      try {
        const res = await axios.get(`${API}/`);
        // eslint-disable-next-line no-console
        console.log("Backend says:", res.data?.message);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Backend not reachable yet or /api/ misconfigured.");
      }
    };
    hello();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CTF />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppRoot />;
}