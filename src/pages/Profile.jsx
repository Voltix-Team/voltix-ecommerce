import React, { useContext } from 'react';
import { Edit, MapPin, CheckCircle2 } from 'lucide-react';
import { UserContext } from './UserContext'; 

const ProfilePage = () => {
  // Consume the context
  const { user, logout } = useContext(UserContext);

  // Optional: Add a loading or empty state if the user data isn't available yet
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return(
    <main className="max-w-6xl mx-auto px-6 py-12 bg-[#F8FAFC] min-h-screen">
      {/* Profile Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-6">
          {/* Avatar Container */}
          <div className="w-24 h-24 bg-white border-2 border-blue-600 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
            <img 
              src={user?.avatar || "/api/placeholder/96/96"} 
              alt={`${user?.name}'s Avatar`} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {user?.name}
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">
              Member Since: {user?.memberSince}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={logout}
            className="flex-1 md:flex-none px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm">
            Update Profile
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personal Information Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            <button className="text-[#0066FF] hover:text-blue-800 transition-colors">
              <Edit size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-gray-800 font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-gray-800 font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
              <p className="text-gray-800 font-medium">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              <button className="px-4 py-1.5 border border-gray-200 text-[#0066FF] text-xs font-bold uppercase tracking-wider rounded-md hover:bg-gray-50 transition-colors">
                Manage
              </button>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-[#0066FF] mt-0.5 flex-shrink-0" size={20} />
              <div className="text-gray-700 font-medium leading-relaxed">
                <p>{user?.address.street}</p>
                {user?.address.suite && <p>{user?.address.suite}</p>}
                <p>{user?.address.city}, {user?.address.state} {user?.address.zip}</p>
                <p>{user?.address.country}</p>
              </div>
            </div>
          </div>

          {/* Card Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-gray-500">
            <CheckCircle2 size={16} className="text-gray-400" />
            <span className="text-sm font-medium">Primary Shipping Destination</span>
          </div>
        </div>

      </div>
   
    </main>
  );
};

export default ProfilePage;