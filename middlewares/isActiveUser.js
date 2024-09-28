import APIError from '../utils/apiErrorClass.js';
import httpStatus from 'http-status';
import { tokenTypes } from '../config/tokens.js';
import { verify } from '../utils/jwtHelpers.js';
import { env } from '../config/env.js';
import {isRefreshTokenExist} from "../services/tokenService.js";
import { getUserFromId } from "../services/userService.js";
import { UNBLOCKED } from '../config/user.js';
const isActiveUser = async (req, res, next) => {
  try {
    const accessToken = req.get('Authorization')?.split(" ")[1];
    if (!accessToken) {
      throw new APIError(httpStatus.UNAUTHORIZED, 'Invalid Access Token');
    }

    let tokenPayload = await verify(accessToken, env("JWT_SECRET"));

    if (!tokenPayload || tokenPayload.type !== tokenTypes.ACCESS) {
      throw new APIError(httpStatus.UNAUTHORIZED, 'Invalid Access Token');
    }

    let user = await getUserFromId(tokenPayload.userId);

    if (!user) {
      throw new APIError(httpStatus.FORBIDDEN, 'Invalid Access Token - logout');
    }

    if(user.status !== UNBLOCKED) {
      throw new APIError(httpStatus.FORBIDDEN, 'Unauthorized access - user blocked');
    }
    const {userId, loginTime} = tokenPayload;

    let refreshTokenExists = await isRefreshTokenExist(userId, loginTime);
 
    if (!refreshTokenExists) {
      throw new APIError(httpStatus.FORBIDDEN, 'Invalid Access Token - logout');
    }

    req.authData = tokenPayload;

    next();
  } catch (error) {
    next(error);
  }
};

export { isActiveUser };
