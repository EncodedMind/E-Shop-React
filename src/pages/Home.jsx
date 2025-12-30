const Home = ({ setPage }) => {
  return (
    <div>
      <h1>Welcome to the E-shop</h1>

      <button onClick={() => setPage("LOGIN")}>
        Login
      </button>

      <button onClick={() => setPage("REGISTER")}>
        Register
      </button>
    </div>
  );
};

export default Home;
