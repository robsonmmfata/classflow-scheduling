import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Pricing from "./pages/Pricing";
import Schedule from "./pages/Schedule";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Avaliacoes from "./pages/Avaliacoes";

const TeachingMaterialUpload = lazy(() => import('./pages/TeachingMaterialUpload'));
const MateriaisDeEnsino = lazy(() => import('./pages/MateriaisDeEnsino'));
const AvaliacoesLazy = lazy(() => import('./pages/Avaliacoes'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/students" element={<Students />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/teaching-material-upload" element={
          <ProtectedRoute requiredRole="teacher">
            <Suspense fallback={<div>Loading...</div>}>
              <TeachingMaterialUpload />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/materiais-de-ensino" element={
          <ProtectedRoute requiredRole="teacher">
            <Suspense fallback={<div>Loading...</div>}>
              <MateriaisDeEnsino />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/avaliacoes" element={
          <ProtectedRoute requiredRole="student">
            <Suspense fallback={<div>Loading...</div>}>
              <AvaliacoesLazy />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
