// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const adminId = localStorage.getItem("adminId");

//   useEffect(() => {
//     const fetchAllOrders = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/v1/orders/get-canteen-orders/${adminId}`,
//           {
//             method: 'GET',
//             credentials: 'include'
//           }
//         );
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if(!data){
//           console.log("Error in fetching order of this canteen : ", data.message);
//         }
//         console.log("Data : ", data);

//         if (data.success && data.orders) {
//           setOrders(data.orders);
//         } else {
//           throw new Error(data.message || "No orders found in response");
//         }

//       } catch (error) {
//         console.log("Error in fetching all orders : ", error.message);
//         toast.error(error.message || "Error in fetching orders");
//       }
//     };

//     fetchAllOrders();
//   }, [adminId]);

//   const updateOrderStatus = async (orderNumber, newStatus) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/v1/orders/update-status/${orderNumber}`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ status: newStatus }),
//           credentials: 'include'
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to update status');
//       }

//       setOrders(orders.map(order => 
//         order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
//       ));
      
//       toast.success(`Order #${orderNumber} status updated to ${newStatus}`);
//     } catch (error) {
//       console.error("Status update error:", error);
//       toast.error("Failed to update order status");
//     }
//   };

//   const filteredOrders = filterStatus === "all"
//     ? orders
//     : orders.filter(order => 
//         filterStatus === order.status.toLowerCase()
//       );

//   const getStatusColor = (status) => {
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
//       case "preparing":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
//       case "ready":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
//       case "delivered":
//         return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric', 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const calculateItemTotal = (price, quantity) => {
//     return (price * quantity).toFixed(2);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
//           Orders Management
//         </h1>
//         <div className="flex items-center space-x-4">
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//           >
//             <option value="all">All Orders</option>
//             <option value="pending">Pending</option>
//             <option value="preparing">Preparing</option>
//             <option value="ready">Ready</option>
//             <option value="delivered">Delivered</option>
//           </select>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Order #
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Items
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {filteredOrders.map((order) => (
//                 <tr key={order.orderNumber}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                     {order.orderNumber}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     <div>
//                       <div className="font-medium">{order.user?.name}</div>
//                       <div>{order.user?.email}</div>
//                       <div>{order.user?.contact}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
//                     <div className="flex flex-wrap gap-1">
//                       {order.items.map((item, index) => (
//                         <div 
//                           key={index}
//                           className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
//                         >
//                           {item.food?.foodName} 
//                           <div>Qty: {item.quantity}</div>
//                           <div>₹{calculateItemTotal(item.food?.foodPrice, item.quantity)}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                     ₹{order.total}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     {formatDate(order.createdAt)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                         order.status
//                       )}`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       {order.status.toLowerCase() !== "delivered" && (
//                         <select
//                           value={order.status.toLowerCase()}
//                           onChange={(e) =>
//                             updateOrderStatus(order.orderNumber, e.target.value)
//                           }
//                           className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="preparing">Preparing</option>
//                           <option value="ready">Ready</option>
//                           <option value="delivered">Delivered</option>
//                         </select>
//                       )}
//                       <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded">
//                         Receipt
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Order;














import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/orders/get-all-orders/${adminId}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data : ", data);

        if (data.success && data.orders) {
          setOrders(data.orders);
        } else {
          throw new Error(data.message || "No orders found in response");
        }

      } catch (error) {
        console.log("Error in fetching all orders : ", error.message);
        toast.error(error.message || "Error in fetching orders");
      }
    };

    fetchAllOrders();
  }, [adminId]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/orders/update-status/${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(order => 
        filterStatus === order.status.toLowerCase()
      );

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "preparing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "delivered":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Orders Management
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div>
                      <div className="font-medium">{order.userInfo?.name}</div>
                      <div>{order.userInfo?.email}</div>
                      <div>{order.userInfo?.contact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                        >
                          <div className="font-medium">{item.foodName}</div>
                          <div>Qty: {item.quantity}</div>
                          <div>₹{item.itemTotal}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₹{order.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {order.status.toLowerCase() !== "delivered" && (
                        <select
                          value={order.status.toLowerCase()}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      )}
                      <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded">
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order;





























// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const Order = () => {
//   const [orders, setOrders] = useState([
//     {
//       id: 1001,
//       customer: "John Doe",
//       items: ["Cheese Burger", "Fries", "Coke"],
//       total: 12.97,
//       status: "pending",
//       date: "2023-05-15 12:30",
//     },
//     {
//       id: 1002,
//       customer: "Jane Smith",
//       items: ["Veg Pizza", "Garlic Bread"],
//       total: 15.98,
//       status: "preparing",
//       date: "2023-05-15 12:45",
//     },
//     {
//       id: 1003,
//       customer: "Mike Johnson",
//       items: ["Chicken Sandwich", "Iced Tea"],
//       total: 8.49,
//       status: "ready",
//       date: "2023-05-15 13:15",
//     },
//     {
//       id: 1004,
//       customer: "Sarah Williams",
//       items: ["Pasta", "Salad", "Garlic Bread"],
//       total: 14.97,
//       status: "delivered",
//       date: "2023-05-15 11:20",
//     },
//     {
//       id: 1005,
//       customer: "David Brown",
//       items: ["Caesar Salad", "Soup"],
//       total: 9.98,
//       status: "pending",
//       date: "2023-05-15 13:30",
//     },
//   ]);

//   const [filterStatus, setFilterStatus] = useState("all");

//   const updateOrderStatus = (orderId, newStatus) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       )
//     );
//     toast.success(`Order #${orderId} status updated to ${newStatus}`);
//   };

//   const filteredOrders = filterStatus === "all"
//     ? orders
//     : orders.filter((order) => order.status === filterStatus);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
//       case "preparing":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
//       case "ready":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
//       case "delivered":
//         return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
//           Orders Management
//         </h1>
//         <div className="flex items-center space-x-4">
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//           >
//             <option value="all">All Orders</option>
//             <option value="pending">Pending</option>
//             <option value="preparing">Preparing</option>
//             <option value="ready">Ready</option>
//             <option value="delivered">Delivered</option>
//           </select>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Items
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {filteredOrders.map((order) => (
//                 <tr key={order.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                     #{order.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     {order.customer}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
//                     <div className="flex flex-wrap gap-1">
//                       {order.items.map((item, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
//                         >
//                           {item}
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     ${order.total.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     {order.date}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                         order.status
//                       )}`}
//                     >
//                       {order.status.charAt(0).toUpperCase() +
//                         order.status.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       {order.status !== "delivered" && (
//                         <select
//                           value={order.status}
//                           onChange={(e) =>
//                             updateOrderStatus(order.id, e.target.value)
//                           }
//                           className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="preparing">Preparing</option>
//                           <option value="ready">Ready</option>
//                           <option value="delivered">Delivered</option>
//                         </select>
//                       )}
//                       <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded">
//                         Receipt
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Order;