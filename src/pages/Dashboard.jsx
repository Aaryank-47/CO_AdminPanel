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
import { Player } from '@lottiefiles/react-lottie-player';
import noDataAnimation from "../assets/no_animationData.json"
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
  const [foodPopularityData, setFoodPopularityData] = useState(null);

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
      if (!data) {
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


  const renderNoData = (message) => (
    <div className="flex flex-col items-center justify-center h-64">
      <Player autoplay loop src={noDataAnimation} style={{ height: '150px', width: '150px' }} />
      <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-black mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Orders Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-[5px] border-orange-400
                 transition-all duration-300 ease-out 
                 hover:scale-[1.015] hover:shadow-md hover:border-orange-500
                 group relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 
                   group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-base font-medium text-gray-600">Today's Orders</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.todayOrders}</p>
          </div>
          <div className="absolute bottom-3 right-3 text-orange-200 group-hover:text-orange-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Revenue Today Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-[5px] border-green-400
                 transition-all duration-300 ease-out 
                 hover:scale-[1.015] hover:shadow-md hover:border-green-500
                 group relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 
                   group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-base font-medium text-gray-600">Revenue Today</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">₹{stats.revenueToday}</p>
          </div>
          <div className="absolute bottom-3 right-3 text-green-200 group-hover:text-green-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* New Customers Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-[5px] border-blue-400
                 transition-all duration-300 ease-out 
                 hover:scale-[1.015] hover:shadow-md hover:border-blue-500
                 group relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 
                   group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-base font-medium text-gray-600">New Customers</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.newCustomers}</p>
          </div>
          <div className="absolute bottom-3 right-3 text-blue-200 group-hover:text-blue-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Top Selling Food Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-[5px] border-purple-400
                 transition-all duration-300 ease-out 
                 hover:scale-[1.015] hover:shadow-md hover:border-purple-500
                 group relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 
                   group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-base font-medium text-gray-600">Top Selling Food</h3>
            <p className="text-xl font-semibold text-gray-700 mt-1 line-clamp-2">{stats.topSellingFood}</p>
          </div>
          <div className="absolute bottom-3 right-3 text-purple-200 group-hover:text-purple-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-black mb-4">Orders Per Day</h3>
          {ordersPerDayData && ordersPerDayData.labels.length > 0
            ? <Bar data={ordersPerDayData} />
            : renderNoData("No order data available yet")}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-black mb-4">Peak Order Hours</h3>
          {peakOrderHoursData && peakOrderHoursData.labels.length > 0
            ? <Bar data={peakOrderHoursData} />
            : renderNoData("No peak hour data available yet")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-black mb-4">Top Selling Foods</h3>
          {foodPopularityData && foodPopularityData.labels.length > 0
            ? <Pie data={foodPopularityData} />
            : renderNoData("No food sales data available yet")}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;




