import axios from 'axios';

const BACKEND_URL = 'https://basic-crud-ticketing-system-pern.onrender.com';
// const BACKEND_URL = 'http://localhost:5000';

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/register`, userData);
    return response.data;
    } catch (error) {
    console.error('Error creating user:', error);
    throw error;
    }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, credentials);
    return response.data;
    } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
    }
};

export const getAllTickets = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/ticket`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/ticket`, ticketData); 
    return response.data;
    } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId, updatedData) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/ticket/${ticketId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/ticket/${ticketId}`);
    return response.data;
    } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

export const getSingleTicket = async (ticketId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/ticket/${ticketId}`);
    return response.data;
    } catch (error) {
    console.error('Error fetching single ticket:', error);
    throw error;
    }
};

export const specificUserTickets = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/ticket/user/${userId}`);
    return response.data;
    } catch (error) {
    console.error('Error fetching tickets for specific user:', error);
    throw error;
    }
};

