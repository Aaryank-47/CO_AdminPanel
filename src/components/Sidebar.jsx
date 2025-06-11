import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-60 bg-gray-800 text-white flex flex-col p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">Dashboard</Link>
      <Link to="/food" className="hover:bg-gray-700 px-3 py-2 rounded">Food</Link>
      <Link to="/order" className="hover:bg-gray-700 px-3 py-2 rounded">Order</Link>
      <Link to="/analytics" className="hover:bg-gray-700 px-3 py-2 rounded">Analytics</Link>
      <Link to="/feedback" className="hover:bg-gray-700 px-3 py-2 rounded">Feedback</Link>
      <Link to="/settings" className="hover:bg-gray-700 px-3 py-2 rounded">Settings</Link>
    </div>
  );
};

export default Sidebar;
