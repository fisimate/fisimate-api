import { Prisma } from "@prisma/client";

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal server error!",
  };

  let error = { ...err };

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    customError.statusCode = 400;

    switch (err.code) {
      case "P2002":
        customError.message = `Duplicate field value: ${err.meta.target}`;
        break;
      case "P2014":
        customError.message = `Invalid ID: ${err.meta.target}`;
        break;
      case "P2003":
        customError.message = `Invalid input data: ${err.meta.target}`;
        break;
      case "P2025":
        customError.message = `Related record not found: ${err.meta.target}`;
        break;
      default:
        customError.message = `Something wrong: ${err.message}`;
        break;
    }
  } else if (error.name === "JsonWebTokenError") {
    customError.statusCode = 400;
    customError.message = `Token tidak valid!`;
  } else if (error.name === "TokenExpiredError") {
    customError.statusCode = 401;
    customError.message = `Token expired!`;
  }

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    data: null,
  });
};

export default errorHandlerMiddleware;
