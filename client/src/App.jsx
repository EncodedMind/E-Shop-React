import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import './index.css';

const App = () => {

  const [page, setPage] = useState("HOME");
  const [username, setUsername] = useState("");

  const handleLogout = () => {
    setUsername("");
    setPage("HOME");
  };

  return (
    <div className="App">
      {page === "HOME" && <Home setPage={setPage} />}
      {page === "LOGIN" && <Login setPage={setPage} setUsername={setUsername} />}
      {page === "REGISTER" && <Register setPage={setPage} />}
      {page === "ADMIN" && <AdminPage username={username} onLogout={handleLogout} />}
      {page === "USER" && <UserPage username={username} onLogout={handleLogout} />}
    </div>
  );
};

export default App;