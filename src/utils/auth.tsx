export const isAuthenticated = () : boolean => {
    return !!localStorage.getItem('token'); // or your auth logic
}

export const clearAuth = () : void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
}