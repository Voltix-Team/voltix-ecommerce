import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast';

export const useProtectedAction = () => {
    // read user from Django-based userSlice
    const { data: user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const execute = (action, message = "You must login first!") => {
        if (!user) {
            toast.error(message, { duration: 4000, position: 'top-right' });
            navigate('/login');
            return false;
        }
        action();
        return true;
    };

    return execute;
};