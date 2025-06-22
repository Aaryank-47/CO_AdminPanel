import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { use } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    revenueToday: 0,
    newCustomers: 8,
    topSellingFood: "Loading...",
  });

  const [ordersPerDayData, setOrdersPerDayData] = useState(null);
  const [peakOrderHoursData, setPeakOrderHoursData] = useState(null);
  const [ foodPopularityData, setFoodPopularityData] = useState(null);

  const todaysTotalOrders = async () => {
    try {
      const reponse = await fetch("http://localhost:5000/api/v1/orders/todays-total-orders", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

      });

      const data = await reponse.json();
      console.log("Today's total orders:", data);

      if (reponse.ok) {
        setStats((prevStats) => ({
          ...prevStats,
          todayOrders: data.totalOrders,
        }));

      } else {
        console.error("Failed to fetch today's total orders:", data.message);
      }

    } catch (error) {
      console.error("Error fetching today's total orders:", error);
    }

  }

  const getRevenueToday = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/orders/todays-revenue", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Today's revenue:", data);

      if (response.ok) {
        setStats((prevStats) => ({
          ...prevStats,
          revenueToday: data.totalRevenueSum,
        }));

      } else {
        console.error("Failed to fetch today's revenue:", data.message);
      }

    } catch (error) {
      console.error("Error fetching today's revenue:", error);
    }
  }

  const topSellingFood = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/foods/top-selling-food", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if(!data){
        console.error("No data received from server");
      }
      console.log("Top selling food:", data);

      if (response.ok) {

        const labels = data.populatedFoods.map(item => item.foodName);
        const values = data.populatedFoods.map(item => item.quantity);

        console.log("Labels:", labels);
        console.log("Values:", values);

        setStats((prevStats) => ({
          ...prevStats,
          topSellingFood: labels[0] || "N/A",
        }));

        setFoodPopularityData({
          labels,
          datasets: [
            {
              label: "Orders",
              data: values,
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

      } else {
        console.error("Failed to fetch top selling food:", data.message);
      }

    } catch (error) {
      console.error("Error fetching top selling food:", error);
    }
  }

  const fetchOrdesPerDayData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/orders/orders-per-day", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Orders per day data:", data);

      if (response.ok) {
        const labels = data.ordersPerDay.map(item => item.date);
        const values = data.ordersPerDay.map(item => item.count);

        setOrdersPerDayData({
          labels,
          datasets: [
            {
              label: "Orders per Day",
              data: values,
              backgroundColor: "rgba(124, 58, 237, 0.5)",
              borderColor: "rgba(124, 58, 237, 1)",
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.error("Failed to fetch orders per day data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders per day data:", error);

    }
  }

  const ordersData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(124, 58, 237, 0.5)",
        borderColor: "rgba(124, 58, 237, 1)",
        borderWidth: 1,
      },
    ],
  };




  const fetchPeakHoursData = async () => {
    const response = await fetch("http://localhost:5000/api/v1/orders/peak-order-hours", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Peak hours data:", data);

    if (response.ok) {
      const labels = data.peakOrderHours.map(item => item.slot);
      const values = data.peakOrderHours.map(item => item.count);

      setPeakOrderHoursData({
        labels,
        datasets: [
          {
            label: "Peak Order Hours",
            data: values,
            backgroundColor: "rgba(16, 185, 129, 0.5)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
          },
        ],
      });
    } else {
      console.error("Failed to fetch peak hours data:", data.message);
    }
  }

  useEffect(() => {
    todaysTotalOrders();
    getRevenueToday();
    topSellingFood();
    fetchOrdesPerDayData();
    fetchPeakHoursData();
  }, []);


  // const revenueTrendData = {
  //   labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  //   datasets: [
  //     {
  //       label: "Revenue",
  //       data: [4500, 5200, 4800, 6000],
  //       fill: false,
  //       backgroundColor: "rgba(245, 158, 11, 0.5)",
  //       borderColor: "rgba(245, 158, 11, 1)",
  //       tension: 0.1,
  //     },
  //   ],
  // };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">Today's Orders</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.todayOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">Revenue Today</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{stats.revenueToday}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">New Customers</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.newCustomers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">Top Selling Food</h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.topSellingFood}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Orders Per Day</h3>
          {ordersPerDayData ? <Bar data={ordersPerDayData} /> : <p>Loading chart...</p>}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Peak Order Hours</h3>
          {peakOrderHoursData ? <Bar data={peakOrderHoursData} /> : <p>Loading chart...</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Top Selling Foods</h3>
          {foodPopularityData ? <Pie data={foodPopularityData} /> : <p>Loading chart...</p>}
        </div>
        {/* You can add revenue trend here */}
      </div>
    </div>
  );
};


export default Dashboard;




























// export default Dashboard;
// import { useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
// } from "chart.js";
// import { Bar, Pie, Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     todayOrders: 42,
//     revenueToday: 1250,
//     newCustomers: 8,
//     topSellingFood: "Burger",
//   });

//   const ordersData = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Orders",
//         data: [65, 59, 80, 81, 56, 55, 40],
//         backgroundColor: "rgba(124, 58, 237, 0.5)",
//         borderColor: "rgba(124, 58, 237, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const peakHoursData = {
//     labels: [
//       "8-9 AM",
//       "9-10 AM",
//       "10-11 AM",
//       "11-12 PM",
//       "12-1 PM",
//       "1-2 PM",
//       "2-3 PM",
//       "3-4 PM",
//     ],
//     datasets: [
//       {
//         label: "Orders",
//         data: [10, 25, 35, 45, 60, 40, 30, 20],
//         backgroundColor: "rgba(16, 185, 129, 0.5)",
//         borderColor: "rgba(16, 185, 129, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const foodPopularityData = {
//     labels: ["Burger", "Pizza", "Sandwich", "Pasta", "Salad"],
//     datasets: [
//       {
//         label: "Orders",
//         data: [35, 25, 20, 15, 5],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.5)",
//           "rgba(54, 162, 235, 0.5)",
//           "rgba(255, 206, 86, 0.5)",
//           "rgba(75, 192, 192, 0.5)",
//           "rgba(153, 102, 255, 0.5)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const revenueTrendData = {
//     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
//     datasets: [
//       {
//         label: "Revenue",
//         data: [4500, 5200, 4800, 6000],
//         fill: false,
//         backgroundColor: "rgba(245, 158, 11, 0.5)",
//         borderColor: "rgba(245, 158, 11, 1)",
//         tension: 0.1,
//       },
//     ],
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
//         Dashboard Overview
//       </h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
//             Today's Orders
//           </h3>
//           <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
//             {stats.todayOrders}
//           </p>
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
//             Revenue Today
//           </h3>
//           <p className="text-3xl font-bold text-green-600 dark:text-green-400">
//             ${stats.revenueToday}
//           </p>
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
//             New Customers
//           </h3>
//           <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
//             {stats.newCustomers}
//           </p>
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
//             Top Selling Food
//           </h3>
//           <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
//             {stats.topSellingFood}
//           </p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
//             Orders per Day
//           </h3>
//           <Bar data={ordersData} />
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
//             Peak Order Hours
//           </h3>
//           <Bar data={peakHoursData} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
//             Most Ordered Foods
//           </h3>
//           <Pie data={foodPopularityData} />
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
//             Weekly Revenue Trend
//           </h3>
//           <Line data={revenueTrendData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;