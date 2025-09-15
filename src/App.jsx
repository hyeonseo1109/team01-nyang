import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import { SignIn } from './components/SignIn';
import PrivateRoute from '../PrivateRoute';
import { Login } from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/main"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />
      <Route path="/Mypage" element={<MyPage />} />
    </Routes>
  );
}

export default App;
