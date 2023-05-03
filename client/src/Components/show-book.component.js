import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Nav } 
        from "react-bootstrap";
import { BrowserRouter as Router, Routes,
    Route, Link } from "react-router-dom";

// ShowBook Component
const ShowBook = () => {
    const [data, setData] = useState('')
    const url = window.location.pathname
    const id = url.substring(url.lastIndexOf('/') + 1);
    const [vote, setVote] = useState('')
    const [user, setUser] = useState('')
    const nav = useNavigate()
    const [hasCover, setHasCover] = useState(false)

    //onSubmit handler
    useEffect (() => {
    axios
        .get(
            "http://localhost:8080/books/" + id, { headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
        )
        .then((res) => {
        if (res.status === 200) {
            setData(res.data)
            if (res.data.cover) {
                setHasCover(true)
            }
        } else Promise.reject();
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    function handleChange(event) {
        setVote(event.target.value)
    }

    function onClick() {
        setVote(vote)
        axios(
            {
          method: 'post',
          url: `http://localhost:8080/books/vote/${id}`,
          headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`},
          data: {vote}
        })
          .then(res => {
            if (res.status === 200) {
                alert('Successfully voted!');
                window.location.reload(true);

            }
          })
          .catch((error) => {
            alert(error.response.data.error)
        });
      }
    const roundedRating = String(Math.round(data.rating * 100) / 100)
    const isLoggedIn = localStorage.getItem('token')

    const isLoggedInForVote = () => {
        if (isLoggedIn) {
            return <th><input type="number" onChange={handleChange}/><button type="submit" onClick={onClick}>Submit</button></th>
        } else {
            return <th>Login or register to vote!</th>
        }
    }

    function onClickDelete() {
        axios(
            {
          method: 'delete',
          url: `http://localhost:8080/books/delete/${id}`,
          headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`},
        })
          .then(res => {
            if (res.status === 200) {
                alert('Successfully deleted!');
                nav("/")

            }
          })
          .catch(err => alert('Something went wrong'))
      }

    const deleteBookHandler = () => {
        if (isLoggedIn && ownerCheck()) {
            return <th>
            <button type="submit" onClick={onClickDelete}>Delete</button>
            <Nav>
            <Link to={{pathname: `/books/edit-book/${id}`, state: {id: id}}}><button type="submit">Edit</button></Link>
            </Nav>
            </th>
        }
    }

    const deleteColHandler = () => {
        if (isLoggedIn && ownerCheck()) {
            return <th>Action</th>
        }
    }

    // get user info
    useEffect (() => {
        if (isLoggedIn) {
            axios
            .get(
                "http://localhost:8080/users/me", { headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            )
            .then((res) => {
            if (res.status === 200) {
                setUser(res.data)
            } else Promise.reject();
            })
            .catch((error) => {
                console.log(error);
            });
        }
        }, []);
    
    const ownerCheck = () => {
        if (user._id === data.created_by) {
            return true
        }
    }

    const hasCoverHandler = () => {
		if (hasCover) {
			return <img src={`http://localhost:8080/books/${id}/cover`} alt="" />
		}
	}


    // Return book
    return (
        <div><Table striped bordered hover>
        <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Rating</th>
            <th>Cover</th>
            <th>Vote</th>
            {deleteColHandler()}
        </tr>
        <tr>
            <th>{data.name}</th>
            <th>{data.description}</th>
            <th>{roundedRating}</th>
            <th>{hasCoverHandler()}</th>
            {isLoggedInForVote()}
            {deleteBookHandler()}
        </tr>
        </thead>
    </Table></div>
    );
};
  
// Export ShowBook Component
export default ShowBook;