import React, { useState, useEffect } from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
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
      <HashRouter basename={`/`}>
        <Switch>
          {loggedIn ? (
            <Route exact path={`/`} component={Home} />
          ) : (
            <Route exact path={`/`} component={StartPage} />
          )}
          <Route exact path={`/stargtpage`} component={StartPage} />
          <Route path={`/home`} component={Home} />
          <Route path={`/register`} component={Register} />
          <Route path={`/login`} component={Login} />
          <Route path={`/wishlist`} component={UserWishlist} />
          <Route exact path={`/list/:listId`} component={SingleWishList} />
        </Switch>
      </HashRouter>
    </>
  );
}
