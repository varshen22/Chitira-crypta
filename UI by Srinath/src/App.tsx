import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GeneralLogin } from './pages/GeneralLogin';
import { GeneralSignUp } from './pages/GeneralSignUp';
import { PersonnelLogin } from './pages/PersonnelLogin';
import { PersonnelForgot } from './pages/PersonnelForgot';
import { GeneralForgot } from './pages/GeneralForgot';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GeneralLogin />} />
        <Route path="/signup" element={<GeneralSignUp />} />
        <Route path="/personnel-login" element={<PersonnelLogin />} />
        <Route path="/personnel-forgot-password" element={<PersonnelForgot />} />
        <Route path="/general-forgot-password" element={<GeneralForgot />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
