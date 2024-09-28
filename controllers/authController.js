import bcryptjs from "bcryptjs";
import {
  fetchUserFromEmailAndPassword,
  updatePassword,
  verifyCurrentPassword,
  verifyUserFromRefreshTokenPayload,
} from "../services/authService.js";
import {
  generateAuthTokens,
  clearRefreshToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshTokenPayload,
} from "../services/tokenService.js";

import { createNewUser, getUserFromId } from "../services/userService.js";

const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await createNewUser({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const { password: _, ...user } = newUser.toObject();
    const tokens = await generateAuthTokens(newUser);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const fetchedUser = await fetchUserFromEmailAndPassword(email, password);

    if (!fetchedUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update the lastLogin field
    fetchedUser.lastLogin = Date.now();
    await fetchedUser.save();

    // Exclude the password from the returned user
    const { password: _, ...userWithoutPassword } = fetchedUser.toObject();

    const tokens = await generateAuthTokens(userWithoutPassword);

    res.json({ user: userWithoutPassword, tokens });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await clearRefreshToken(req.body.refreshToken);
    res.json({});
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    let refreshTokenPayload = await verifyRefreshToken(req.body.refreshToken);
    const { password: _, ...user } = await verifyUserFromRefreshTokenPayload(
      refreshTokenPayload
    );
    let newAccessToken = await generateAccessTokenFromRefreshTokenPayload(
      refreshTokenPayload
    );

    res.json({
      accessToken: newAccessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await verifyCurrentPassword(req.authData.userId, req.body.password);
    await updatePassword(req.authData.userId, req.body.newPassword);

    res.json({});
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  const { userId } = req.authData;
  try {
    const user = await getUserFromId(userId);
    const { password, ...responseUser } = user;
    res.json(responseUser);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  logout,
  refreshToken,
  resetPassword,
  register,
  me,
};
