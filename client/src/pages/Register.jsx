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
            <div className="page-container">
                <div className="content-wrapper">
                    <div className="container">
                        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <div className="alert alert-success">
                                <h3 className="mt-0">Registration Successful!</h3>
                                <p className="mb-0">
                                    Thanks for signing up! Click{" "}
                                    <a href="#" onClick={(e) => { e.preventDefault(); setPage("LOGIN"); }}>
                                        here
                                    </a>{" "}
                                    to login.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <div className="container">
                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <div className="card-header">
                            <h2>Create an Account</h2>
                            <p className="text-secondary">Fill in your details to register</p>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleRegister}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Choose a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={isAdmin}
                                            onChange={(e) => setIsAdmin(e.target.checked)}
                                            style={{ width: 'auto' }}
                                        />
                                        Register as Administrator
                                    </label>
                                </div>

                                <button type="submit" className="button-primary" style={{ width: '100%' }}>Register</button>
                            </form>

                            {error === "user-exists" && (
                                <div className="alert alert-error mt-md">
                                    Username <strong>{errorUser}</strong> already exists. Click{" "}
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
                                </div>
                            )}

                            {error === "fetch-failed" && (
                                <div className="alert alert-error mt-md">Could not register. Try again later.</div>
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

}

export default Register;