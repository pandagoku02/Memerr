import "./login.scss";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { makeRequest } from "../../utils/axios";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginInputs, setLoginInputs] = useState({
    username: "",
    password: "",
  });
  const [signupInputs, setSignupInputs] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirm_password: "",
  });

  const handleLoginInputChange = (e) => {
    setLoginInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupInputChange = (e) => {
    setSignupInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ ...loginInputs });
  };

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const res = await makeRequest.post("/users/create-user", {
        ...signupInputs,
      });
      if (res.data.success) {
        setSignupInputs({
          username: "",
          firstName: "",
          lastName: "",
          password: "",
          confirm_password: "",
        });
        setShowSignUp(false);
        toast.success(res.data.message || "User created successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  return (
    <ContentWrapper>
      <div className="login">
        <h1>Memerr Login</h1>
        <p>
          Login or{" "}
          <span id="signup-button" onClick={() => setShowSignUp(true)}>
            signup
          </span>{" "}
          to continue
        </p>
        <div id="login-container">
          <form onSubmit={handleLogin}>
            <p className="input-detail">Enter Username:</p>
            <input
              type="text"
              name="username"
              placeholder="Your Username"
              required
              onChange={handleLoginInputChange}
              value={loginInputs.username}
            />
            <p className="input-detail">Enter Password:</p>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              required
              onChange={handleLoginInputChange}
              value={loginInputs.password}
            />
            <button className="submit-button">Login </button>
          </form>
        </div>

        {showSignUp && (
          <div id="signup-container">
            <div id="signup-form">
              <span id="close" onClick={() => setShowSignUp(false)}>
                ✖
              </span>
              <h1>
                Join the
                <span style={{ color: "rgba(0, 0, 255, 0.445)" }}>
                  {" "}
                  Memerr{" "}
                </span>
                community!
              </h1>
              <form onSubmit={handleSignup}>
                <p className="input-detail">Username:</p>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  required
                  onChange={handleSignupInputChange}
                  value={signupInputs.username}
                />
                <p className="input-detail">First Name:</p>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  onChange={handleSignupInputChange}
                  value={signupInputs.firstName}
                />
                <p className="input-detail">Last Name:</p>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  onChange={handleSignupInputChange}
                  value={signupInputs.lastName}
                />

                <p className="input-detail">Enter Password:</p>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleSignupInputChange}
                  value={signupInputs.password}
                />
                <p className="input-detail">Confirm Password:</p>
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  required
                  onChange={handleSignupInputChange}
                  value={signupInputs.confirm_password}
                />
                <button className="submit-button">Signup</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default Login;
