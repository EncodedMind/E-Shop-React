const Home = ({ setPage }) => {
return (
    <div className="page-container">
    <div className="content-wrapper">
        <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div className="card-header">
            <h1>Welcome to E-Shop</h1>
            <p className="text-secondary">by Dimitris Andreakis</p>
            </div>
            <div className="card-body">
            <div className="flex flex-col gap-md" style={{ marginTop: '2rem' }}>
                <button className="button-primary button-lg" onClick={() => setPage("LOGIN")}>
                Login
                </button>
                <button className="button-outline button-lg" onClick={() => setPage("REGISTER")}>
                Register
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
);
};

export default Home;
