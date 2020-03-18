import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { getBook } from "../Services/bookService";
import { getComments } from "../Services/bookService";
import { getReviews } from "../Services/bookService";
import Comment from "./comment";
import Review from "./review";
import CommentForm from "./commentForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "js-cookie";
import StarRatings from "react-star-ratings";
import { hasReviewedBook } from "../Services/userService";

class Book extends Component {
  state = {
    book: {},
    id: {},
    comments: [],
    reviews: [],
    currentUserHasReviewedBook: {}
  };

  imageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 5
  };

  textCenter = {
    textAlign: "center"
  };

  handleCommentSubmit = comment => {
    const comments = [comment, ...this.state.comments];
    this.setState({ comments });
  };

  handleReplySubmit = reply => {
    const comments = [reply, ...this.state.comments];
    this.setState({ comments });
  };
  componentDidMount() {
    {
      Boolean(Cookies.get("isLoggedIn")) &&
        hasReviewedBook(
          Cookies.get("user_id"),
          this.props.match.params.id
        ).then(res => {
          this.setState({ currentUserHasReviewedBook: res.data.hasReviewed });
        });
    }
    this.setState({ id: this.props.match.params.id });
    getBook(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ book: resp });
    });

    getComments(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ comments: resp });
    });

    getReviews(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ reviews: resp });
    });
  }

  openBook = () => {};
  openBook = () => {};
  render() {
    let parentComments = this.state.comments.filter(
      comment => comment.parent_id === null
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-6 col-md-4" style={this.textCenter}>
            <div className="thumbnail thumb-box">
              <div className="caption">
                <h3>{this.state.book.title}</h3>
                <div>
                  <img
                    style={this.imageStyles}
                    src={`http://localhost:3001/assets/${this.state.book.image_file_name}`}
                    alt="bookcover.jpg"
                  />
                </div>
                <Link to={`/books/${this.state.book.id}/author`}>
                  By {this.state.book.author_name}
                </Link>
                {!this.state.currentUserHasReviewedBook &&
                  Boolean(Cookies.get("isLoggedIn")) && (
                    <ReviewModal book_id={this.state.id} />
                  )}
              </div>
            </div>
          </div>

          <div className="col-md-7 col-md-offset-1" style={this.textCenter}>
            <h1>Reviews</h1>
            {this.state.reviews.slice(0, 2).map(review => (
              <Review
                user_id={review.user_id}
                key={review.id}
                rating={review.rating}
                comment={review.comment}
              />
            ))}
            {this.state.reviews.length > 2 && (
              <Link to={`/books/${this.state.id}/reviews`}>Show more</Link>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div style={this.textCenter}>
              <h1> Comments</h1>
              <br></br>
              <CommentForm
                handleSubmit={this.handleCommentSubmit}
                book_id={this.state.id}
              />
            </div>
            {parentComments.map(comment => (
              <div key={comment.id} className="jumbotron">
                <Comment
                  handleResponse={this.handleReplySubmit}
                  book_id={this.state.id}
                  comments={this.state.comments}
                  comment={comment}
                  replies={this.state.comments.filter(
                    reply => reply.parent_id === comment.id
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Book;

function ReviewModal(params) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [Rating, setRating] = useState(1);

  const handleClose = () => {
    setModalIsOpen(false);
  };

  const changeRating = newRating => {
    setRating(newRating);
  };
  const handleShow = () => setModalIsOpen(true);

  const handleSubmit = e => {
    e.preventDefault();
    handleClose();

    axios({
      method: "post",
      url: `http://localhost:3001/books/${params.book_id}/reviews`,

      data: {
        review: {
          user_id: Cookies.get("user_id"),
          comment: e.target.Reply.value,
          rating: Rating
        }
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    })
      .then(res => params.handleResponse(res))
      .catch(errors => {
        if (errors) {
          console.log(errors);
        }
      });
  };

  return (
    <div>
      <Button size="sm" onClick={handleShow} style={{ margin: 5 }}>
        Add a review
      </Button>

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Tell us about the book</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <StarRatings
            rating={Rating}
            starRatedColor="gold"
            changeRating={changeRating}
            numberOfStars={5}
            name="rating"
            starDimension="35px"
            starSpacing="5px"
            starEmptyColor="lightblue"
            starHoverColor="gold"
          />
          <Form.Group controlId="body">
            <Form.Control autoFocus type="text" name="Reply" required />
          </Form.Group>
          <Form.Group>
            <Button variant="primary" type="submit">
              Add review
            </Button>
          </Form.Group>
        </Form>
      </Modal>
    </div>
  );
}
