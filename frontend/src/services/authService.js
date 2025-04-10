import api from "./api.js";

const nameReg = /^[a-zA-Z][a-zA-Z0-9 _-]*$/;
const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;

// Behöver ingen regex för SQL-inject eftersom databasen använder parameterized queries
export const logInUser = async (username, password) => {
    try {
        const res = await api.post("/api/auth/login", {
            username: username,
            password: password
        });
        return res;
    } catch (error) {
        return { error: error.response.data.message, status: error.response.status };
    }
};

export const registerUser = async (username, password) => {
    try {
        const res = await api.post("/api/auth/register", {
            username: username,
            password: password
        });
        return res;
    } catch (error) {
        return { error: error.response.data.message, status: error.response.status };
    }
};


// Hjälpfunktioner

export const checkUserName = (username) => {
    if (!nameReg.test(username)) {
        return false;
    } else {
        return true;
    }
};
export const checkUserPassword = (password) => {
    if (!passwordReg.test(password)) {
        return false;
    } else {
        return true;
    }
}