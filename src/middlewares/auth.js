import UnauthenticatedError from "../errors/unauthenticated.js";
import { isTokenValid } from "../lib/jwt.js";
import prisma from "../lib/prisma.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      throw new UnauthenticatedError("Permission denied");
    }

    next();
  };
};

export const authenticateUser = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new UnauthenticatedError("Authentication invalid!");
    }

    const payload = isTokenValid({ token });

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new UnauthenticatedError("Authentication invalid!");
    }

    req.user = {
      id: payload.id,
      fullname: payload.fullname,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
