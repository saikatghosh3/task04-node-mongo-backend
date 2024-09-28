import {
  getPaginatedUsers,
  getUserFromId,
  bulkUpdateUserStatus,
  bulkDeleteUsersByIds,
} from "../services/userService.js";

const getUserInfo = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const user = await getUserFromId(userId);
    const { password, ...responseUser } = user;
    res.json(responseUser);
  } catch (error) {
    next(error);
  }
};
const getUsers = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    return res.json(await getPaginatedUsers(page, limit));
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

export const bulkUsersStatusUpdate = async (req, res, next) => {
  try {
    const { userIds, status } = req.body;

    const result = await bulkUpdateUserStatus(userIds, status);

    res.json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBulkUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    const result = await bulkDeleteUsersByIds(userIds);
    res.json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserInfo,
  getUsers,
  bulkUsersStatusUpdate,
  deleteBulkUsers,
};
