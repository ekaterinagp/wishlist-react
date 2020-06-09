import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import Upload from "./components/Upload";
import Header from "./components/Header";
import StartPage from "./components/StartPage";
import axios from "axios";

import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import UserWishlist from "./components/UserWishlist";
import SingleWishList from "./components/SingleWishList";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const token = localStorage.getItem("auth-token");

  const checkUserLoggedIn = async () => {
    if (token) {
      const tokenRes = await axios.post(
        "https://wish-back.herokuapp.com/tokenIsValid",

        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setLoggedIn(true);
      // console.log(tokenRes);
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  return (
    <>
      <BrowserRouter basename={"/wishlist-react"}>
        <Switch>
          {loggedIn ? (
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
          ) : (
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/`}
              component={StartPage}
            />
          )}
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/stargtpage`}
            component={StartPage}
          />
          <Route path={`${process.env.PUBLIC_URL}/home`} component={Home} />
          <Route
            path={`${process.env.PUBLIC_URL}/register`}
            component={Register}
          />
          <Route path={`${process.env.PUBLIC_URL}/login`} component={Login} />
          <Route
            path={`${process.env.PUBLIC_URL}/wishlist`}
            component={UserWishlist}
          />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/list/:listId`}
            component={SingleWishList}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
}
