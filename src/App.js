import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import SearchBook from "./SearchBook";
import BooksList from "./BooksList";

const BooksApp = () => {
  const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState([]);
  const [wantToReadBooks, setWantToReadBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [bookNotFound, setBookNotFound] = useState([]);

  useEffect(() => {
    getAllBooks();
  }, []);

  const getAllBooks = () => {
    BooksAPI.getAll()
      .then((books) => {
        const currentlyReading = [];
        const wantToRead = [];
        const read = [];
        const allBooks = [];

        books.forEach((book) => {
          if (book.shelf === "currentlyReading") {
            currentlyReading.push(book);
          } else if (book.shelf === "wantToRead") {
            wantToRead.push(book);
          } else if (book.shelf === "read") {
            read.push(book);
          }
          allBooks.push(book);
        });

        setCurrentlyReadingBooks(currentlyReading);
        setWantToReadBooks(wantToRead);
        setReadBooks(read);
        setAllBooks(allBooks);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const changeShelf = (book, updatedShelf) => {
    BooksAPI.update(book, updatedShelf).then(() => {
      getAllBooks();
    });
  };

  const searchQuery = (query) => {
    const emptyBook = {
      id: 0,
      imageLinks: {
        thumbnail:
          "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png",
      },
    };

    setQuery(query);

    if (query.length === 0) {
      setQuery("");
      setSearchResult([]);
      setBookNotFound([]);
      return;
    } else {
      BooksAPI.search(query.trim()).then((response) => {
        if (response.error !== "empty query") {
          response.forEach((queryBook) => {
            if (queryBook.imageLinks === undefined) {
              queryBook.imageLinks = {};
              queryBook.imageLinks.thumbnail = "https://inc.mizanstore.com/aassets/img/com_cart/produk/no_cover.jpg";
            }
            if (queryBook.authors === undefined) {
              queryBook.authors = ["Various authors"];
            }
          });

          response = response.map((searchedBook) => {
            for (const book of allBooks) {
              if (searchedBook.id === book.id) {
                searchedBook.shelf = book.shelf;
                break;
              } else {
                searchedBook.shelf = "none";
              }
            }
            return searchedBook;
          });

          setSearchResult(response);
        } else {
          setBookNotFound([emptyBook]);
          setSearchResult([]);
        }
      });
    }
  };

  return (
    <div className="app">
      <div className="list-books">
        <div className="list-books-title">
          <h1>My Reads</h1>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="list-books-content">
                <div>
                  <BooksList
                    shelf={currentlyReadingBooks}
                    shelfName="Currently Reading"
                    onShelfSelector={changeShelf}
                  />
                  <BooksList shelf={wantToReadBooks} shelfName="Want To Read" onShelfSelector={changeShelf} />
                  <BooksList shelf={readBooks} shelfName="Read" onShelfSelector={changeShelf} />
                </div>
              </div>
            }
          />
          <Route
            path="/search"
            element={
              <SearchBook
                bookFoundList={searchResult}
                emptyList={bookNotFound}
                onQuery={query}
                onSearch={searchQuery}
                onShelfSelector={changeShelf}
              />
            }
          />
        </Routes>

        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    </div>
  );
};

export default BooksApp;
