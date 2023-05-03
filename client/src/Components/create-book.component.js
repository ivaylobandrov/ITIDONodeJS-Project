import React, { useState, useEffect } from "react";
import axios from 'axios';
import BookForm from "./BookForm";
  
// CreateBook Component
const CreateBook = () => {
  const [formValues, setFormValues] = 
    useState({ name: '', description: ''})
  const [file, setFile] = useState(undefined)

  const [image, setImage] = useState({ preview: '', data: '' })
  const [status, setStatus] = useState('')
 
  // onSubmit handler
  const onSubmit = bookObject => {
    axios.post(
    'http://localhost:8080/books/create-book',
    bookObject,
    { headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}, 
    )
      .then(res => {
        if (res.status === 201) {
          alert('Book successfully created')
        }
      })
      .catch(err => alert('Something went wrong'))
  }
    
  // Return book form
  return(
    <div className="form-wrapper">
      <div>
        <BookForm initialValues={formValues} 
          onSubmit={onSubmit} 
          enableReinitialize>
          Create Book
        </BookForm>
    </div>
    </div>
  )
}
  
// Export CreateBook Component
export default CreateBook