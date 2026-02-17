import { useAuth } from "../context/AuthContext";


const Logout = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
