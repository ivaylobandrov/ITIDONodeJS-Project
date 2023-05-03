import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import BookTableRow from "./BookTableRow";

const YourBooks = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [query, setQuery] = useState("")

    useEffect(() => {
        axios
        .get(`http://localhost:8080/books/user?page=${page}&name=${query}`, { headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
        .then(({ data }) => {
            setData(data)
        })
        .catch((error) => {
            console.log(error);
        });
        
    }, [page, query]);
    
    useEffect(() => {
        if (data.books) {
            setPageCount(data.pagination.pageCount);
        }
    }, [data]);

    function handlePrevious() {
        setPage((p) => {
            if ( p === 1) return p;
            return p - 1; 
        });
    }

    function handleNext() {
        setPage((p) => {
            if ( p === pageCount) return p;
            return p + 1;
        })
    }

    const DataTable = () => {
        if (data.books) {
            return data.books.map((res, i) => {
                return <BookTableRow obj={res} key={i} />;
                });
        }
        return [];
    };

    return (
        <div className="table-wrapper">
            <h1>These are your uploaded Books</h1>
            <div className="searchbar">
                <input placeholder="Search by Book title" onChange={event => setQuery(event.target.value)}/>
            </div>
            <div><Table striped bordered hover>
            <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Cover</th>
            </tr>
            </thead>
            <tbody>{DataTable()}</tbody>
        </Table></div>
        <div>
        <footer>
            Page: {page} of {pageCount} &nbsp;
            <br /> 
            <button disabled={page === 1} onClick={handlePrevious}>Previous</button> &nbsp;
            <button disabled={page === pageCount} onClick={handleNext}>Next</button>
        </footer>
        </div>
        </div>
    );
};

export default YourBooks;
