import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import {
 Settings,
 MapPin,
 Save,
 RefreshCw,
 AlertTriangle,
 CheckCircle,
 Globe,
 Users,
 Shield,
 Database
} from "lucide-react";
import toast from "react-hot-toast";


export default function SystemSettings() {
 const [universitySettings, setUniversitySettings] = useState({
   name: "",
   latitude: 0,
   longitude: 0,
   zoom_level: 15
 });
 const [systemStats, setSystemStats] = useState({
   users: { total: 0, admins: 0, students: 0 },
   posts: { total: 0, pending: 0, responded: 0 },
   security: { total_reports: 0, active_reports: 0 },
   escort: { total_requests: 0, active_requests: 0 }
 });
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);


 useEffect(() => {
   fetchSettings();
   fetchSystemStats();
 }, []);


 async function fetchSettings() {
   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/admin/university-settings`, {
       credentials: "include",
     });


     if (response.ok) {
       const settings = await response.json();
       setUniversitySettings(settings);
     } else {
       toast.error("Failed to fetch university settings");
     }
   } catch (error) {
     toast.error("Network error");
   } finally {
     setLoading(false);
   }
 }


 async function fetchSystemStats() {
   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const statsRes = await fetch(`${apiUrl}/api/admin/stats`, {
       credentials: "include",
     });


     if (statsRes.ok) {
       const realStats = await statsRes.json();
       setSystemStats(realStats);
     } else {
       console.error("Failed to fetch system stats");
     }
   } catch (error) {
     console.error("Failed to fetch system stats:", error);
   }
 }


 async function handleSaveSettings() {
   setSaving(true);
   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/admin/university-settings`, {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       credentials: "include",
       body: JSON.stringify(universitySettings),
     });


     if (response.ok) {
       toast.success("University settings updated successfully!");
     } else {
       const errorData = await response.json();
       toast.error(errorData.error || "Failed to update settings");
     }
   } catch (error) {
     toast.error("Network error");
   } finally {
     setSaving(false);
   }
 }


 async function handleResetToDefaults() {
   if (!confirm("Are you sure you want to reset all settings to defaults?")) {
     return;
   }


   setUniversitySettings({
     name: "Campus University",
     latitude: -1.2921,
     longitude: 36.8219,
     zoom_level: 15
   });
   toast.success("Settings reset to defaults");
 }


 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
         <p className="text-gray-600">Loading system settings...</p>
       </div>
     </div>
   );
 }


 return (
   <div className="min-h-screen bg-gray-50 pt-16">
     {/* Header */}
     <div className="bg-white border-b-4 border-black shadow-sm">
       <div className="max-w-7xl mx-auto px-4 py-6">
         <div className="flex items-center justify-between">
           <div>
             <Link
               to="/admin/dashboard"
               className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors mb-4"
             >
               ← Back to Dashboard
             </Link>
             <h1 className="text-3xl font-black text-gray-900">SYSTEM SETTINGS</h1>
             <p className="text-gray-600 mt-1">Campus configuration and controls</p>
           </div>
           <div className="text-right">
             <p className="text-sm text-gray-600">System Status</p>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
               <span className="text-sm font-medium text-green-700">Online</span>
             </div>
           </div>
         </div>
       </div>
     </div>


     <div className="max-w-7xl mx-auto px-4 py-6">
       {/* System Overview */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">Total Users</p>
               <p className="text-3xl font-bold text-gray-900">{systemStats.users.total}</p>
               <p className="text-xs text-gray-500">{systemStats.users.students} students, {systemStats.users.admins} admins</p>
             </div>
             <Users className="h-8 w-8 text-blue-600" />
           </div>
         </div>


         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">Total Posts</p>
               <p className="text-3xl font-bold text-gray-900">{systemStats.posts.total}</p>
               <p className="text-xs text-gray-500">{systemStats.posts.pending} pending, {systemStats.posts.responded} responded</p>
             </div>
             <Database className="h-8 w-8 text-green-600" />
           </div>
         </div>


         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">Security Reports</p>
               <p className="text-3xl font-bold text-orange-600">{systemStats.security.active_reports}</p>
               <p className="text-xs text-gray-500">{systemStats.security.total_reports} total reports</p>
             </div>
             <Shield className="h-8 w-8 text-orange-600" />
           </div>
         </div>


         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">Escort Requests</p>
               <p className="text-3xl font-bold text-purple-600">{systemStats.escort.active_requests}</p>
               <p className="text-xs text-gray-500">{systemStats.escort.total_requests} total requests</p>
             </div>
             <Globe className="h-8 w-8 text-purple-600" />
           </div>
         </div>
       </div>


       {/* University Settings */}
       <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
         <div className="p-6 border-b border-gray-200">
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <MapPin className="h-5 w-5 text-blue-600" />
             Campus Geofencing & Map Settings
           </h2>
           <p className="text-gray-600 mt-1">Configure the university location and map display settings</p>
         </div>


         <div className="p-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 University Name
               </label>
               <input
                 type="text"
                 value={universitySettings.name}
                 onChange={(e) => setUniversitySettings({...universitySettings, name: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter university name"
               />
             </div>


             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Default Zoom Level
               </label>
               <input
                 type="number"
                 min="1"
                 max="20"
                 value={universitySettings.zoom_level}
                 onChange={(e) => setUniversitySettings({...universitySettings, zoom_level: parseInt(e.target.value)})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>


             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Latitude
               </label>
               <input
                 type="number"
                 step="0.000001"
                 value={universitySettings.latitude}
                 onChange={(e) => setUniversitySettings({...universitySettings, latitude: parseFloat(e.target.value)})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="e.g., -1.2921"
               />
             </div>


             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Longitude
               </label>
               <input
                 type="number"
                 step="0.000001"
                 value={universitySettings.longitude}
                 onChange={(e) => setUniversitySettings({...universitySettings, longitude: parseFloat(e.target.value)})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="e.g., 36.8219"
               />
             </div>
           </div>


           <div className="mt-6 flex gap-3">
             <button
               onClick={handleSaveSettings}
               disabled={saving}
               className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
             >
               {saving ? (
                 <>
                   <RefreshCw className="h-4 w-4 animate-spin" />
                   Saving...
                 </>
               ) : (
                 <>
                   <Save className="h-4 w-4" />
                   Save Settings
                 </>
               )}
             </button>


             <button
               onClick={handleResetToDefaults}
               className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
             >
               Reset to Defaults
             </button>
           </div>
         </div>
       </div>


       {/* System Information */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* System Health */}
         <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="p-6 border-b border-gray-200">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <CheckCircle className="h-5 w-5 text-green-600" />
               System Health
             </h3>
           </div>
           <div className="p-6 space-y-4">
             <div className="flex items-center justify-between">
               <span className="text-gray-700">Database Connection</span>
               <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Healthy</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-700">API Endpoints</span>
               <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Operational</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-700">File Uploads</span>
               <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Working</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-700">Security Reports</span>
               <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
             </div>
           </div>
         </div>


         {/* Recent Activity */}
         <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="p-6 border-b border-gray-200">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <AlertTriangle className="h-5 w-5 text-orange-600" />
               Recent System Activity
             </h3>
           </div>
           <div className="p-6 space-y-3">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
               <span className="text-sm text-gray-700">New user registration</span>
               <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
               <span className="text-sm text-gray-700">Security report submitted</span>
               <span className="text-xs text-gray-500 ml-auto">5 min ago</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
               <span className="text-sm text-gray-700">Admin response posted</span>
               <span className="text-xs text-gray-500 ml-auto">12 min ago</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
               <span className="text-sm text-gray-700">Category updated</span>
               <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
             </div>
           </div>
         </div>
       </div>


       {/* Danger Zone */}
       <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mt-8">
         <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
           <AlertTriangle className="h-5 w-5" />
           Danger Zone
         </h3>
         <p className="text-red-700 mb-4">
           These actions are irreversible and may cause data loss. Proceed with caution.
         </p>
         <div className="flex gap-3">
           <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
             Clear All Posts
           </button>
           <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
             Reset Database
           </button>
           <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
             Export Data
           </button>
         </div>
       </div>
     </div>


     <Footer />
   </div>
 );
}

