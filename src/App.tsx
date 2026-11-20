import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { useStore } from './data/store';
import { AssessmentPage } from './pages/teacher/AssessmentPage';
import { ClassPage } from './pages/teacher/ClassPage';
import { RosterPage } from './pages/teacher/RosterPage';
import { SchemePage } from './pages/teacher/SchemePage';
import { TeacherHome } from './pages/teacher/TeacherHome';
import { StudentClassPage } from './pages/student/StudentClassPage';
import { StudentHome } from './pages/student/StudentHome';
import { NotFound } from './pages/NotFound';

function Home() {
  const { state } = useStore();
  return <Navigate to={state.role === 'student' ? '/student' : '/teacher'} replace />;
}

export function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="teacher" element={<TeacherHome />} />
        <Route path="teacher/classes/:classId" element={<ClassPage />} />
        <Route path="teacher/classes/:classId/assessments/:assessmentId" element={<AssessmentPage />} />
        <Route path="teacher/classes/:classId/roster" element={<RosterPage />} />
        <Route path="teacher/classes/:classId/scheme" element={<SchemePage />} />
        <Route path="student" element={<StudentHome />} />
        <Route path="student/classes/:classId" element={<StudentClassPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
