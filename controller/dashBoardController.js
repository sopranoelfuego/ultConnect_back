const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const ErrorResponse = require("../utils/errorResponse.js");

const dashBoardData = asyncHandler(async (req, res, next) => {
  const usersData = User.find({});
  const postsData = Post.find({});
  try {
    const [users, posts] = await Promise.all([usersData, postsData]);
    let womens = users?.filter((user) => user?.gender === "F")?.length;
    let mens = users?.filter((user) => user?.gender !== "F")?.length;

    return res.json({ success: true, users: {users:users?.length, womens, mens }, posts:posts?.length });
  } catch (err) {
    return next(new ErrorResponse("oops something went wrong", 400));
  }
});
module.exports = {
  dashBoardData,
};
