import axios from "axios";

export const updateUserData = async (userId, user) => {
  try {
    await axios.put(`/api/user/update-user-data/${userId}`, user);
  } catch (e) {
    console.log(e);
  }
};
