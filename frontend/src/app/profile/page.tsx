'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  User, 
  Settings, 
  Car, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Award,
  Edit3,
  Camera,
  Bell,
  Shield,
  TrendingUp,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { carsApi } from '@/lib/api';
import { Car as CarType } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userCars, setUserCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    licenseNumber: user?.licenseNumber || ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchUserCars();
  }, [user, router]);

  const fetchUserCars = async () => {
    try {
      setLoading(true);
      const response = await carsApi.getCars();
      if (response.success) {
        // Filter cars by current user
        const myCars = response.data.cars.filter(car => car.userId === user?.id);
        setUserCars(myCars);
      }
    } catch (error) {
      console.error('Error fetching user cars:', error);
      toast.error('Failed to load your cars');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      businessName: user?.businessName || '',
      businessType: user?.businessType || '',
      licenseNumber: user?.licenseNumber || ''
    });
  };

  const handleSave = async () => {
    try {
      // Here you would typically call an API to update user profile
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      businessName: user?.businessName || '',
      businessType: user?.businessType || '',
      licenseNumber: user?.licenseNumber || ''
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading profile..." />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Cars Listed',
      value: userCars.length,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Approved Cars',
      value: userCars.filter(car => car.approved).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending Approval',
      value: userCars.filter(car => !car.approved).length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Total Value',
      value: `$${userCars.reduce((sum, car) => sum + (car.price || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'cars', label: 'My Cars', icon: Car },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-lg text-gray-600 capitalize">{user.role?.toLowerCase()}</p>
                  {user.businessName && (
                    <p className="text-sm text-gray-500">{user.businessName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleEdit}
                  className="btn btn-outline flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="btn btn-error flex items-center"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {userCars.slice(0, 5).map((car, index) => (
                        <div key={car.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{car.brand} {car.model}</p>
                            <p className="text-sm text-gray-600">
                              {car.approved ? 'Approved' : 'Pending approval'} • ${car.price?.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {car.approved ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* My Cars Tab */}
              {activeTab === 'cars' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">My Cars ({userCars.length})</h3>
                    <button
                      onClick={() => router.push('/sell')}
                      className="btn btn-primary flex items-center"
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Add New Car
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <LoadingSpinner size="lg" text="Loading your cars..." />
                    </div>
                  ) : userCars.length === 0 ? (
                    <div className="text-center py-12">
                      <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No cars listed</h3>
                      <p className="text-gray-600 mb-6">Start by listing your first car for sale.</p>
                      <button
                        onClick={() => router.push('/sell')}
                        className="btn btn-primary"
                      >
                        List Your Car
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {userCars.map((car) => (
                        <div key={car.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                          <div className="relative h-48 bg-gray-100">
                            {car.images && car.images.length > 0 ? (
                              <Image
                                src={car.images[0]}
                                alt={`${car.brand} ${car.model}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Car className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                car.approved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {car.approved ? 'Approved' : 'Pending'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900">{car.brand} {car.model}</h4>
                            <p className="text-sm text-gray-600 mb-2">{car.year} • {car.condition}</p>
                            <p className="text-lg font-bold text-primary-600">${car.price?.toLocaleString()}</p>
                            <div className="flex items-center justify-between mt-4">
                              <button
                                onClick={() => router.push(`/inventory/${car.id}`)}
                                className="btn btn-sm btn-outline"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                              <button className="btn btn-sm btn-outline">
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                              className="input input-bordered w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                              type="tel"
                              value={editData.phone}
                              onChange={(e) => setEditData({...editData, phone: e.target.value})}
                              className="input input-bordered w-full"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <textarea
                            value={editData.address}
                            onChange={(e) => setEditData({...editData, address: e.target.value})}
                            className="textarea textarea-bordered w-full"
                            rows={3}
                          />
                        </div>

                        {user.role !== 'OWNER' && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                <input
                                  type="text"
                                  value={editData.businessName}
                                  onChange={(e) => setEditData({...editData, businessName: e.target.value})}
                                  className="input input-bordered w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                <select
                                  value={editData.businessType}
                                  onChange={(e) => setEditData({...editData, businessType: e.target.value})}
                                  className="select select-bordered w-full"
                                >
                                  <option value="">Select Type</option>
                                  <option value="DEALERSHIP">Dealership</option>
                                  <option value="GARAGE">Garage</option>
                                  <option value="SHOWROOM">Showroom</option>
                                  <option value="OTHER">Other</option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                              <input
                                type="text"
                                value={editData.licenseNumber}
                                onChange={(e) => setEditData({...editData, licenseNumber: e.target.value})}
                                className="input input-bordered w-full"
                              />
                            </div>
                          </>
                        )}

                        <div className="flex items-center space-x-3 pt-4">
                          <button onClick={handleSave} className="btn btn-primary">
                            Save Changes
                          </button>
                          <button onClick={handleCancel} className="btn btn-outline">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Full Name</p>
                              <p className="font-medium">{user.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium">{user.phone || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Address</p>
                              <p className="font-medium">{user.address || 'Not provided'}</p>
                            </div>
                          </div>
                          {user.businessName && (
                            <div className="flex items-center space-x-3">
                              <Building className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-600">Business Name</p>
                                <p className="font-medium">{user.businessName}</p>
                              </div>
                            </div>
                          )}
                          {user.licenseNumber && (
                            <div className="flex items-center space-x-3">
                              <Award className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-600">License Number</p>
                                <p className="font-medium">{user.licenseNumber}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-600">Update your password for better security</p>
                        </div>
                        <button className="btn btn-outline btn-sm">Change</button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                        <button className="btn btn-outline btn-sm">Enable</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Car Approval Notifications</p>
                          <p className="text-sm text-gray-600">Get notified when your cars are approved</p>
                        </div>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Marketing Emails</p>
                          <p className="text-sm text-gray-600">Receive promotional content</p>
                        </div>
                        <input type="checkbox" className="toggle toggle-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
