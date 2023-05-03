import React, { useState, useEffect } from "react";
import axios from 'axios';
import BookForm from "./BookForm";
  
// CreateBook Component
const EditBook = () => {
    const [formValues, setFormValues] = useState({ name: '', description: ''})
    const url = window.location.pathname
    const id = url.substring(url.lastIndexOf('/') + 1);
    const [image, setImage] = useState('')

    const handleSubmit = async (event) => {
        const data = new FormData() 
        data.append('file', image.selectedFile)
        axios.post(`http://localhost:8080/books/${id}/cover`, data, { 
            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`},
        })
        .then(res => {
            console.log(res.statusText)
        })
    }
  
    const handleFileChange = (event) => {
        console.log(event.target.files[0])
        setImage({
            selectedFile: event.target.files[0],
            loaded: 0,
          })
    }

    // Get book info for table
    useEffect (() => {
        axios
            .get(
                "http://localhost:8080/books/" + id, { headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            )
            .then((res) => {
            if (res.status === 200) {
                setFormValues(res.data)
            } else Promise.reject();
            })
            .catch((error) => {
                console.log(error);
            });
        }, []);

    const onSubmit = bookObject => {
        const fieldToBeUpdated = {
            "name": bookObject.name,
            "description": bookObject.description
        }
        axios.patch(
        `http://localhost:8080/books/edit-book/${id}`,
        fieldToBeUpdated,
        { headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}, 
        )
            .then(res => {
            if (res.status === 200)
                alert('Book successfully updated')
            else
                Promise.reject()
            })
            .catch(err => alert('Something went wrong'))
        }
    
    // Return book form
    return (
    <div>
    <div className="form-wrapper">
    <BookForm initialValues={formValues} 
      onSubmit={onSubmit} 
      enableReinitialize>
      Edit Book
    </BookForm>
    </div>
    <div className='form-wrapper'>
    <h1>Upload book cover</h1>
    {image.preview && <img src={image.preview} width='100' height='100' />}
    <hr></hr>
    <input type="file" name="file" onChange={handleFileChange}/>
    <button type="button" class="btn btn-success btn-block" onClick={handleSubmit}>Upload</button>
    </div>
    </div>
    )
}
  
// Export EditBook Component
export default EditBook