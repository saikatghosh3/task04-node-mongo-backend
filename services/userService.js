import { userStatus } from "../config/user.js";
import { UserModel } from "../models/index.js";
import ApiError from "../utils/apiErrorClass.js";
import httpStatus from "http-status";
import { isValidObjectId } from "../utils/mongo.js";

const getUserFromId = async (userId) => {
  const user = await UserModel.findById(userId).lean();
  if (!user) {
    throw new ApiError("Invaid User Id");
  }
  return user;
};

const getPaginatedUsers = async (page = 1, limit = 10) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const items = await UserModel.find()
    .skip(skip)
    .limit(limitNumber)
    .select("-password")
    .exec();
  const totalItems = await UserModel.countDocuments();
  const totalPages = Math.ceil(totalItems / limitNumber);

  return {
    items,
    totalItems,
    totalPages,
    currentPage: pageNumber,
  };
};

const bulkUpdateUserStatus = async (userIds, newStatus) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ApiError(400, "User IDs must be an array with at least one ID");
  }
  // Validate that all IDs in the array are valid ObjectIds
  const areValidIds = userIds.every((id) => isValidObjectId(id));
  if (!areValidIds) {
    throw new ApiError(400, `One or more invalid ObjectIds`);
  }

  // Check if the provided status is valid
  if (!userStatus.includes(newStatus)) {
    throw new ApiError(
      400,
      `Invalid status, available status: ${JSON.stringify(userStatus)}`
    );
  }

  try {
    const result = await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { status: newStatus } }
    );
    if (result.nModified === 0) {
      throw new ApiError(404, "No users found to update");
    }
    return result;
  } catch (error) {
    throw new ApiError(500, "Failed to update user status");
  }
};

const bulkDeleteUsersByIds = async (userIds) => {
  try {
    // Validate that all IDs in the array are valid ObjectIds
    const areValidIds = userIds.every((id) => isValidObjectId(id));
    if (!areValidIds) {
      throw new ApiError(400, `One or more invalid ObjectIds`);
    }

    const result = await UserModel.deleteMany({
      _id: { $in: userIds },
    });
    if (result.deletedCount === 0) {
      throw new ApiError(400, "No users found to delete");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const isUserExists = async (userId) =>
  await UserModel.exists({
    _id: userId,
  });

const createNewUser = async (user) => {
  const oldUser = await UserModel.findOne({ email: user.email.toLowerCase() });
  if (oldUser) {
    throw new ApiError(400, "Email already exists");
  }
  const newUser = await UserModel.create(user);
  if (!newUser) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Oops...seems our server needed a break!"
    );
  }
  return newUser;
};

const fetchUserFromEmail = async ({ email }) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean();

  if (!user) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "please sign up - this email does not exist"
    );
  }

  return user;
};
export {
  getUserFromId,
  isUserExists,
  createNewUser,
  fetchUserFromEmail,
  getPaginatedUsers,
  bulkUpdateUserStatus,
  bulkDeleteUsersByIds,
};
