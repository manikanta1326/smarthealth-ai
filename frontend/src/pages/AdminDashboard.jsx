import { useEffect, useState } from "react";
import { getAdminDashboard, deleteUser } from "../services/adminApi";
import { Users, Shield, Heart, ArrowLeft, Search, Scale, AlertTriangle, Calendar, Eye, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // 7. Modal Control State
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const res = await getAdminDashboard();
      if (res.success) {
        setUsers(res.users || []);
        setProfiles(res.profiles || []);
        setStats(res.stats || {});
      }
    } catch (err) {
      console.error("Error loading admin datasets:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await deleteUser(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("An error occurred while attempting to delete the user.");
    }
  }

  // Helper calculation function for Modal BMI parsing
  const calculateMetrics = (height, weight) => {
    let bmi = "-";
    let status = "Normal";
    let badge = "⚪";
    let color = "text-gray-600";

    if (height && weight) {
      bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);

      if (bmi < 18.5) {
        status = "Underweight";
        badge = "🟡";
        color = "text-yellow-500";
      } else if (bmi < 25) {
        status = "Healthy";
        badge = "🟢";
        color = "text-green-600";
      } else if (bmi < 30) {
        status = "Overweight";
        badge = "🟠";
        color = "text-orange-500";
      } else {
        status = "Obese";
        badge = "🔴";
        color = "text-red-600";
      }
    }
    return { bmi, status, badge, color };
  };

  // Open modal handler matching corresponding profile health dataset
  const handleOpenModal = (user) => {
    const matchingProfile = profiles.find((p) => p.user?._id === user._id || p.userId === user._id);
    setSelectedUserDetail({
      user,
      profile: matchingProfile || {}
    });
  };

  const filteredUsers = users.filter((user) =>
    (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-2)]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent mx-auto" />
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Loading Admin Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-2)] px-4 pt-6 pb-24 md:px-8 relative">
      {/* Header Panel */}
      <div className="mx-auto max-w-6xl mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Management Console</p>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--color-text)]">Admin Dashboard</h1>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2 text-amber-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
          <Shield size={14} />
          Authorized Access
        </div>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Registered Users Table List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* 8. Better Polished Stat Cards with Clear Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Users size={22} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Users</p>
                <h2 className="text-2xl font-bold text-gray-800">{stats.totalUsers ?? 0}</h2>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <Heart size={22} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Profiles</p>
                <h2 className="text-2xl font-bold text-gray-800">{stats.totalProfiles ?? 0}</h2>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <Scale size={22} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Average BMI</p>
                <h2 className="text-2xl font-bold text-gray-800">{stats.avgBMI ?? "--"}</h2>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">High Risk</p>
                <h2 className="text-2xl font-bold text-rose-600">{stats.highRiskUsers ?? 0}</h2>
              </div>
            </div>
          </div>

          {/* User Section Header & Search Input */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-2 text-blue-600">
                <Users size={18} />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">Registered Users ({filteredUsers.length})</h2>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition-all"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-black/5 bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 bg-neutral-50/70 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">System Identity</th>
                    <th className="px-6 py-4">Account Attributes</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03] text-sm text-[var(--color-text)]">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-neutral-800">{u.name || "Anonymous User"}</div>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar size={12} /> Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Prior Log"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-text-muted)]">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-semibold ${
                          u.role === "admin" 
                            ? "bg-rose-50 text-rose-700 border border-rose-100" 
                            : "bg-neutral-100 text-neutral-700"
                        }`}>
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* 7. View Detailed Metrics Button */}
                          <button
                            onClick={() => handleOpenModal(u)}
                            className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border border-neutral-200"
                          >
                            <Eye size={12} /> View
                          </button>

                          {u.role !== "admin" ? (
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm"
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="bg-gray-50 text-gray-400 text-[11px] px-2.5 py-1 rounded-lg font-medium border border-gray-200/40">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-sm text-[var(--color-text-muted)]">
                        No matches found for your platform search constraints.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Health Monitoring Profile Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2 text-emerald-600">
              <Heart size={18} />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Health Profiles ({profiles.length})</h2>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-1">
            {profiles.map((p) => {
              const { bmi, status, badge, color } = calculateMetrics(p.height, p.weight);

              return (
                <div key={p._id} className="bg-white rounded-xl shadow p-5 mb-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt="Profile avatar"
                        className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm">
                        {p.user?.name ? p.user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}

                    <div>
                      <h2 className="font-bold text-gray-800 text-base leading-tight">
                        {p.user?.name || "System Profiling Target"}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">{p.user?.email || "No connected email"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <p><span className="font-semibold text-gray-400">Age :</span> {p.age || "--"}</p>
                    <p><span className="font-semibold text-gray-400">Height :</span> {p.height ? `${p.height} cm` : "--"}</p>
                    <p><span className="font-semibold text-gray-400">Weight :</span> {p.weight ? `${p.weight} kg` : "--"}</p>
                    <p><span className="font-semibold text-gray-400">BMI :</span> {bmi}</p>
                    <p><span className="font-semibold text-gray-400">Water :</span> {p.waterTarget || "--"}</p>
                    <p><span className="font-semibold text-gray-400">Sleep :</span> {p.sleepTarget || "--"}</p>
                    <p className="col-span-2 border-t border-gray-50 pt-2">
                      <span className="font-semibold text-gray-400">Goal :</span> {p.goal || "Not specified"}
                    </p>
                    
                    <p className={`font-bold col-span-2 text-sm mt-1 flex items-center gap-1.5 ${color}`}>
                      <span>{badge}</span>
                      <span>Status : {status}</span>
                    </p>
                  </div>
                </div>
              );
            })}
            
            {profiles.length === 0 && (
              <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-8 text-center text-sm text-[var(--color-text-muted)] shadow-[var(--shadow-sm)]">
                No telemetry metric logs available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. Beautiful User Details Floating Overlay Popup Modal */}
      {selectedUserDetail && (() => {
        const { user, profile } = selectedUserDetail;
        const { bmi, status, badge, color } = calculateMetrics(profile.height, profile.weight);

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn"
            onClick={() => setSelectedUserDetail(null)}
          >
            <div 
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform transition-all p-6 relative space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedUserDetail(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                {profile.photo ? (
                  <img src={profile.photo} className="w-16 h-16 rounded-full object-cover border shadow-sm" alt="" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{user.name || "Anonymous User"}</h3>
                  <span className="inline-block bg-neutral-100 text-neutral-600 font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded mt-1">
                    Role: {user.role || "user"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-medium">Email Address</p>
                  <p className="text-gray-700 font-semibold truncate mt-0.5">{user.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Age</p>
                  <p className="text-gray-700 font-semibold mt-0.5">{profile.age ? `${profile.age} years` : "--"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Activity Profile</p>
                  <p className="text-gray-700 font-semibold mt-0.5">{profile.activityLevel || "--"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Height</p>
                  <p className="text-gray-700 font-semibold mt-0.5">{profile.height ? `${profile.height} cm` : "--"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Weight</p>
                  <p className="text-gray-700 font-semibold mt-0.5">{profile.weight ? `${profile.weight} kg` : "--"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Body Mass Index (BMI)</p>
                  <p className="text-gray-700 font-semibold mt-0.5">{bmi}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Health Status</p>
                  <p className={`font-bold mt-0.5 flex items-center gap-1 ${color}`}>
                    <span>{badge}</span> {status}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Water Target</p>
                  <p className="text-gray-700 font-semibold mt-0.5">{profile.waterTarget ? `${profile.waterTarget} glasses` : "--"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Sleep Target</p>
                  <p className="text-gray-700 font-semibold mt-0.5">{profile.sleepTarget ? `${profile.sleepTarget} hours` : "--"}</p>
                </div>

                <div className="col-span-2 border-t border-gray-100 pt-2.5">
                  <p className="text-xs text-gray-400 font-medium">Primary Goal</p>
                  <p className="text-gray-700 font-semibold mt-0.5 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    {profile.goal || "No structural milestone targets active."}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-medium">Registration Date</p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">
                    {user.createdAt ? new Date(user.createdAt).toUTCString() : "Prior system epoch track"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}