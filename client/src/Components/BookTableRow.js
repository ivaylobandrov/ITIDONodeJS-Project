import { React } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookTableRow = (props) => {
	const { _id, name, description, rating, cover } = props.obj;

	const roundedRating = String(Math.round(rating * 100) / 100)

	const hasCoverHandler = () => {
		if (cover) {
			return <img src={`http://localhost:8080/books/${_id}/cover`} alt="" />
		}
	}

	return (
		<tr>
		<td>
			<Nav>
			<Link to={{pathname: `/books/${_id}`, state: {id: _id}}}>{name}</Link>
			</Nav>
		</td>
		<td>{description}</td>
		<td>{roundedRating}</td>
		<td>{hasCoverHandler()}</td>
		</tr>
		
	);
};

export default BookTableRow;
