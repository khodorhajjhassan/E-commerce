import jwt_decode from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  } catch (error) {
    return true; // In case of any error, assume token is expired
  }
};
