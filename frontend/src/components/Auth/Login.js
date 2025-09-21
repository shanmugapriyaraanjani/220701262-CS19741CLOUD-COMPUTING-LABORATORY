import React, { useState } from "react";
import { auth } from "./firebase";
import { useHistory } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  const LogIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setLoading(false);
      history.push("/dashboard");
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="auth-section">
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <h2 >Login</h2>
          <hr style={{backgroundColor:"#ff3f81"}} />
          <Form onSubmit={LogIn}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                }}
              />
            </Form.Group>
            <Button className="auth-button" style={{backgroundColor:"#23153c"}} variant="dark" type="submit">
              Submit
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};

export default Login;
