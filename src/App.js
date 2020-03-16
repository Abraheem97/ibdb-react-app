import "./App.css";
import Books from "./components/books";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./components/NavBar";
import { Route, Switch, Redirect } from "react-router-dom";
import Book from "./components/book";
import Author from "./components/author";
import NotFound from "./components/not-found";
import React, { Component } from "react";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import ConfirmEmail from "./components/confirmEmail";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { get_users } from "./Services/userService";

class App extends Component {
  state = { isLoggedIn: false, user: {}, alerts: {} };

  handleSignIn = user => {
    this.setState({ user, isLoggedIn: true });
    Cookies.set("isLoggedIn", true);
    Cookies.set("user_email", user.email);
    Cookies.set("user_id", user.id);
    Cookies.set("user_authentication_token", user.authentication_token);
    this.props.history.push("/");
  };

  handleSignUp = () => {
    this.props.history.push("/signed_up");
  };

  handleSignOut = () => {
    axios({
      method: "delete",
      url: `http://localhost:3001/v1/sessions/${this.state.user.id}`,
      data: {
        id: this.state.user.id
      }
    })
      .then(res => {
        let alerts = { ...this.state.alerts };
        alerts.sign_out = "You have successfully signed out!";
        this.setState({ user: {}, isLoggedIn: false, alerts: alerts });
      })
      .catch(errors => {});
    // $.ajax({
    //   method: "POST",
    //   url: "http://localhost:3001/v1/sessions",
    //   data: {
    //     user: {
    //       email: "superadmin@ibdb.com",
    //       password: "password"
    //     }
    //   }
    // }).done(function(data) {});

    Object.keys(Cookies.get()).forEach(function(cookieName) {
      var neededAttributes = {};
      Cookies.remove(cookieName, neededAttributes);
    });
  };

  componentDidMount() {
    let user = { ...this.state.user };
    let isLoggedIn = false;
    user.email = Cookies.get("user_email");
    user.id = Cookies.get("user_id");
    user.authentication_token = Cookies.get("user_authentication_token");
    isLoggedIn = Boolean(Cookies.get("isLoggedIn"));

    this.setState({ isLoggedIn: isLoggedIn, user: user });
  }
  render() {
    return (
      <div>
        <NavBar
          user={this.state.user}
          handleSignOut={this.handleSignOut}
          signed_in={this.state.isLoggedIn}
        />

        <br></br>

        <div className="container">
          {this.state.alerts.sign_out && (
            <div className="alert alert-success">
              {this.state.alerts.sign_out}
            </div>
          )}
          <Switch>
            <Route path="/books/:id/author" component={Author} />
            <Route path="/books/:id" component={Book} />
            <Route
              path="/login"
              render={() => <SignIn handleSignIn={this.handleSignIn} />}
            />
            <Route
              path="/signup"
              render={() => (
                <SignUp
                  handleSignUp={this.handleSignUp}
                  signed_in={this.state.isLoggedIn}
                />
              )}
            />
            <Route path="/signed_up" component={ConfirmEmail} />
            <Route path="/books" component={Books} />
            <Route path="/users/confirmation" component={Books} />
            <Route path="/not-found" component={NotFound} />
            <Route path="/" exact component={Books} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);