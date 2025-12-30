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
        <div className="page-container">
            <div className="content-wrapper">
                <div className="container">
                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <div className="card-header">
                            <h2>Login to Your Account</h2>
                            <p className="text-secondary">Enter your credentials to continue</p>
                        </div>
                        <div className="card-body">
                            <form onSubmit={credentialsCheck}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        value={usernameInput}
                                        onChange={(e) => setUsernameInput(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="button-primary" style={{ width: '100%' }}>Login</button>
                            </form>

                            {error === "no-user" && (
                                <div className="alert alert-error mt-md">
                                    Can't find user <strong>{errorUser}</strong>. Click{" "}
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
                                </div>
                            )}

                            {error === "wrong-password" && (
                                <div className="alert alert-error mt-md">Incorrect credentials. Try again.</div>
                            )}
                            {error === "fetch-failed" && (
                                <div className="alert alert-error mt-md">Could not reach server. Try again later.</div>
                            )}

                            <div className="text-center mt-lg">
                                <button className="button-outline" onClick={() => setPage("HOME")}>Back to Home</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
