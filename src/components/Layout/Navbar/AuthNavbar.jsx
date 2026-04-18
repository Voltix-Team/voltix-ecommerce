import { Link } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import { HelpCircle } from 'lucide-react';
import Button from '../../UI/Button';

const AuthNavbar = () => {
    return (
        <header className="flex items-center justify-between px-8 py-3 bg-[#f4f7f9] border-b border-gray-200">
            <Link to="/" className="flex-shrink-0">
                <img src={logo} alt="Voltix" className="h-6 w-auto" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Power Your Future</span>
                <Button
                    variant="icon"
                    className="text-gray-400 hover:text-gray-600 hover:bg-transparent"
                    title="Help"         
                    aria-label="Help"
                >
                    <HelpCircle size={18} />
                </Button>
            </div>
        </header>
    );
};

export default AuthNavbar;