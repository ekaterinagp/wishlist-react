import React, { useEffect, useState } from "react";
import "../css/profile.css";
import AddComment from "./common/AddComment";
import axios from "axios";
import Header from "./Header";
import UploadFirebase from "./UploadFirebase";
import AddWish from "./AddWish";
import Notification from "./common/Notification";
import UpdateUser from "./UpdateUser";
import UpdateDetails from "./UpdateDetails";

export default function UserWishlist() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [wishlist, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notAuth, setNotAuth] = useState(false);
  const [followers, setFollowers] = useState("");
  const [details, setDetails] = useState("");
  const [init, setInit] = useState(true);

  const [notification, setNotification] = useState({
    msg: "",
    id: "",
  });
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
  });

  let userId = localStorage.getItem("id");

  const fetchDetailsCommentsWishes = async () => {
    setInit(false);

    const res = await axios
      .get(`https://wish-back.herokuapp.com/list/${userId}`)
      .catch((error) => console.log(error));
    console.log(res);
    if (res.data.wishes) {
      if (init) {
        res.data.wishes.forEach((one) => {
          one.commentsAreOpen = false;
        });
      } else {
        wishlist.forEach((wish) => {
          let found = res.data.wishes.find((one) => one.id === wish.id);
          found.commentsAreOpen = wish.commentsAreOpen;
        });
      }
      res.data.wishes.forEach((one) => {
        console.log(one);
        if (one.comments.length) {
          one.comments.reverse();
        }
      });

      setWishList(res.data.wishes);
    }

    setUserData({
      name: res.data.name,
      lastName: res.data.lastName,
      email: res.data.email,
    });
    setInit(false);
    setLoading(false);
  };

  const fetchUserDetails = async () => {
    const res = await axios
      .get(`https://wish-back.herokuapp.com/user/${userId}`)
      .catch((error) => console.log(error));

    setUserData({
      name: res.data.firstName,
      lastName: res.data.lastName,
      email: res.data.email,
    });

    setLoading(false);
  };

  const fetchFollowers = async () => {
    setLoading(true);

    const res = await axios
      .get(`https://wish-back.herokuapp.com/followers/${userId}`)
      .catch((error) => console.log(error));

    console.log(res.data);

    setFollowers(res.data);
    setLoading(false);
  };

  const fetchDetails = async () => {
    setLoading(true);

    const res = await axios
      .get(`https://wish-back.herokuapp.com/details/${userId}`)
      .catch((error) => console.log(error));
    console.log(res.data);

    if (res.data) {
      setDetails(res.data);
    }

    setLoading(false);
  };

  const confirmDelete = (id) => {
    resetState();

    setNotification({
      msg: "Are you sure you want to delete this wish?",
      id: id,
    });
  };

  const deleteWish = async (id) => {
    const token = localStorage.getItem("token");

    const res = await axios
      .delete(`https://wish-back.herokuapp.com/deletewish/${id}`, token)
      .catch((error) => console.log(error));

    resetState();

    const updatedWishes = await axios
      .get(`https://wish-back.herokuapp.com/list/${userId}`)
      .catch((error) => console.log(error));

    setWishList(updatedWishes.data.wishes);
  };

  const deleteComment = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios
      .delete(`https://wish-back.herokuapp.com/deletecomment/${id}`, token)
      .catch((error) => console.log(error));
    console.log(res);
    fetchDetailsCommentsWishes();
  };

  const resetState = () => {
    setNotification({
      msg: "",
      id: "",
    });
  };

  const toggleComments = (id) => {
    console.log("opencomments", id);
    console.log(wishlist);
    wishlist.forEach((one) => {
      if (one.id === id) {
        console.log(one);
        one.commentsAreOpen = !one.commentsAreOpen;
      }
    });
    setWishList([...wishlist]);
  };

  const toggleUpdate = () => {
    setIsOpen(!isOpen);
  };

  const toggleUpdateDetails = () => {
    setIsOpenDetails(!isOpenDetails);
  };

  useEffect(() => {
    if (localStorage.getItem("id")) {
      setLoading(true);
      fetchUserDetails();
      fetchFollowers();
      fetchDetails();
      fetchDetailsCommentsWishes();
      setLoading(false);
    } else {
      setNotAuth(true);
    }
  }, []);

  return (
    <>
      {notAuth ? (
        <p>You should log in to see list</p>
      ) : (
        <>
          <Header />
          <div className="height">
            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <div className="user-profile">
                <div className="profile">
                  {userData !== null ? (
                    <div className="user-details">
                      <h2>
                        {userData.name} {userData.lastName}
                      </h2>
                      <h3>{userData.email}</h3>

                      <div className="user-button-update">
                        {" "}
                        <button
                          className="example_b toggle"
                          onClick={toggleUpdate}
                        >
                          Update settings
                        </button>
                        {isOpen ? (
                          <UpdateUser
                            userData={userData}
                            fetchHandler={fetchUserDetails}
                            open={setIsOpen}
                          />
                        ) : null}
                      </div>

                      <div className="user-data">
                        <div className="followers">
                          <p>Size</p>{" "}
                          <p className="follow-number">
                            {details.size ? details.size : null}
                          </p>
                        </div>
                        <div className="followers">
                          <p>Color</p>{" "}
                          <p className="follow-number">
                            {details.color ? details.color : null}
                          </p>
                        </div>
                        <div className="followers">
                          <p>Shop</p>{" "}
                          <p className="follow-number">
                            {details.shop ? details.shop : null}
                          </p>
                        </div>
                      </div>
                      <div className="user-button-update">
                        <button
                          className="example_b toggle"
                          onClick={toggleUpdateDetails}
                        >
                          Update preferences
                        </button>
                        {isOpenDetails ? (
                          <UpdateDetails
                            userData={details}
                            fetchHandler={fetchDetails}
                            open={setIsOpenDetails}
                          />
                        ) : null}
                      </div>
                      <div className="user-data">
                        {followers != "" ? (
                          <>
                            <div className="followers">
                              <p>Following </p>
                              <p className="follow-number">
                                {followers.follows.length}
                              </p>
                            </div>
                            <div className="followers">
                              <p>Followers </p>
                              <p className="follow-number">
                                {followers.followers.length}
                              </p>
                            </div>{" "}
                          </>
                        ) : (
                          <>
                            <div className="followers">
                              <p>Following </p>
                              <p className="follow-number">0</p>
                            </div>
                            <div className="followers">
                              <p>Followers </p>
                              <p className="follow-number">0</p>
                            </div>{" "}
                          </>
                        )}

                        <div className="followers">
                          <p>Wishes </p>
                          <p className="follow-number">
                            {!wishlist ? "0" : wishlist.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p> Please log in </p>
                  )}
                </div>
                {console.log(wishlist)}
                {notification.msg ? (
                  <Notification
                    msg={notification.msg}
                    id={notification.id}
                    parentMethod={deleteWish}
                    resetState={resetState}
                  />
                ) : null}
                {wishlist.length ? (
                  <div className="user-wishes masonry">
                    {wishlist.map(
                      ({
                        id,
                        wish,
                        desc,
                        comments,
                        imgURL,
                        commentsAreOpen,
                      }) => (
                        <div
                          className="article card-1 masonry-brick"
                          key={`random-${desc}`}
                        >
                          <div className="top-div-wish">
                            {" "}
                            <p
                              className="delete-btn"
                              onClick={() => confirmDelete(id)}
                            >
                              &#10006;
                            </p>
                            <h2 className="list-title">{wish}</h2>
                            <p className="description">{desc}</p>
                            <div id={id}>
                              <UploadFirebase
                                wishID={id}
                                img={imgURL}
                                parentMethod={fetchDetailsCommentsWishes}
                              />
                            </div>
                          </div>
                          <button
                            id={id}
                            className="example_b toggle"
                            onClick={() => toggleComments(id)}
                          >
                            Comments
                          </button>

                          <div
                            className="containerToggle"
                            id={id}
                            style={{
                              display: commentsAreOpen ? "block" : "none",
                            }}
                          >
                            <div className="middle-div-comments">
                              {console.log(comments)}
                              {comments.map(
                                ({
                                  text,
                                  created,
                                  firstName,
                                  lastName,
                                  id,
                                }) => {
                                  return (
                                    <div className="commentOne" key={text}>
                                      <p className="comment-author">
                                        {firstName} {lastName}
                                      </p>
                                      <p className="comment-text">{text}</p>

                                      <p className="comment-time">{created}</p>
                                      {console.log(id)}
                                      <p
                                        className="delete-comment"
                                        onClick={() => deleteComment(id)}
                                        id={id}
                                      >
                                        Delete comment
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                            <div className="bottom-div-add-comment">
                              <AddComment
                                listId={id}
                                parentMethod={fetchDetailsCommentsWishes}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div className="article">
                      <AddWish parentMethod={fetchDetailsCommentsWishes} />
                    </div>
                  </div>
                ) : (
                  <div className="create-list">
                    <h2>Create your wish list</h2>
                    <div className="article">
                      <AddWish parentMethod={fetchDetailsCommentsWishes} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
