import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Check for token in the "x-auth-token" header or in "Authorization" header
  const token =
    req.header("x-auth-token") ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains user id and role
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
