import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { AuthModalProvider } from "@/lib/auth-modal-context";
import { CoursesProvider } from "@/lib/courses-store";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import Academy from "./pages/Academy";
import CourseDetail from "./pages/CourseDetail";
import Subscribe from "./pages/Subscribe";
import Admin from "./pages/Admin";
import AdminSubscribers from "./pages/AdminSubscribers";
import AdminCourses from "./pages/AdminCourses";
import AdminCourseEdit from "./pages/AdminCourseEdit";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CoursesProvider>
          <BrowserRouter>
            <AuthModalProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/academy/subscribe" element={<Subscribe />} />
                <Route path="/academy/:slug" element={<CourseDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/subscribers" element={<AdminSubscribers />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/courses/:courseId" element={<AdminCourseEdit />} />
              </Routes>
            </AuthModalProvider>
          </BrowserRouter>
        </CoursesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
