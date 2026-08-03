import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5097"
});

export const login = async (username, password) => {
    const response = await api.post("/auth/login", {
        username,
        password
    });

    return response.data;
};

export const register = async (user) => {
    const response = await api.post("/auth/register", user);

    return response.data;
};
export const getProfile = async (token) => {
    const response = await api.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

export default api;