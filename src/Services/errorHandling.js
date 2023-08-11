export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(new Error(error));
    });
  };
};

export const globalErrorHandel = (err, req, res, next) => {
  if (process.env.MOOD == "DEV") {
    return res
      .status(err?.cause || 500)
      .json({ message: "catch error", error: err });
  }
  return res.status(err?.cause || 500).json({ message: "catch error", error: err.stack });
};
