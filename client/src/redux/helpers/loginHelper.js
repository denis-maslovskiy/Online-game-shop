const login = (jwtToken, id) => {
  localStorage.setItem(
    "userData",
    JSON.stringify({ userId: id, token: jwtToken })
  );
};

export default login;