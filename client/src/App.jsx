import { useState } from 'react';
import { Outlet, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Home, Profile, Login, Register, ResetPassword } from './pages';
import { useSelector } from 'react-redux';

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  return (
    <>
      {user?.token ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
}

function App() {
  const [searchData, setSearchData] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Home
                searchData={searchData}
                showSearch={showSearch}
                setSearchData={setSearchData}
                setShowSearch={setShowSearch}
              />
            }
          />
          <Route
            path="/profile/:id?"
            element={
              <Profile
                searchData={searchData}
                showSearch={showSearch}
                setSearchData={setSearchData}
                setShowSearch={setShowSearch}
              />
            }
          />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
