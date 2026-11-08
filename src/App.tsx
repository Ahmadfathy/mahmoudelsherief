import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { AuthModalProvider } from "@/lib/auth-modal-context";
import { CoursesProvider } from "@/lib/courses-store";
import Home from "./pages/Home";
import ComingSoon from "./pages/ComingSoon";
import Payment from "./pages/Payment";
import Academy from "./pages/Academy";
import CourseDetail from "./pages/CourseDetail";
import Subscribe from "./pages/Subscribe";
import SubscriptionEntry from "./pages/SubscriptionEntry";
import StudentDashboard from "./pages/StudentDashboard";
import Admin from "./pages/Admin";
import AdminSubscribers from "./pages/AdminSubscribers";
import AdminCourses from "./pages/AdminCourses";
import AdminCourseEdit from "./pages/AdminCourseEdit";
import AdminPayments from "./pages/AdminPayments";
import AdminDiscountCodes from "./pages/AdminDiscountCodes";
import AdminTestimonials from "./pages/AdminTestimonials";
import StudentProfile from "./pages/StudentProfile";
import AdminProfile from "./pages/AdminProfile";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CoursesProvider>
          <BrowserRouter>
            <AuthModalProvider>
              <Routes>
                {/* TEMPORARY: Coming Soon page as root. Home moved to /home during development. Revert when ready to launch. */}
                <Route path="/" element={<ComingSoon />} />
                <Route path="/home" element={<Home />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/subscribe" element={<SubscriptionEntry />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/academy/subscribe" element={<Subscribe />} />
                <Route path="/academy/:slug" element={<CourseDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/subscribers" element={<AdminSubscribers />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/courses/:courseId" element={<AdminCourseEdit />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/discount-codes" element={<AdminDiscountCodes />} />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
              </Routes>
            </AuthModalProvider>
          </BrowserRouter>
        </CoursesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
