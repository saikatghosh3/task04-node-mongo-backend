import { UserModel } from "../models/index.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/apiErrorClass.js";
import httpStatus from "http-status";
import { UNBLOCKED } from "../config/user.js";

const fetchUserFromEmailAndPassword = async (email, password) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }

  // Validate the password
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }

  // Check if the user is blocked
  if (user.status !== UNBLOCKED) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized access - user blocked"
    );
  }

  return user;
};

const verifyUserFromRefreshTokenPayload = async ({ userId }) => {
  const user = await UserModel.findById({
    _id: userId,
  }).lean();

  if (!user) {
    throw new APIError(httpStatus.FORBIDDEN, "Invalid Refresh Token - logout");
  }
  return user;
};

const fetchUserFromAuthData = async ({ userId }) => {
  const user = await UserModel.findOne({
    _id: userId,
  }).lean();

  if (!user) {
    throw new APIError(httpStatus.UNAUTHORIZED, "invalid access token user");
  }

  return user;
};

const verifyCurrentPassword = async (userId, password) => {
  const user = await UserModel.findOne({
    _id: userId,
  })
    .select("password")
    .lean();

  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new APIError(httpStatus.BAD_REQUEST, "invalid current password");
  }
};

const updatePassword = async (userId, newPassword) => {
  let newHash = await bcrypt.hash(newPassword, 10);

  let user = await UserModel.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      password: newHash,
    },
    {
      new: true,
    }
  );
};

export {
  fetchUserFromEmailAndPassword,
  verifyUserFromRefreshTokenPayload,
  fetchUserFromAuthData,
  verifyCurrentPassword,
  updatePassword,
};
