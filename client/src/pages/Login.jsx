import React, { useState } from "react";

const Login = ({ setPage, setUsername }) => {

    const [error, setError] = useState("");
    const [errorUser, setErrorUser] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [password, setPassword] = useState("");

    const credentialsCheck = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:4000/api/users");
            if (!res.ok) {
                throw new Error("Failed to load users");
            }
            const storedUsers = await res.json();
            const user = storedUsers.find((u) => u.username === usernameInput);

            if (!user) {
                setError("no-user");
                setErrorUser(usernameInput);
                return;
            }

            if (user.password !== password) {
                setError("wrong-password");
                return;
            }

            localStorage.setItem("currentUser", usernameInput);
            setUsername(usernameInput);
            if (user.isAdmin) {
                setPage("ADMIN");
            } else {
                setPage("USER");
            }
        } catch (err) {
            console.error(err);
            setError("fetch-failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={credentialsCheck}>
                <input
                type="text"
                placeholder="Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>

            {error === "no-user" && (
                <p>
                Can't find user {errorUser}. Click{" "}
                <a
                    href="#"
                    onClick={(e) => {
                    e.preventDefault();
                    setError("");
                    setPage("REGISTER");
                    }}
                >
                    here
                </a>{" "}
                to register as a new user.
                </p>
            )}

            {error === "wrong-password" && <p>Incorrect credentials. Try again.</p>}
            {error === "fetch-failed" && <p>Could not reach server. Try again later.</p>}
        </div>
    );
};

export default Login;
