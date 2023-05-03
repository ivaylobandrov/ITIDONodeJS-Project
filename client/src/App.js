import React, { useState, useEffect, Auth } from "react";
import { Nav, Navbar, Container, Row, Col } 
        from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter as Router, Routes,
    Route, Link } from "react-router-dom";
import CreateBook from 
    "./Components/create-book.component";
import BookList from 
    "./Components/book-list.component";
import LoginUser from "./Components/login.component";
import YourBooks from "./Components/your-books.component"
import ShowBook from "./Components/show-book.component"
import axios from 'axios';
import EditBook from "./Components/edit-book.component";
import CreateUser from "./Components/create-user.component";
  
// App Component
const App = () => {

  const LogoutUser = () => {
    // onClick handler
    const onClick = (userObject) => {
      axios.post(
      'http://localhost:8080/users/logout',
      userObject,
      { headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
          if (res.status === 200) {
              localStorage.clear()
              window.location.reload()
          } else {
              Promise.reject()
          }
        })
        .catch(err => alert('Something went wrong'))
    }
    return onClick()
  }

  const isLoggedIn = localStorage.getItem('token')
  
  const renderLogOutButton = () => {
    if (isLoggedIn) {
        return <Nav>
          <Link to={"/books/user"} 
          className="nav-link">
          Your Books
        </Link>
          <Nav>
          <Link to={"/books/create-book"} 
            className="nav-link">
            Upload Book
          </Link>
        </Nav>
        <Nav>
      </Nav><Nav onClick={LogoutUser}>
        <Link to={"/"}
          className="nav-link">
          Logout
        </Link>
      </Nav></Nav>
    } else {
          return <Nav>
          <Link to={"/users/login"} 
          className="nav-link">
          Login/Sign up
        </Link>
        </Nav>
    }
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand>
                <Link to={"/"} 
                  className="nav-link">
                  Book App
                </Link>
              </Navbar.Brand>
                  {renderLogOutButton()}
            </Container>
          </Navbar>
        </header>
  
        <Container>
          <Row>
            <Col md={12}>
              <div className="wrapper">
                <Routes>
                  <Route exact path="/" element={<BookList/>} />
                  <Route path="/books/create-book" element={<CreateBook/>} />
                  <Route path="/books/user" element={<YourBooks/>}></Route>
                  <Route path="/users/login" element={<LoginUser/>}></Route>
                  <Route path="/" element={<LogoutUser/>}></Route>
                  <Route path="/books/:id" element={<ShowBook/>} />
                  <Route path="/books/edit-book/:id" element={<EditBook/>} />
                  <Route path="/users" element={<CreateUser/>} />
                </Routes>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
};
  
export default App;
