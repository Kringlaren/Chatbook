const nameReg = /^[a-zåäöA-ZÅÄÖ][a-zåäöA-ZÅÄÖ0-9 _-]*$/;
const passwordReg = /^(?=.*[a-zåäöA-ZÅÄÖ])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;

export const checkUserName = (username) => {
    return nameReg.test(username);
};
export const checkUserPassword = (password) => {
    return passwordReg.test(password);
};