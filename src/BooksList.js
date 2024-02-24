import React from "react";
import PropTypes from "prop-types";
import { sortBooksByTitle } from "./utils";

const BooksList = (props) => {
  const sortedShelf = sortBooksByTitle(props.shelf);

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{props.shelfName}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {sortedShelf.map((book) => (
            <li key={book.id}>
              <div className="book">
                <div className="book-top">
                  <div
                    className="book-cover"
                    style={{
                      width: 128,
                      height: 193,
                      backgroundImage: `url(${book.imageLinks.thumbnail})`,
                      backgroundSize: "100% 100%",
                    }}></div>
                  <div className="book-shelf-changer">
                    <select
                      defaultValue={book.shelf}
                      onChange={(event) => {
                        props.onShelfSelector(book, event.target.value);
                        if (event.target.value === "none") {
                          event.target.parentElement.previousElementSibling.classList.add("none");
                        }
                      }}>
                      <option value="move" disabled>
                        Move to...
                      </option>
                      <option value="currentlyReading">Currently Reading</option>
                      <option value="wantToRead">Want to Read</option>
                      <option value="read">Read</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authors}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

BooksList.propTypes = {
  shelfName: PropTypes.string.isRequired,
  shelf: PropTypes.array.isRequired,
  onShelfSelector: PropTypes.func.isRequired,
};

export default BooksList;
