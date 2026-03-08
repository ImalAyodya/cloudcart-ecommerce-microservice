const axios = require("axios");
const {
  USER_SERVICE_URL
} = require("../config/config");

const validateUser = async (authorizationHeader) => {
  const response = await axios.get(`${USER_SERVICE_URL}/api/auth/profile`, {
    headers: {
      Authorization: authorizationHeader,
    },
  });
  return response.data;
};

module.exports = {
  validateUser
};