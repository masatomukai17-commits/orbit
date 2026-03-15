import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import { ROLES } from './data/constants.js';
import LoginPage from './pages/LoginPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import InstructorDashboard from './pages/InstructorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function AppRouter() {
  const { currentUser } = useAuth();
  if (!currentUser) return <LoginPage />;
  switch (currentUser.role) {
    case ROLES.STUDENT: return <StudentDashboard />;
    case ROLES.INSTRUCTOR: return <InstructorDashboard />;
    case ROLES.ADMIN: return <AdminDashboard />;
    default: return <LoginPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRouter />
      </DataProvider>
    </AuthProvider>
  );
}
