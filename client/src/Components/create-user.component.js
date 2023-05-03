import React, { useState } from "react";
import axios from 'axios';
import CreateUserForm from "./CreateUserForm";
import { useNavigate } from "react-router-dom";
  
// CreateUser Component
const CreateUser = () => {
    const [formValues, setFormValues] = 
    useState({ name: '', email: '', password: ''})
    const nav = useNavigate();

    // onSubmit handler
    const onSubmit = userObject => {
        axios.post(
            'http://localhost:8080/users', 
        userObject)
        .then(res => {
            if (res.status === 201) {
                localStorage.setItem('token', res.data.token)
                alert('Account successfully created!');
                nav("/")
                window.location.reload()
            }
        })
        .catch(err => alert('Something went wrong'))
}
    
  // Return book form
  return(
    <div className="table-wrapper">
        <h1>User creating page!</h1>
    <CreateUserForm initialValues={formValues}
    onSubmit={onSubmit} 
    enableReinitialize>
    Create account
  </CreateUserForm>
  </div>
  )
}
  
// Export CreateUser Component
export default CreateUser