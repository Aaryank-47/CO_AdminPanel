import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { UserCircleIcon, PencilIcon, CheckIcon, XIcon } from "../components/Icons.jsx";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Super Admin",
    phone: "",
    joinDate: "",
    collegeName: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profile });
  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    getAdminProfile(adminId);
  }, []);

  const getAdminProfile = async (adminId) => {
    try {
      if (!adminId) {
        console.log('Admin ID not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/admin/profile/${adminId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.adminProfile) {
        throw new Error('Profile data not found');
      }

      // Map backend data to frontend structure
      setProfile({
        name: data.adminProfile.adminName,
        email: data.adminProfile.adminEmail,
        phone: data.adminProfile.phoneNumber,
        collegeName: data.adminProfile.collegeName,
        role: "Super Admin",
        joinDate: new Date(data.adminProfile.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      setEditData({
        name: data.adminProfile.adminName,
        email: data.adminProfile.adminEmail,
        phone: data.adminProfile.phoneNumber,
        collegeName: data.adminProfile.collegeName
      });

    } catch (error) {
      console.error('Error fetching admin profile:', error.message);
      toast.error("Failed to load profile data");
    }
  };

  const updateAdminProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/admin/update-profile/${adminId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminName: editData.name,
          adminEmail: editData.email,
          phoneNumber: editData.phone,
          collegeName: editData.collegeName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.updatedUserData) {
        throw new Error('Profile update failed');
      }

      // Update local state with new data
      setProfile(prev => ({
        ...prev,
        name: data.updatedUserData.adminName,
        email: data.updatedUserData.adminEmail,
        phone: data.updatedUserData.phoneNumber,
        collegeName: data.updatedUserData.collegeName
      }));
      
      toast.success("Profile updated successfully");
      setIsEditing(false);

    } catch (error) {
      console.error("Error updating admin profile:", error.message);
      toast.error("Failed to update profile");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveProfile = () => {
    updateAdminProfile();
  };

  const cancelEdit = () => {
    setEditData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      collegeName: profile.collegeName
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Admin Profile
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={cancelEdit}
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <UserCircleIcon className="w-24 h-24 text-gray-400 dark:text-gray-600" />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{profile.role}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {profile.joinDate}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-6">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-white">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-white">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <p className="text-gray-800 dark:text-white">{profile.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-white">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  College Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="collegeName"
                    value={editData.collegeName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-white">{profile.collegeName}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
















// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { UserCircleIcon, PencilIcon, CheckIcon, XIcon } from "../components/Icons.jsx";

// const AdminProfile = () => {
//   const [profile, setProfile] = useState({
//     name: "Aaryan Kamalwanshi",
//     email: "admin@canteen.com",
//     role: "Super Admin",
//     phone: "+1234567890",
//     joinDate: "January 15, 2023",
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({ ...profile });
//   const adminId = localStorage.getItem('adminId');


//   const getAdminProfile = async () => {
//     try {
//       if (!adminId) {
//         console.log('Not get Admin ID');
//       }

//       const response = await fetch(`http://localhost:5000/api/v1/admin/profile/${adminId}`, {
//         method: 'GET',
//         credentials: 'include'
//       })

//       if (!response.ok) {
//         throw new Error(`Http response error status ${response.status} from backend server`)
//       }

//       const data = await response.json();
//       if (!data) {
//         console.log('Profile data not found : ', data.message)
//       }
//       console.log("Profile data : ", data);


//     } catch (error) {
//       console.log('Error in getting the admin Profile', error.message);
//     }

//   }

//   const updateAdminProfile = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/v1/admin/update-profile/${adminId}`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Http response error status ${response.status} from backend server`);
//       }

//       const data = await response.json();
//       if (!data) {
//         console.log("Updation profile data fetching error : ",data.message);
//       }
//       console.log("Profile updation data : ",data);

//     } catch (error) {
//       console.log("Error in updateion of admin profile : ", error.message);
//     }
//   }

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData({ ...editData, [name]: value });
//   };

//   const saveProfile = () => {
//     setProfile(editData);
//     setIsEditing(false);
//     toast.success("Profile updated successfully");
//   };

//   const cancelEdit = () => {
//     setEditData(profile);
//     setIsEditing(false);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
//           Admin Profile
//         </h1>
//         {!isEditing ? (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//           >
//             <PencilIcon className="w-4 h-4 mr-2" />
//             Edit Profile
//           </button>
//         ) : (
//           <div className="flex space-x-2">
//             <button
//               onClick={cancelEdit}
//               className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//             >
//               <XIcon className="w-4 h-4 mr-2" />
//               Cancel
//             </button>
//             <button
//               onClick={saveProfile}
//               className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//             >
//               <CheckIcon className="w-4 h-4 mr-2" />
//               Save Changes
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
//             <div className="flex justify-center">
//               <div className="relative">
//                 <UserCircleIcon className="w-24 h-24 text-gray-400 dark:text-gray-600" />
//                 {isEditing && (
//                   <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700">
//                     <PencilIcon className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>
//             <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
//               {profile.name}
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300">{profile.role}</p>
//             <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Member since {profile.joinDate}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//             <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-6">
//               Profile Information
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Full Name
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="name"
//                     value={editData.name}
//                     onChange={handleEditChange}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                   />
//                 ) : (
//                   <p className="text-gray-800 dark:text-white">{profile.name}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Email Address
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     name="email"
//                     value={editData.email}
//                     onChange={handleEditChange}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                   />
//                 ) : (
//                   <p className="text-gray-800 dark:text-white">{profile.email}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Role
//                 </label>
//                 <p className="text-gray-800 dark:text-white">{profile.role}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Phone Number
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={editData.phone}
//                     onChange={handleEditChange}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
//                   />
//                 ) : (
//                   <p className="text-gray-800 dark:text-white">{profile.phone}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;