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
    <div>
      <h2>You have successfully logged out.</h2>
      <p>Redirecting to home page in {countdown} second{countdown !== 1 ? "s" : ""}...</p>
    </div>
  );
};

export default Logout;