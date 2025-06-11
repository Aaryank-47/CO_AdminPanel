import { useEffect, useState } from 'react';

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
      🕒 {time}
    </div>
  );
};

export default RealTimeClock;
