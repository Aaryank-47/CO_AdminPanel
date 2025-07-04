import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import emptyAnimation from "../assets/FoodMenu.json"
import { Player } from '@lottiefiles/react-lottie-player';

const Food = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Initialize with empty strings instead of undefined
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

  useEffect(() => {

    const fetchFoodItems = async () => {
      const adminId = localStorage.getItem('adminId')
      console.log('adminId : ', adminId);

      try {
        const response = await fetch(`http://localhost:5000/api/v1/foods/canteens-menu/${adminId}`, {
          credentials: 'include',
        });

        const data = await response.json();
        if (!data) {
          throw new Error(`Error in fetching foods for this ${adminId}`)
        }
        console.log("data : ", data);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }


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
      }
    };

    fetchFoodItems();
  }, []);

  const toggleActiveSatus = async (foodId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/foods/toggle-active/${foodId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (!response.ok) {
        throw new Error(`Http response error status of ${response.status} from the backend server`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Error in getting the data : ', data.message)
      }
      console.log(data);

      setFoodItems(
        foodItems.map(items =>
          items._id === foodId ? { ...items, isActive: !currentStatus } : items
        ));
      toast.success(`Item marked as ${!currentStatus ? 'active' : 'inactive'}`);

    } catch (error) {

      console.log("Error toggling the active state", error.message);
      toast.error(error.message);

      setFoodItems(foodItems.map(item =>
        item._id === foodId ? { ...item, isActive: currentStatus } : item
      ));

    }
  }

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
      const response = await fetch('http://localhost:5000/api/v1/foods/create', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      console.log("data : ", data);

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
      const refreshResponse = await fetch(`http://localhost:5000/api/v1/foods/canteens-menu/${localStorage.getItem('adminId')}`, {
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

      const response = await fetch(`http://localhost:5000/api/v1/foods/update/${currentFood._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const data = await response.json();
      console.log("data : ", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update food item');
      }

      // Update the food items list with the edited item
      setFoodItems(foodItems.map(item =>
        item._id === currentFood._id ? {
          ...item,
          name: currentFood.foodName,  // Use the currentFood state values
          price: currentFood.foodPrice,
          category: currentFood.foodCategory,
          description: currentFood.foodDescription,
          isVeg: currentFood.isVeg,
          isActive: currentFood.isActive,
          image: data.foodImage || item.image  // Use new image if returned, otherwise keep old one
        } : item
      ));

      toast.success("Food item updated successfully");
      setIsEditModalOpen(false);

    } catch (error) {

      console.log('Error on editing food: ', error.message);
      toast.error('Error on editing food');

    }
  };

  // const handleEditFood = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('foodName', currentFood.foodName);
  //     formData.append('foodPrice', currentFood.foodPrice);
  //     formData.append('foodCategory', currentFood.foodCategory);
  //     formData.append('foodDescription', currentFood.foodDescription || '');
  //     formData.append('isVeg', String(currentFood.isVeg));

  //     if (currentFood.foodImage instanceof File) {
  //       formData.append('foodImage', currentFood.foodImage);
  //     }

  //     const response = await fetch(`http://localhost:5000/api/v1/foods/update/${currentFood._id}`, {
  //       method: 'PUT',
  //       credentials: 'include',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       },
  //       body: formData
  //     });

  //     const data = await response.json();
  //     console.log("data : ", data);

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to update food item');
  //     }

  //     setFoodItems(foodItems.map(item =>
  //       item._id === currentFood._id ? {
  //         ...item,
  //         name: data.updatedFood.foodName || "",
  //         price: data.updatedFood.foodPrice || "",
  //         category: data.updatedFood.foodCategory || "",
  //         description: data.updatedFood.foodDescription || "",
  //         isVeg: data.updatedFood.isVeg || false,
  //         image: data.updatedFood.foodImage || ""
  //       } : item
  //     ));

  //     toast.success("Food item updated successfully");
  //     setIsEditModalOpen(false);

  //   } catch (error) {
  //     console.log('Error on editing food: ', error.message);
  //     toast.error('Error on editing food');
  //   }
  // };

  const handleDeleteFood = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/foods/delete/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-black dark:text-black">
          Manage Food Items
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Add Food Item
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
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
              {foodItems.map((item) => (
                <tr key={item._id} className={!item.isActive ? "opacity-70 bg-gray-50 dark:bg-gray-700" : ""} >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Rs {item.price ? item.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleActiveSatus(item._id, item.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${item.isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFood(item._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {foodItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center">
                    <div className="flex flex-col items-center">
                      <Player
                        autoplay
                        loop
                        src={emptyAnimation}
                        style={{ height: '200px', width: '200px' }}
                      />
                      <p className="mt-4 text-gray-600 dark:text-gray-300">No food items found!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Food Item
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    value={newFood.foodName}
                    onChange={(e) =>
                      setNewFood({ ...newFood, foodName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (Rs)
                  </label>
                  <input
                    type="number"
                    value={newFood.foodPrice}
                    onChange={(e) =>
                      setNewFood({ ...newFood, foodPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newFood.foodCategory}
                    onChange={(e) =>
                      setNewFood({ ...newFood, foodCategory: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newFood.foodDescription}
                    onChange={(e) =>
                      setNewFood({ ...newFood, foodDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newFood.isVeg}
                    onChange={(e) => setNewFood({ ...newFood, isVeg: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Vegetarian
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newFood.isActive}
                    onChange={(e) => setNewFood({ ...newFood, isActive: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Available for ordering
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Food Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setNewFood({ ...newFood, foodImage: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                onClick={handleAddFood}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add Food
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Food Modal */}
      {isEditModalOpen && currentFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Edit Food Item
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={currentFood.foodName}
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, foodName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (Rs)
                  </label>
                  <input
                    type="number"
                    value={currentFood.foodPrice}
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, foodPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={currentFood.foodCategory}
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, foodCategory: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={currentFood.foodDescription}
                      onChange={(e) =>
                        setCurrentFood({ ...currentFood, foodDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentFood.isVeg}
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, isVeg: e.target.checked })
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Vegetarian
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentFood.isActive}
                    onChange={(e) => setCurrentFood({ ...currentFood, isActive: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Available for ordering
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Food Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setCurrentFood({ ...currentFood, foodImage: e.target.files[0] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    accept="image/*"
                  />
                  {currentFood.foodImage && !(currentFood.foodImage instanceof File) && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Current Image:</p>
                      <img
                        src={currentFood.foodImage}
                        alt="Current food"
                        className="h-20 w-20 object-cover mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                onClick={handleEditFood}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Food;
























// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const Food = () => {
//   // const [foodItems, setFoodItems] = useState([
//   //   {
//   //     id: 1,
//   //     name: "Cheese Burger",
//   //     price: 5.99,
//   //     category: "Fast Food",
//   //     status: "available",
//   //     image: "https://via.placeholder.com/150",
//   //   }

//   const [foodItems, setFoodItems] = useState([])
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentFood, setCurrentFood] = useState({
//     foodName: "",
//     foodPrice: "",
//     foodCategory: "",
//     foodImage: null,
//     foodDescription: "",
//     isVeg: false
//   });
//   const [newFood, setNewFood] = useState({
//     foodName: "",
//     foodPrice: "",
//     foodCategory: "",
//     foodImage: null,
//     foodDescription: "",
//     isVeg: false
//   });

//   const categories = ["Fast Food", "Italian", "Healthy", "Snacks", "Beverages", "Hot Drinks", "Icecream","Cold Drinks"];

//   useEffect(() => {
//     const fetchFoodItems = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/v1/foods', {
//           credentials: 'include',
//         });


//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("data : ", data)

//         setFoodItems(data.foodslist.map(food => ({
//           _id: food._id,
//           name: food.foodName,
//           price: food.foodPrice,
//           category: food.foodCategory,
//           description: food.foodDescription,
//           isVeg: food.isVeg,
//           // status: food.status || 'available',
//           image: food.foodImage
//         })));


//       } catch (error) {
//         console.error("Error fetching foods:", error.message);
//         toast.error('Failed to load food items');
//         setFoodItems([]);
//       }
//     };

//     fetchFoodItems();
//   }, []);

//   const handleAddFood = async () => {

//     const formData = new FormData();
//     formData.append('foodName', newFood.foodName);
//     formData.append('foodPrice', newFood.foodPrice);
//     formData.append('foodCategory', newFood.foodCategory);
//     formData.append('foodDescription', newFood.foodDescription);
//     formData.append('isVeg', newFood.isVeg);
//     if (newFood.foodImage) {
//       formData.append('foodImage', newFood.foodImage);
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/v1/foods/create', {
//         method: 'POST',
//         credentials: 'include',
//         body: formData
//       })
//       const data = await response.json();
//       console.log("data : ", data)

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
//         isVeg: false
//       });
//       console.log("newFood : ", newFood);
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
//       // formData.append('isVeg', currentFood.isVeg || false);

//       if (currentFood.foodImage instanceof File) {
//         formData.append('foodImage', currentFood.foodImage);
//       }
//       const response = await fetch(`http://localhost:5000/api/v1/foods/update/${currentFood._id}`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // If using JWT
//         },
//         body: formData
//       })

//       const data = await response.json();
//       console.log("data : ", data)

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update food item');
//       }

//       setFoodItems(foodItems.map(item =>
//         item._id === currentFood._id ? data.updatedFood : item
//       ));

//       toast.success("Food item updated successfully");
//       setIsEditModalOpen(false);

//     } catch (error) {
//       console.log('Error on editing food: ', error.message)
//       toast.error('Error on editing food')
//     }
//   };
//   // const handleEditFood = () => {
//   //   setFoodItems(
//   //     foodItems.map((item) =>
//   //       item.id === currentFood.id ? { ...item, ...currentFood } : item
//   //     )
//   //   );
//   //   toast.success("Food item updated successfully");
//   //   setIsEditModalOpen(false);
//   // };

//   const handleDeleteFood = (id) => {
//     if (window.confirm("Are you sure you want to delete this food item?")) {
//       setFoodItems(foodItems.filter((item) => item.id !== id));
//       toast.success("Food item deleted successfully");
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
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
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Status
//                 </th> */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {foodItems.map((item) => (
//                 <tr key={item._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="h-10 w-10 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                     {item.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     Rs {item.price.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                     {item.category}
//                   </td>
//                   {/* <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "available"
//                         ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                         : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                         }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td> */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => {
//                         setCurrentFood(item);
//                         setIsEditModalOpen(true);
//                       }}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-4"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteFood(item.id)}
//                       className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
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
//                   >
//                     <option value="">Select a category</option>
//                     {categories.map((categories) => (
//                       <option key={categories} value={categories}>
//                         {categories}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Description
//                   </label>
//                   <input
//                     type="description"
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
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Status
//                   </label>
//                   <select
//                     value={newFood.status}
//                     onChange={(e) =>
//                       setNewFood({ ...newFood, status: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                   >
//                     <option value="available">Available</option>
//                     <option value="out of stock">Out of Stock</option>
//                   </select>
//                 </div> */}
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
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Price (Rs)
//                   </label>
//                   <input
//                     type="text"
//                     value={currentFood.foodPrice}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, foodPrice: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
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
//                   >
//                     {categories.map((categories) => (
//                       <option key={categories} value={categories}>
//                         {categories}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Status
//                   </label>
//                   <select
//                     value={currentFood.status}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, status: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                   >
//                     <option value="available">Available</option>
//                     <option value="out of stock">Out of Stock</option>
//                   </select>
//                 </div> */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Vegetarian
//                   </label>
//                   <input
//                     type="checkbox"
//                     checked={currentFood.isVeg || false}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, isVeg: e.target.checked })
//                     }
//                     className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Food Image
//                   </label>
//                   <input
//                     type="file"
//                     // value={currentFood.foodImage}
//                     onChange={(e) =>
//                       setCurrentFood({ ...currentFood, foodImage: e.target.files[0] })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                     accept="image/*"
//                   />
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