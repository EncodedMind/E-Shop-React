import { useEffect, useState } from "react";

const Logout = ({ onLogout }) => {
  const [countdown, setCountdown] = useState(5); // 5 seconds countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    
    if (countdown <= 0) {
      onLogout();
    }

    return () => clearInterval(timer); // cleanup
  }, [countdown, onLogout]);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Logout</h2>
      </div>
      <div className="card-body">
        <div className="alert alert-success">
          <p style={{ margin: 0 }}>You have successfully logged out.</p>
        </div>
        <p className="text-secondary">Redirecting to home page in {countdown} second{countdown !== 1 ? "s" : ""}...</p>
      </div>
    </div>
  );
};

export default Logout;