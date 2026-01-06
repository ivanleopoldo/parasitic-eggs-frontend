import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "@/home";
import { Toaster } from "sonner";
import { Preview } from "./preview";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </StrictMode>
);
