const nameReg = /^[a-zA-Z][a-zA-Z0-9 _-]*$/;
const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;

export const checkUserName = (username) => {
    return nameReg.test(username);
};
export const checkUserPassword = (password) => {
    return passwordReg.test(password);
}