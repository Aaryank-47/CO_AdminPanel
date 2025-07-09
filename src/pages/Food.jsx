import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Player } from '@lottiefiles/react-lottie-player';
import emptyAnimation from "../assets/FoodMenu.json";

const Food = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDelayedLoading, setIsDelayedLoading] = useState(false);

  const [currentFood, setCurrentFood] = useState({
    _id: "",
    foodName: "",
    foodPrice: "",
    foodCategory: "",
    foodImage: null,
    foodDescription: "",
    isVeg: false,
    isActive: false
  });

  const [newFood, setNewFood] = useState({
    foodName: "",
    foodPrice: "",
    foodCategory: "",
    foodImage: null,
    foodDescription: "",
    isVeg: false,
    isActive: false
  });

  const categories = ["Fast Food", "Italian", "Healthy", "Snacks", "Chinese", "Beverages", "Hot Drinks", "Icecream", "Cold Drinks"];

  // Set delayed loading after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsDelayedLoading(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const fetchFoodItems = async () => {
    const adminId = localStorage.getItem('adminId');
    setIsLoading(true);
    setIsDelayedLoading(false);

    try {
      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/canteens-menu/${adminId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFoodItems(data.foodslist.map(food => ({
        _id: food._id,
        name: food.foodName || "",
        price: food.foodPrice || "",
        category: food.foodCategory || "",
        description: food.foodDescription || "",
        isVeg: food.isVeg || false,
        image: food.foodImage || "",
        isActive: food.isActive || false
      })));

    } catch (error) {
      console.error("Error fetching foods:", error.message);
      toast.error('Failed to load food items');
      setFoodItems([]);
    } finally {
      setIsLoading(false);
      setIsDelayedLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleRefresh = () => {
    fetchFoodItems();
  };

  const toggleActiveStatus = async (foodId, currentStatus) => {
    try {
      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/toggle-active/${foodId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setFoodItems(foodItems.map(item =>
        item._id === foodId ? { ...item, isActive: !currentStatus } : item
      ));
      toast.success(`Item marked as ${!currentStatus ? 'active' : 'inactive'}`);

    } catch (error) {
      console.error("Error toggling active state", error.message);
      toast.error(error.message);
    }
  };

  const handleAddFood = async () => {
    const formData = new FormData();
    formData.append('foodName', newFood.foodName);
    formData.append('foodPrice', newFood.foodPrice);
    formData.append('foodCategory', newFood.foodCategory);
    formData.append('foodDescription', newFood.foodDescription);
    formData.append('isVeg', newFood.isVeg);
    formData.append('isActive', newFood.isActive);

    if (newFood.foodImage) {
      formData.append('foodImage', newFood.foodImage);
    }

    try {
      const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/foods/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add new foods');
      }

      toast.success("Food item added successfully");
      setIsAddModalOpen(false);
      setNewFood({
        foodName: "",
        foodPrice: "",
        foodCategory: "",
        foodImage: null,
        foodDescription: "",
        isVeg: false,
        isActive: true
      });

      // Refresh the food list
      const refreshResponse = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/canteens-menu/${localStorage.getItem('adminId')}`, {
        credentials: 'include',
      });
      const refreshData = await refreshResponse.json();
      setFoodItems(refreshData.foodslist.map(food => ({
        _id: food._id,
        name: food.foodName || "",
        price: food.foodPrice || "",
        category: food.foodCategory || "",
        description: food.foodDescription || "",
        isVeg: food.isVeg || false,
        isActive: food.isActive || false,
        image: food.foodImage || ""
      })));

    } catch (error) {
      console.log("Error adding food:", error);
      toast.error(error.message);
    }
  };

  const handleEditFood = async () => {
    try {
      const formData = new FormData();
      formData.append('foodName', currentFood.foodName);
      formData.append('foodPrice', currentFood.foodPrice);
      formData.append('foodCategory', currentFood.foodCategory);
      formData.append('foodDescription', currentFood.foodDescription || '');
      formData.append('isVeg', String(currentFood.isVeg));
      formData.append('isActive', String(currentFood.isActive));

      if (currentFood.foodImage instanceof File) {
        formData.append('foodImage', currentFood.foodImage);
      }

      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/update/${currentFood._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update food item');
      }

      setFoodItems(foodItems.map(item =>
        item._id === currentFood._id ? {
          ...item,
          name: currentFood.foodName,
          price: currentFood.foodPrice,
          category: currentFood.foodCategory,
          description: currentFood.foodDescription,
          isVeg: currentFood.isVeg,
          isActive: currentFood.isActive,
          image: data.foodImage || item.image
        } : item
      ));

      toast.success("Food item updated successfully");
      setIsEditModalOpen(false);

    } catch (error) {
      console.log('Error on editing food: ', error.message);
      toast.error('Error on editing food');
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/delete/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete food item');
        }

        setFoodItems(foodItems.filter((item) => item._id !== id));
        toast.success("Food item deleted successfully");
      } catch (error) {
        console.error('Error deleting food:', error);
        toast.error('Failed to delete food item');
      }
    }
  };

  // Apple-style modal component
  const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Save" }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {children}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading screen for delayed loading
  if (isDelayedLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Player
          autoplay
          loop
          src="https://lottie.host/d6f330a1-abd1-4576-88f0-6ccb29a85018/9cJgSnOrHe.json"
          style={{ height: '200px', width: '200px' }}
        />
        <p className="mt-6 text-gray-600 text-lg font-medium">Loading your menu...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header with Apple-like design */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Food Menu
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your canteen's food items
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && foodItems.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96">
          <Player
            autoplay
            loop
            src={emptyAnimation}
            style={{ height: '200px', width: '200px' }}
          />
          <p className="mt-6 text-gray-600 text-lg font-medium">No food items available</p>
          <p className="mt-2 text-gray-500 text-sm mb-6">Add your first item to get started</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add Food Item
          </button>
        </div>
      )}

      {/* Food Items Table */}
      {!isLoading && foodItems.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {foodItems.map((item) => (
                  <tr key={item._id} className={!item.isActive ? "bg-gray-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.price ? item.price.toFixed(2) : "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActiveStatus(item._id, item.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${item.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setCurrentFood({
                            _id: item._id,
                            foodName: item.name || "",
                            foodPrice: item.price || "",
                            foodCategory: item.category || "",
                            foodDescription: item.description || "",
                            isVeg: item.isVeg || false,
                            isActive: item.isActive || true,
                            foodImage: item.image || null
                          });
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFood(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Food Item"
        onConfirm={handleAddFood}
        confirmText="Add Food"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              value={newFood.foodName}
              onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={newFood.foodPrice}
                onChange={(e) => setNewFood({ ...newFood, foodPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newFood.foodCategory}
                onChange={(e) => setNewFood({ ...newFood, foodCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors bg-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newFood.foodDescription}
              onChange={(e) => setNewFood({ ...newFood, foodDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              placeholder="Optional description"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVeg"
                checked={newFood.isVeg}
                onChange={(e) => setNewFood({ ...newFood, isVeg: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="isVeg" className="ml-2 block text-sm text-gray-700">
                Vegetarian
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newFood.isActive}
                onChange={(e) => setNewFood({ ...newFood, isActive: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Available
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer">
                <span className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Choose File
                </span>
                <input
                  type="file"
                  onChange={(e) => setNewFood({ ...newFood, foodImage: e.target.files[0] })}
                  className="sr-only"
                  accept="image/*"
                />
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {newFood.foodImage ? newFood.foodImage.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Food Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Food Item"
        onConfirm={handleEditFood}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              value={currentFood.foodName}
              onChange={(e) => setCurrentFood({ ...currentFood, foodName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={currentFood.foodPrice}
                onChange={(e) => setCurrentFood({ ...currentFood, foodPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={currentFood.foodCategory}
                onChange={(e) => setCurrentFood({ ...currentFood, foodCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors bg-white"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={currentFood.foodDescription}
              onChange={(e) => setCurrentFood({ ...currentFood, foodDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editIsVeg"
                checked={currentFood.isVeg}
                onChange={(e) => setCurrentFood({ ...currentFood, isVeg: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="editIsVeg" className="ml-2 block text-sm text-gray-700">
                Vegetarian
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editIsActive"
                checked={currentFood.isActive}
                onChange={(e) => setCurrentFood({ ...currentFood, isActive: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-700">
                Available
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer">
                <span className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Change Image
                </span>
                <input
                  type="file"
                  onChange={(e) => setCurrentFood({ ...currentFood, foodImage: e.target.files[0] })}
                  className="sr-only"
                  accept="image/*"
                />
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {currentFood.foodImage instanceof File ? currentFood.foodImage.name : "Current image"}
              </span>
            </div>
            {currentFood.foodImage && !(currentFood.foodImage instanceof File) && (
              <div className="mt-2">
                <img
                  src={currentFood.foodImage}
                  alt="Current food"
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Food;












// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import emptyAnimation from "../assets/FoodMenu.json"
// import { Player } from '@lottiefiles/react-lottie-player';

// const Food = () => {
//   const [foodItems, setFoodItems] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   // Initialize with empty strings instead of undefined
//   const [currentFood, setCurrentFood] = useState({
//     _id: "",
//     foodName: "",
//     foodPrice: "",
//     foodCategory: "",
//     foodImage: null,
//     foodDescription: "",
//     isVeg: false,
//     isActive: false
//   });

//   const [newFood, setNewFood] = useState({
//     foodName: "",
//     foodPrice: "",
//     foodCategory: "",
//     foodImage: null,
//     foodDescription: "",
//     isVeg: false,
//     isActive: false
//   });

//   const categories = ["Fast Food", "Italian", "Healthy", "Snacks", "Chinese", "Beverages", "Hot Drinks", "Icecream", "Cold Drinks"];

//   useEffect(() => {

//     const fetchFoodItems = async () => {
//       const adminId = localStorage.getItem('adminId')
//       console.log('adminId : ', adminId);

//       try {
//         // const response = await fetch(`http://localhost:5000/api/v1/foods/canteens-menu/${adminId}`, {
//         const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/canteens-menu/${adminId}`, {
//           credentials: 'include',
//         });

//         const data = await response.json();
//         if (!data) {
//           throw new Error(`Error in fetching foods for this ${adminId}`)
//         }
//         console.log("data : ", data);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }


//         setFoodItems(data.foodslist.map(food => ({
//           _id: food._id,
//           name: food.foodName || "",
//           price: food.foodPrice || "",
//           category: food.foodCategory || "",
//           description: food.foodDescription || "",
//           isVeg: food.isVeg || false,
//           image: food.foodImage || "",
//           isActive: food.isActive || false
//         })));

//       } catch (error) {

//         console.error("Error fetching foods:", error.message);
//         toast.error('Failed to load food items');
//         setFoodItems([]);
//       }
//     };

//     fetchFoodItems();
//   }, []);

//   const toggleActiveSatus = async (foodId, currentStatus) => {
//     try {
//       // const response = await fetch(`http://localhost:5000/api/v1/foods/toggle-active/${foodId}`, {
//       const response = await fetch(`https://canteen-order-backend/.onrender.com/api/v1/foods/toggle-active/${foodId}`, {
//         method: 'PATCH',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//         },
//         body: JSON.stringify({ isActive: !currentStatus })
//       })

//       if (!response.ok) {
//         throw new Error(`Http response error status of ${response.status} from the backend server`);
//       }

//       const data = await response.json();
//       if (!data) {
//         throw new Error('Error in getting the data : ', data.message)
//       }
//       console.log(data);

//       setFoodItems(
//         foodItems.map(items =>
//           items._id === foodId ? { ...items, isActive: !currentStatus } : items
//         ));
//       toast.success(`Item marked as ${!currentStatus ? 'active' : 'inactive'}`);

//     } catch (error) {

//       console.log("Error toggling the active state", error.message);
//       toast.error(error.message);

//       setFoodItems(foodItems.map(item =>
//         item._id === foodId ? { ...item, isActive: currentStatus } : item
//       ));

//     }
//   }

//   const handleAddFood = async () => {
//     const formData = new FormData();
//     formData.append('foodName', newFood.foodName);
//     formData.append('foodPrice', newFood.foodPrice);
//     formData.append('foodCategory', newFood.foodCategory);
//     formData.append('foodDescription', newFood.foodDescription);
//     formData.append('isVeg', newFood.isVeg);
//     formData.append('isActive', newFood.isActive);

//     if (newFood.foodImage) {
//       formData.append('foodImage', newFood.foodImage);
//     }

//     try {
//       // const response = await fetch('http://localhost:5000/api/v1/foods/create', {
//       const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/foods/create', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//         },
//         body: formData
//       });

//       const data = await response.json();
//       console.log("data : ", data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to add new foods');
//       }

//       toast.success("Food item added successfully");
//       setIsAddModalOpen(false);
//       setNewFood({
//         foodName: "",
//         foodPrice: "",
//         foodCategory: "",
//         foodImage: null,
//         foodDescription: "",
//         isVeg: false,
//         isActive: true
//       });



//       // Refresh the food list
//       // const refreshResponse = await fetch(`http://localhost:5000/api/v1/foods/canteens-menu/${localStorage.getItem('adminId')}`, {
//       const refreshResponse = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/canteens-menu/${localStorage.getItem('adminId')}`, {
//         credentials: 'include',
//       });
//       const refreshData = await refreshResponse.json();
//       setFoodItems(refreshData.foodslist.map(food => ({
//         _id: food._id,
//         name: food.foodName || "",
//         price: food.foodPrice || "",
//         category: food.foodCategory || "",
//         description: food.foodDescription || "",
//         isVeg: food.isVeg || false,
//         isActive: food.isActive || false,
//         image: food.foodImage || ""
//       })));

//     } catch (error) {
//       console.log("Error adding food:", error);
//       toast.error(error.message);
//     }
//   };

//   const handleEditFood = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('foodName', currentFood.foodName);
//       formData.append('foodPrice', currentFood.foodPrice);
//       formData.append('foodCategory', currentFood.foodCategory);
//       formData.append('foodDescription', currentFood.foodDescription || '');
//       formData.append('isVeg', String(currentFood.isVeg));
//       formData.append('isActive', String(currentFood.isActive));

//       if (currentFood.foodImage instanceof File) {
//         formData.append('foodImage', currentFood.foodImage);
//       }

//       // const response = await fetch(`http://localhost:5000/api/v1/foods/update/${currentFood._id}`, {
//       const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/update/${currentFood._id}`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//         },
//         body: formData
//       });

//       const data = await response.json();
//       if (!data) {
//         console.error("Error in getting the data : ", data.message);
//       }
//       console.log("data : ", data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update food item');
//       }

//       // Update the food items list with the edited item
//       setFoodItems(foodItems.map(item =>
//         item._id === currentFood._id ? {
//           ...item,
//           name: currentFood.foodName,  // Use the currentFood state values
//           price: currentFood.foodPrice,
//           category: currentFood.foodCategory,
//           description: currentFood.foodDescription,
//           isVeg: currentFood.isVeg,
//           isActive: currentFood.isActive,
//           image: data.foodImage || item.image  // Use new image if returned, otherwise keep old one
//         } : item
//       ));

//       toast.success("Food item updated successfully");
//       setIsEditModalOpen(false);

//     } catch (error) {

//       console.log('Error on editing food: ', error.message);
//       toast.error('Error on editing food');

//     }
//   };

//   // const handleEditFood = async () => {
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append('foodName', currentFood.foodName);
//   //     formData.append('foodPrice', currentFood.foodPrice);
//   //     formData.append('foodCategory', currentFood.foodCategory);
//   //     formData.append('foodDescription', currentFood.foodDescription || '');
//   //     formData.append('isVeg', String(currentFood.isVeg));

//   //     if (currentFood.foodImage instanceof File) {
//   //       formData.append('foodImage', currentFood.foodImage);
//   //     }

//   //     const response = await fetch(`http://localhost:5000/api/v1/foods/update/${currentFood._id}`, {
//   //       method: 'PUT',
//   //       credentials: 'include',
//   //       headers: {
//   //         'Authorization': `Bearer ${localStorage.getItem('token')}`
//   //       },
//   //       body: formData
//   //     });

//   //     const data = await response.json();
//   //     console.log("data : ", data);

//   //     if (!response.ok) {
//   //       throw new Error(data.message || 'Failed to update food item');
//   //     }

//   //     setFoodItems(foodItems.map(item =>
//   //       item._id === currentFood._id ? {
//   //         ...item,
//   //         name: data.updatedFood.foodName || "",
//   //         price: data.updatedFood.foodPrice || "",
//   //         category: data.updatedFood.foodCategory || "",
//   //         description: data.updatedFood.foodDescription || "",
//   //         isVeg: data.updatedFood.isVeg || false,
//   //         image: data.updatedFood.foodImage || ""
//   //       } : item
//   //     ));

//   //     toast.success("Food item updated successfully");
//   //     setIsEditModalOpen(false);

//   //   } catch (error) {
//   //     console.log('Error on editing food: ', error.message);
//   //     toast.error('Error on editing food');
//   //   }
//   // };

//   const handleDeleteFood = async (id) => {
//     if (window.confirm("Are you sure you want to delete this food item?")) {
//       try {
//         // const response = await fetch(`http://localhost:5000/api/v1/foods/delete/${id}`, {
//         const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/delete/${id}`, {
//           method: 'DELETE',
//           credentials: 'include',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
//             "Content-Type": "application/json"
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete food item');
//         }

//         setFoodItems(foodItems.filter((item) => item._id !== id));
//         toast.success("Food item deleted successfully");
//       } catch (error) {
//         console.error('Error deleting food:', error);
//         toast.error('Failed to delete food item');
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-black dark:text-black">
//           Manage Food Items
//         </h1>
//         <button
//           onClick={() => setIsAddModalOpen(true)}
//           className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//         >
//           Add Food Item
//         </button>
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Category
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
//               {foodItems.map((item) => (
//                 <tr key={item._id} className={!item.isActive ? "opacity-70 bg-gray-50 dark:bg-gray-700" : ""} >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <img
//                       src={item.image || "https://via.placeholder.com/150"}
//                       alt={item.name}
//                       className="h-10 w-10 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                     {item.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     Rs {item.price ? item.price.toFixed(2) : "0.00"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     {item.category}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => toggleActiveSatus(item._id, item.isActive)}
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${item.isActive
//                         ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
//                         : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
//                         }`}
//                     >
//                       {item.isActive ? "Active" : "Inactive"}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => {
//                         setCurrentFood({
//                           _id: item._id,
//                           foodName: item.name || "",
//                           foodPrice: item.price || "",
//                           foodCategory: item.category || "",
//                           foodDescription: item.description || "",
//                           isVeg: item.isVeg || false,
//                           isActive: item.isActive || true,
//                           foodImage: item.image || null
//                         });
//                         setIsEditModalOpen(true);
//                       }}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-4"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteFood(item._id)}
//                       className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {foodItems.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="py-10 text-center">
//                     <div className="flex flex-col items-center">
//                       <Player
//                         autoplay
//                         loop
//                         src={emptyAnimation}
//                         style={{ height: '200px', width: '200px' }}
//                       />
//                       <p className="mt-4 text-gray-600 dark:text-gray-300">No food items found!</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add Food Modal */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                 Add New Food Item
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Food Name
//                   </label>
//                   <input
//                     type="text"
//                     value={newFood.foodName}
//                     onChange={(e) =>
//                       setNewFood({ ...newFood, foodName: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Price (Rs)
//                   </label>
//                   <input
//                     type="number"
//                     value={newFood.foodPrice}
//                     onChange={(e) =>
//                       setNewFood({ ...newFood, foodPrice: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     required
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Category
//                   </label>
//                   <select
//                     value={newFood.foodCategory}
//                     onChange={(e) =>
//                       setNewFood({ ...newFood, foodCategory: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     required
//                   >
//                     <option value="">Select a category</option>
//                     {categories.map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Description
//                   </label>
//                   <input
//                     type="text"
//                     value={newFood.foodDescription}
//                     onChange={(e) =>
//                       setNewFood({ ...newFood, foodDescription: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={newFood.isVeg}
//                     onChange={(e) => setNewFood({ ...newFood, isVeg: e.target.checked })}
//                     className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                   />
//                   <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                     Vegetarian
//                   </label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={newFood.isActive}
//                     onChange={(e) => setNewFood({ ...newFood, isActive: e.target.checked })}
//                     className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                   />
//                   <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                     Available for ordering
//                   </label>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Food Image
//                   </label>
//                   <input
//                     type="file"
//                     onChange={(e) => setNewFood({ ...newFood, foodImage: e.target.files[0] })}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     accept="image/*"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
//               <button
//                 type="button"
//                 onClick={handleAddFood}
//                 className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Add Food
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsAddModalOpen(false)}
//                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Food Modal */}
//       {isEditModalOpen && currentFood && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                 Edit Food Item
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     value={currentFood.foodName}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, foodName: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Price (Rs)
//                   </label>
//                   <input
//                     type="number"
//                     value={currentFood.foodPrice}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, foodPrice: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     required
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Category
//                   </label>
//                   <select
//                     value={currentFood.foodCategory}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, foodCategory: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     required
//                   >
//                     {categories.map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Description
//                     </label>
//                     <input
//                       type="text"
//                       value={currentFood.foodDescription}
//                       onChange={(e) =>
//                         setCurrentFood({ ...currentFood, foodDescription: e.target.value })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={currentFood.isVeg}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, isVeg: e.target.checked })
//                     }
//                     className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                   />
//                   <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                     Vegetarian
//                   </label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={currentFood.isActive}
//                     onChange={(e) => setCurrentFood({ ...currentFood, isActive: e.target.checked })}
//                     className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                   />
//                   <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                     Available for ordering
//                   </label>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Food Image
//                   </label>
//                   <input
//                     type="file"
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, foodImage: e.target.files[0] })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     accept="image/*"
//                   />
//                   {currentFood.foodImage && !(currentFood.foodImage instanceof File) && (
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">Current Image:</p>
//                       <img
//                         src={currentFood.foodImage}
//                         alt="Current food"
//                         className="h-20 w-20 object-cover mt-1"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
//               <button
//                 type="button"
//                 onClick={handleEditFood}
//                 className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Save Changes
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Food;

