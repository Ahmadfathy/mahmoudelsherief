import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { CoursesProvider } from "@/lib/courses-store";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import Academy from "./pages/Academy";
import CourseDetail from "./pages/CourseDetail";
import Subscribe from "./pages/Subscribe";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CoursesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/academy/subscribe" element={<Subscribe />} />
              <Route path="/academy/:slug" element={<CourseDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </CoursesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
