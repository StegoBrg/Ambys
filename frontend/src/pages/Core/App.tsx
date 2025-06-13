import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Header from './Header';
import DiaryPage from '../DiaryPage/DiaryPage';
import SettingsPage from '../SettingsPage/SettingsPage';
import CalendarPage from '../CalendarPage/CalendarPage';
import NotebooksPage from '../NotebooksPage/NotebooksPage';
import LoginPage from '../Auth/LoginPage';
import RegisterPage from '../Auth/RegisterPage';
import UserPage from '../UserPage/UserPage';
import AdminPage from '../AdminPage/AdminPage';
import MedicationWrapper from '../MedicationPage/MedicationWrapper';
import Homepage from '../HomePage/Homepage';
import { NothingFoundBackground } from './ErrorPages/NotFound/NothingFoundBackground';
import ReportsPage from '../ReportsPage/ReportsPage';

function AppLayout() {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/register'];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className='App'>
      {shouldShowHeader && <Header />}
      <main>
        <Routes>
          {
            <>
              <Route path='*' element={<NothingFoundBackground />} />

              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />

              <Route path='/' element={<Homepage />} />
              <Route path='/diary' element={<DiaryPage />} />
              <Route path='/calendar' element={<CalendarPage />} />
              <Route path='/notebooks' element={<NotebooksPage />} />
              <Route path='/medications' element={<MedicationWrapper />} />
              <Route path='/reports' element={<ReportsPage />} />
              <Route path='/settings' element={<SettingsPage />} />

              <Route path='/userprofile' element={<UserPage />} />
              <Route path='/admin' element={<AdminPage />} />
            </>
          }
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
