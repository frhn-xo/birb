import axios from 'axios';

const API_URL = 'http://localhost:8800'; // Update with your backend server URL

export const API = axios.create({ baseURL: API_URL, responseType: 'json' });

export const apiRequest = async ({ url, token, data, method, headers }) => {
  try {
    if (method === 'post' && data instanceof FormData) {
      const result = await API.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : '',
          ...headers,
        },
      });
      console.log('result ', result);
      return {
        status: 'success',
        message: result.data.message,
        data: result.data,
      };
    } else {
      const result = await API(url, {
        method,
        data,
        headers: headers || {
          'content-type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      console.log('result ', result);
      return {
        status: 'success',
        message: result.data.message,
        data: result.data,
      };
    }
  } catch (error) {
    console.log('error ', error);

    if (error?.response) {
      const errorData = error.response.data;
      return { status: 'failed', message: errorData.message };
    }
    return {
      status: 'failed',
      message:
        "Maybe I couldn't connect to the server, something went wrong, brrrr...",
    };
  }
};
