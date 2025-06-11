import CanteenName from './CanteenName.jsx';
import RealTimeClock from './RealTimeClock.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow">
      <CanteenName />
      <div className="flex items-center gap-6">
        <RealTimeClock />
        <Link to="/notifications" className="text-blue-500 hover:underline">🔔 Notifications</Link>
        <Link to="/profile" className="text-green-500 hover:underline">👤 Profile</Link>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
    