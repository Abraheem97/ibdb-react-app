import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import SearchBox from "./searchBox";
import { Button } from "react-bootstrap";

class Books extends Component {
  state = {
    books: [],
    searchQuery: "",
    imageUrl: "https://picsum.photos/250/300"
  };

  imageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  };
  textCenter = {
    textAlign: "center"
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/books.json`)
      .then(res => res.json())
      .then(data => {
        this.setState({ books: data });
      });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query });
  };

  getSearch = () => {
    const { books, searchQuery } = this.state;

    let filteredBooks = books.filter(book => {
      return book.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    });
    return filteredBooks;
  };

  render() {
    return (
      <React.Fragment>
        {!this.props.isLoggedIn && (
          <div className="jumbotron" style={{ paddingBottom: 20 }}>
            <h1> Your Favourite Books Reviewed!</h1>
            <p>
              IBDB is international books review site, here you can find books
              of all genres and authors and give those books a review very
              easily.
            </p>
            <p style={{ paddingTop: 10 }}>
              <Link to="/signup">
                <Button>Sign up to write a review</Button>
              </Link>
            </p>

            <p>
              <Link to="/login">
                <Button>Sign in</Button>
              </Link>
            </p>
          </div>
        )}
        <SearchBox
          value={this.state.searchQuery}
          onChange={this.handleSearch}
        />
        <div className="row align-items-start">
          {this.getSearch().map(book => (
            <div key={book.id} className="col-sm-6 col-md-4 p-3">
              <div style={this.textCenter}>
                <h5>
                  <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h5>
                <div className="caption">
                  <Link to={`/books/${book.id}`}>
                    <img
                      onClick={this.openBook}
                      className="mimg"
                      style={this.imageStyles}
                      src="https://damonza.com/wp-content/uploads/portfolio/nonfiction/Set%20For%20Life%202.jpg"
                      // src={`${process.env.REACT_APP_API_URL}/assets/${book.image_file_name}`}
                      alt="bookcover.jpg"
                    />
                  </Link>
                  <br style={this.textCenter}></br>
                  By {book.author_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Books;
