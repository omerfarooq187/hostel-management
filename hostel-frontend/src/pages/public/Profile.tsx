import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  UserCircleIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  PhoneIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeIcon,
  PencilIcon,
  CheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Bed Icon Component
const BedIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 14h14M5 17v-4m14 4v-4m-7-7v4m0-4h3m-3 0H8m8 8H8m8 0v2M8 17v2"
    />
  </svg>
);

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [room, setRoom] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const studentRes = await api.get("/api/student/me");
      setStudent(studentRes.data);

      setFormData({
        name: studentRes.data.name,
        phone: studentRes.data.studentRequest?.phone || "",
      });

      try {
        const roomRes = await api.get("/api/student/me/room");
        setRoom(roomRes.data);
      } catch (roomErr) {
        // Room might not be allocated yet
        setRoom(null);
      }

      try {
        const feesRes = await api.get("/api/student/me/fees");
        setFees(feesRes.data);
      } catch (feesErr) {
        // Fees might not be available yet
        setFees([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put("/api/user/me", {
        name: formData.name,
        phone: formData.phone,
      });

      const studentRes = await api.get("/api/student/me");
      setStudent(studentRes.data);

      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const downloadReceipt = async (feeId) => {
    setDownloading(prev => ({ ...prev, [feeId]: true }));
    try {
      const response = await api.get(`/api/student/me/fees/${feeId}/receipt`, {
        responseType: 'blob', // Important for file downloads
      });

      // Create a blob URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fee-receipt-${feeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download receipt:', err);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [feeId]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircleIcon className="h-3 w-3 inline mr-1" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <ClockIcon className="h-3 w-3 inline mr-1" />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <ExclamationCircleIcon className="h-3 w-3 inline mr-1" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  const getLatestFee = () => {
    if (!fees.length) return null;
    return fees.sort((a, b) => new Date(b.paymentDate || b.dueDate) - new Date(a.paymentDate || a.dueDate))[0];
  };

  const latestFee = getLatestFee();

  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-alt p-4 font-sans pt-24">
        <div className="bg-white rounded-2xl shadow-lg border border-border-color p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-heading-color mb-2">Error Loading Profile</h3>
          <p className="text-foreground mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 px-6 py-3 bg-heading-color hover:bg-primary text-light-color rounded-btn font-medium transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-alt font-sans pt-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-heading-color/90 via-dark-shade/90 to-secondary/90 mt-6">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-light-color/20 backdrop-blur-sm rounded-2xl">
                <UserCircleIcon className="h-12 w-12 text-light-color" />
              </div>
              <div>
                <h1 className="text-3xl font-medium text-light-color">
                  {student?.name || "My Profile"}
                </h1>
                <p className="text-light-color/80 mt-1">Manage your account, allocation, and fees</p>
              </div>
            </div>
            <button
              onClick={fetchProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-light-color/20 backdrop-blur-sm hover:bg-light-color/30 text-light-color rounded-btn font-medium transition-all duration-300"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information & Fees */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-border-color">
              <div className="p-6 border-b border-border-color">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <UserCircleIcon className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-heading-color">Personal Details</h2>
                  </div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-shade hover:bg-primary hover:text-light-color text-primary rounded-btn font-medium transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {editMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-heading-color mb-2">
                        Full Name
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-color rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-heading-color mb-2">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-color rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdate}
                        disabled={updating}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-heading-color hover:bg-primary text-light-color rounded-btn font-medium transition-colors duration-300 disabled:opacity-50"
                      >
                        {updating ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 border-2 border-heading-color text-heading-color hover:bg-heading-color hover:text-light-color rounded-btn font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                      icon={<UserCircleIcon className="h-5 w-5" />}
                      label="Name"
                      value={student?.name}
                      color="primary"
                    />
                    <InfoItem
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                      label="Email"
                      value={student?.email}
                      color="secondary"
                    />
                    <InfoItem
                      icon={<AcademicCapIcon className="h-5 w-5" />}
                      label="Roll Number"
                      value={student?.studentRequest?.rollNo}
                      color="primary"
                    />
                    <InfoItem
                      icon={<PhoneIcon className="h-5 w-5" />}
                      label="Phone"
                      value={student?.studentRequest?.phone || "Not provided"}
                      color="secondary"
                    />
                    <InfoItem
                      icon={<UserGroupIcon className="h-5 w-5" />}
                      label="Guardian Name"
                      value={student?.studentRequest?.guardianName || "Not provided"}
                      color="primary"
                    />
                    <InfoItem
                      icon={<PhoneIcon className="h-5 w-5" />}
                      label="Guardian Phone"
                      value={student?.studentRequest?.guardianPhoneNumber || "Not provided"}
                      color="secondary"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Fee Payment Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-border-color">
              <div className="p-6 border-b border-border-color">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 text-green-600 rounded-xl">
                      <CurrencyDollarIcon className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-heading-color">Fee Payments</h2>
                  </div>
                  <span className="text-sm text-meta-color">
                    {fees.length} payment{fees.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>

              <div className="p-6">
                {fees.length > 0 ? (
                  <div className="space-y-6">
                    {/* Latest Fee Highlight */}
                    {latestFee && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-heading-color mb-1">
                              Latest Payment
                            </h3>
                            <p className="text-sm text-foreground">
                              {latestFee.description || "Hostel Fee Payment"}
                            </p>
                          </div>
                          {getStatusBadge(latestFee.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-border-color">
                            <div className="text-sm text-meta-color mb-1">Amount</div>
                            <div className="font-bold text-heading-color text-lg">
                              {formatCurrency(latestFee.amount || 0)}
                            </div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-border-color">
                            <div className="text-sm text-meta-color mb-1">Due Date</div>
                            <div className="font-semibold text-heading-color">
                              {latestFee.dueDate ? formatDate(latestFee.dueDate) : "N/A"}
                            </div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-border-color">
                            <div className="text-sm text-meta-color mb-1">Paid Date</div>
                            <div className="font-semibold text-heading-color">
                              {latestFee.paymentDate ? formatDate(latestFee.paymentDate) : "Not Paid"}
                            </div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-border-color">
                            <div className="text-sm text-meta-color mb-1">Transaction ID</div>
                            <div className="font-semibold text-heading-color text-sm truncate">
                              {latestFee.transactionId || "N/A"}
                            </div>
                          </div>
                        </div>

                        {latestFee.status?.toLowerCase() === 'paid' && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => downloadReceipt(latestFee.id)}
                              disabled={downloading[latestFee.id]}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-heading-color hover:bg-primary text-light-color rounded-btn font-medium transition-colors disabled:opacity-50"
                            >
                              {downloading[latestFee.id] ? (
                                <>
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <ArrowDownIcon className="h-4 w-4" />
                                  Download Receipt
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                // View receipt in new tab
                                window.open(`/api/student/me/fees/${latestFee.id}/receipt`, '_blank');
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-heading-color text-heading-color hover:bg-heading-color hover:text-light-color rounded-btn font-medium transition-colors"
                            >
                              <ReceiptPercentIcon className="h-4 w-4" />
                              View Receipt
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* All Fees Table */}
                    <div>
                      <h3 className="text-lg font-semibold text-heading-color mb-4">Payment History</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border-color">
                              <th className="text-left py-3 px-4 text-sm font-medium text-meta-color">Description</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-meta-color">Amount</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-meta-color">Due Date</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-meta-color">Status</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-meta-color">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-color">
                            {fees.map((fee) => (
                              <tr key={fee.id} className="hover:bg-primary-shade/30 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="font-medium text-heading-color">{fee.description}</div>
                                  <div className="text-xs text-meta-color">{fee.id}</div>
                                </td>
                                <td className="py-3 px-4 font-semibold text-heading-color">
                                  {formatCurrency(fee.amount || 0)}
                                </td>
                                <td className="py-3 px-4 text-foreground">
                                  {fee.dueDate ? formatDate(fee.dueDate) : "N/A"}
                                </td>
                                <td className="py-3 px-4">
                                  {getStatusBadge(fee.status)}
                                </td>
                                <td className="py-3 px-4">
                                  {fee.status?.toLowerCase() === 'paid' ? (
                                    <button
                                      onClick={() => downloadReceipt(fee.id)}
                                      disabled={downloading[fee.id]}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-shade hover:bg-primary hover:text-light-color text-primary rounded-btn text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                      {downloading[fee.id] ? (
                                        <ArrowPathIcon className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <ArrowDownIcon className="h-3 w-3" />
                                      )}
                                      Receipt
                                    </button>
                                  ) : (
                                    <span className="text-sm text-meta-color">No receipt</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-shade rounded-full mb-4">
                      <CurrencyDollarIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-heading-color mb-2">No Fee Records</h3>
                    <p className="text-foreground mb-4">
                      Your fee records will appear here once they are added by the administration.
                    </p>
                    <span className="inline-block px-4 py-2 bg-primary-shade text-primary rounded-full font-medium">
                      No Payments Yet
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Room & Quick Actions */}
          <div className="space-y-6">
            {/* Room Allocation Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-border-color overflow-hidden">
              <div className="p-6 border-b border-border-color">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
                    <BuildingOfficeIcon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold text-heading-color">Room Allocation</h2>
                </div>
              </div>

              <div className="p-6">
                {room ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border-color rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold text-heading-color">
                          {room.block} - Room {room.roomNumber}
                        </div>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          Allocated
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-border-color">
                          <div className="flex items-center gap-2 mb-1">
                            <HomeIcon className="h-4 w-4 text-meta-color" />
                            <span className="text-sm text-foreground">Block</span>
                          </div>
                          <div className="font-semibold text-heading-color">{room.block}</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-border-color">
                          <div className="flex items-center gap-2 mb-1">
                            <BuildingOfficeIcon className="h-4 w-4 text-meta-color" />
                            <span className="text-sm text-foreground">Room</span>
                          </div>
                          <div className="font-semibold text-heading-color">{room.roomNumber}</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-border-color">
                          <div className="flex items-center gap-2 mb-1">
                            <BedIcon className="h-4 w-4 text-meta-color" />
                            <span className="text-sm text-foreground">Bed</span>
                          </div>
                          <div className="font-semibold text-heading-color">{room.bedNumber}</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-border-color">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon className="h-4 w-4 text-meta-color" />
                            <span className="text-sm text-foreground">Status</span>
                          </div>
                          <div className="font-semibold text-primary">Active</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary-shade border border-primary/20 rounded-xl">
                      <p className="text-sm text-heading-color">
                        Your room allocation is currently active. Please contact the admin office for any changes or issues.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-shade rounded-full mb-4">
                      <HomeIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-heading-color mb-2">No Room Allocated</h3>
                    <p className="text-foreground mb-6">
                      Your room allocation is pending. Please wait for admin assignment.
                    </p>
                    <span className="inline-block px-4 py-2 bg-primary-shade text-primary rounded-full font-medium">
                      Pending Allocation
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border-color rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary text-light-color rounded-xl">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-heading-color">Account Status</h3>
                  <p className="text-foreground text-sm">Your current account information</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-border-color">
                  <div className="text-sm text-meta-color">Account Type</div>
                  <div className="font-semibold text-heading-color mt-1">Student</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-border-color">
                  <div className="text-sm text-meta-color">Fee Status</div>
                  <div className={`font-semibold mt-1 ${
                    latestFee?.status?.toLowerCase() === 'paid' ? 'text-green-600' : 
                    latestFee?.status?.toLowerCase() === 'pending' ? 'text-yellow-600' : 
                    'text-heading-color'
                  }`}>
                    {latestFee?.status || 'N/A'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-border-color">
                  <div className="text-sm text-meta-color">Total Payments</div>
                  <div className="font-semibold text-heading-color mt-1">{fees.length}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-border-color">
                  <div className="text-sm text-meta-color">Last Updated</div>
                  <div className="font-semibold text-heading-color mt-1">Today</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-border-color p-6">
              <h3 className="text-lg font-semibold text-heading-color mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-white hover:bg-primary-shade border border-border-color hover:border-primary/20 rounded-xl transition-all duration-300 group">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-light-color transition-colors">
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-heading-color group-hover:text-primary transition-colors">Contact Admin</div>
                    <div className="text-sm text-foreground">Request room change or report issues</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left bg-white hover:bg-primary-shade border border-border-color hover:border-primary/20 rounded-xl transition-all duration-300 group">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:bg-secondary group-hover:text-light-color transition-colors">
                    <ArrowPathIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-heading-color group-hover:text-secondary transition-colors">Check Status</div>
                    <div className="text-sm text-foreground">View latest allocation updates</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left bg-white hover:bg-primary-shade border border-border-color hover:border-primary/20 rounded-xl transition-all duration-300 group">
                  <div className="p-2 bg-green-500/10 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-light-color transition-colors">
                    <CurrencyDollarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-heading-color group-hover:text-green-600 transition-colors">Pay Fees</div>
                    <div className="text-sm text-foreground">Make fee payment online</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left bg-white hover:bg-primary-shade border border-border-color hover:border-primary/20 rounded-xl transition-all duration-300 group">
                  <div className="p-2 bg-heading-color/10 text-heading-color rounded-lg group-hover:bg-heading-color group-hover:text-light-color transition-colors">
                    <KeyIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-heading-color">Change Password</div>
                    <div className="text-sm text-foreground">Update your account password</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value, color }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-white border border-border-color rounded-xl hover:border-primary/30 transition-colors duration-300">
      <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.primary}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-meta-color">{label}</div>
        <div className="font-medium text-heading-color mt-1 truncate">
          {value || "Not provided"}
        </div>
      </div>
    </div>
  );
};

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background-alt font-sans animate-pulse pt-20">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-heading-color/90 via-dark-shade/90 to-secondary/90 mt-6">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-light-color/20 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-8 w-48 bg-light-color/20 rounded"></div>
                <div className="h-4 w-32 bg-light-color/20 rounded"></div>
              </div>
            </div>
            <div className="h-10 w-32 bg-light-color/20 rounded-btn"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 -mt-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-border-color">
              <div className="p-6 border-b border-border-color">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 w-32 bg-gray-200 rounded-btn"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl">
                      <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-20 bg-gray-300 rounded"></div>
                        <div className="h-6 w-32 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fee Section Skeleton */}
            <div className="bg-white rounded-2xl border border-border-color">
              <div className="p-6 border-b border-border-color">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border-color">
              <div className="p-6 border-b border-border-color">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 w-40 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="h-40 bg-gray-200 rounded-xl"></div>
                  <div className="h-20 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}