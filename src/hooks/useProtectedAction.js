import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../pages/UserContext";
import { toast } from 'react-hot-toast';

export const useProtectedAction = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const execute = (action, message = "You must login first!") => {
        if (!user) {
            toast.error(message, {
                duration : 4000,
                position : 'top-right',
            });
            navigate('/login');
            return false;
        }

        action();
        return true;
    };

    return execute;
};