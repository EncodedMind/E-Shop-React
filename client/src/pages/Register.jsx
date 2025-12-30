import React, { useState } from "react";

const Register = ({ setPage }) => {

    const [error, setError] = useState("");
    const [errorUser, setErrorUser] = useState("");
    const [success, setSuccess] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault(); // prevent page reload
        setError("");

        try {
            const res = await fetch("http://localhost:4000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, isAdmin }),
            });

            if (res.status === 409) {
                setError("user-exists");
                setErrorUser(username);
                return;
            }

            if (!res.ok) {
                throw new Error("Failed to register");
            }

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError("fetch-failed");
        }
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

            {error === "fetch-failed" && <p>Could not register. Try again later.</p>}

        </div>
    );

}

export default Register;