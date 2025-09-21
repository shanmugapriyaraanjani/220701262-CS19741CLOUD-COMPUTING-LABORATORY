import axios from "axios";
const url = process.env.REACT_APP_API_URL || "http://localhost:5000";

const addUser = async (name) => {
  try {
    const data = await axios.get(`${url}/user/${name}`);
    return data.data;
  } catch (e) {
    console.log(e);
  }
};

const getUserRooms = async (name) => {
  if (name.length > 0) {
    try {
      const data = await axios.get(`${url}/api/rooms/bookedRooms/${name}`);
      return data.data;
    } catch (e) {
      console.log(e);
    }
  }
};

const getBookedRooms = async () => {
  try {
    const data = await axios.get(`${url}/api/rooms/bookedRooms`);
    return data.data;
  } catch (e) {
    console.log(e);
  }
};

const bookRoom = async (roomDetails) => {
  try {
    await axios.post(`${url}/api/rooms/bookRoom`, roomDetails);
  } catch (e) {
    console.log(e);
  }
};

const updateRoom = async (roomDetails) => {
  try {
    const data = await axios.post(`${url}/api/rooms/updateRoom`, roomDetails);
    return data;
  } catch (e) {
    console.log(e);
  }
};

const deleteRoom = async (booking_id) => {
  try {
    const data = await axios.delete(
      `${url}/api/rooms/deleteRoom/${booking_id}`
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};

const getAvailableRooms = async (date, start_time, end_time) => {
  try {
    const params = new URLSearchParams({ date, start_time, end_time });
    const data = await axios.get(`${url}/api/rooms/availableRooms?${params.toString()}`);
    return data.data;
  } catch (e) {
    console.log(e);
  }
};

const getRoomNumbers = async () => {
  try {
    const data = await axios.get(`${url}/api/rooms/roomNumbers`);
    return data.data;
  } catch (e) {
    console.log(e);
  }
};

export {
  getUserRooms,
  bookRoom,
  updateRoom,
  deleteRoom,
  getBookedRooms,
  getAvailableRooms,
  getRoomNumbers,
  addUser
};
