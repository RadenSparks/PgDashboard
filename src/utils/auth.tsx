export const isAuthenticated = () : boolean => {
    return !!localStorage.getItem('token'); // or your auth logic
}