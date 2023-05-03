import React, { useState, useEffect } from "react";
import axios from 'axios';
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
  
// LoginUser Component
const LoginUser = () => {
  const nav = useNavigate();
  const [formValues, setFormValues] = 
    useState({ name: '', password: ''})
  // onSubmit handler
  const onSubmit = userObject => {
          axios.post(
      'http://localhost:8080/users/login', 
          userObject)
            .then(res => {
              if (res.status === 200) {
                localStorage.setItem('token', res.data.token)
                  alert('Successfully logged in!');
                  nav("/")
                  window.location.reload()
              } else {
                  Promise.reject()
              }
            })
            .catch(err => alert('Something went wrong'))
  }
    
  // Return book form
  return(
    <div className="table-wrapper">
      <LoginForm initialValues={formValues} 
      onSubmit={onSubmit} 
      enableReinitialize>
      Login
    </LoginForm>
    <div className="Form-wrapper"><Nav>
			<Link to={{pathname: `/users/`}}>Does not have an account? Sign up now!</Link>
			</Nav></div>
    </div>

  )
}
  
// Export CreateBook Component
export default LoginUser