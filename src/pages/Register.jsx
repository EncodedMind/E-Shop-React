import React, { useState } from "react";
import users from "../data/users.json";

const Register = ({ setPage }) => {

    const [error, setError] = useState("");
    const [errorUser, setErrorUser] = useState("");
    const [success, setSuccess] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault(); // prevent page reload

        const storedUsers = JSON.parse(localStorage.getItem("users") || JSON.stringify(users));
        const existingUser = storedUsers.find(u => u.username === username);

        if (existingUser) {
            setError("user-exists");  
            setErrorUser(username);
            return;
        }

        storedUsers.push({ username, password, isAdmin });
        localStorage.setItem("users", JSON.stringify(storedUsers));
        setError("");
        setSuccess(true);
    };

    if (success) {
        return (
            <div>
                <p>
                    Thanks for signing up! Click{" "}
                    <a href="#" onClick={(e) => { e.preventDefault(); setPage("LOGIN"); }}>
                        here
                    </a>{" "}
                    to login.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    Admin?
                </label>

                <button type="submit">Register</button>
            </form>

            {/* Error message rendered under the form */}
            {error === "user-exists" && (
                <p>
                Username {errorUser} already exists. Click{" "}
                <a
                    href="#"
                    onClick={(e) => {
                    e.preventDefault();
                    setError("");
                    setPage("LOGIN");
                    }}
                >
                    here
                </a>{" "}
                to login
                </p>
            )}

        </div>
    );

}

export default Register;