import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import Academy from "./pages/Academy";
import CourseDetail from "./pages/CourseDetail";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/academy/:slug" element={<CourseDetail />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
