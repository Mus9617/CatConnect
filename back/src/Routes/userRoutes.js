const express = require('express');
const { register, login, verifyEmail, ForgotPassword, CreatePost, deletePost, updatePost, insertAvatarPicture, getallUsers, AllAnnonce, getallUser,AnnonceByusername, getmyPosts, getUsers, likePost, changeVerifiedStatus, followUser, contact  } = require('../Controllers/userController');
const router = express.Router();
const { middleURL } = require('../../ouils/middle.js');
const { getDefaultLang } = require('validatorjs');

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email").get(verifyEmail);
router.route("/Forgot-password").post(ForgotPassword);
router.route("/create-post").post (CreatePost);
router.route("/delete-post/:id").delete(deletePost);
router.route("/update-post/:id").patch(updatePost);
router.route("/insert-avatar").post(insertAvatarPicture);
router.route("/getallusers").get(getallUsers);
router.route("/allposts").get(AllAnnonce);
router.route("/allusers").get(getallUser)
router.route("/useridfind").get(AnnonceByusername);
router.route("/getmyposts").get(getmyPosts)
router.route("/getUsers").get(getUsers)
router.route("/likes/:id").patch(likePost)
router.route("/comments/:id").patch(likePost)
router.route("/followers/:id").patch(likePost)
router.route("/changestatus/:uuid").patch(changeVerifiedStatus)
router.route("/email").post(contact)
module.exports = router;