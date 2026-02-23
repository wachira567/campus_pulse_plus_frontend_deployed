import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import {
 MapPin,
 AlertTriangle,
 Users,
 Shield,
 Clock,
 Filter,
 Search,
 Eye,
 Calendar,
 User,
 Navigation,
 MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";


export default function StreetwiseReports() {
 const [reports, setReports] = useState({
   security_reports: [],
   escort_requests: [],
   summary: {
     total_reports: 0,
     active_reports: 0,
     total_requests: 0,
     active_requests: 0,
   },
 });
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState("");
 const [typeFilter, setTypeFilter] = useState("all");
 const [statusFilter, setStatusFilter] = useState("all");


 useEffect(() => {
   fetchReports();
 }, []);


 async function fetchReports() {
   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/admin/streetwise-reports`, {
       credentials: "include",
     });


     if (response.ok) {
       const data = await response.json();
       setReports(data);
     } else {
       toast.error("Failed to fetch streetwise reports");
     }
   } catch (error) {
     toast.error("Network error");
   } finally {
     setLoading(false);
   }
 }


 const getReportTypeIcon = (type) => {
   switch (type) {
     case "theft":
       return "💰";
     case "harassment":
       return "🚫";
     case "lights":
       return "💡";
     default:
       return "⚠️";
   }
 };


 const getReportTypeColor = (type) => {
   switch (type) {
     case "theft":
       return "bg-red-100 text-red-800 border-red-200";
     case "harassment":
       return "bg-orange-100 text-orange-800 border-orange-200";
     case "lights":
       return "bg-blue-100 text-blue-800 border-blue-200";
     default:
       return "bg-gray-100 text-gray-800 border-gray-200";
   }
 };


 const filteredSecurityReports = reports.security_reports.filter((report) => {
   const matchesSearch =
     report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.user_email.toLowerCase().includes(searchTerm.toLowerCase());
   const matchesType = typeFilter === "all" || report.type === typeFilter;
   const matchesStatus =
     statusFilter === "all" ||
     (statusFilter === "active" && report.is_active) ||
     (statusFilter === "archived" && !report.is_active);
   return matchesSearch && matchesType && matchesStatus;
 });


 const filteredEscortRequests = reports.escort_requests.filter((request) => {
   const matchesSearch =
     request.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.user_email.toLowerCase().includes(searchTerm.toLowerCase());
   const matchesStatus =
     statusFilter === "all" ||
     (statusFilter === "active" && request.is_active) ||
     (statusFilter === "expired" && !request.is_active);
   return matchesSearch && matchesStatus;
 });


 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
         <p className="text-gray-600">Loading streetwise reports...</p>
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
             <h1 className="text-3xl font-black text-gray-900">
               STREETWISE REPORTS
             </h1>
             <p className="text-gray-600 mt-1">
               Campus safety reports and escort requests
             </p>
           </div>
           <div className="text-right">
             <p className="text-2xl font-bold text-gray-900">
               {reports.summary.total_reports + reports.summary.total_requests}
             </p>
             <p className="text-sm text-gray-600">Total Reports</p>
           </div>
         </div>
       </div>
     </div>


     <div className="max-w-7xl mx-auto px-4 py-6">
       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">
                 Security Reports
               </p>
               <p className="text-3xl font-bold text-red-600">
                 {reports.summary.total_reports}
               </p>
               <p className="text-xs text-gray-500">
                 {reports.summary.active_reports} active
               </p>
             </div>
             <Shield className="h-8 w-8 text-red-600" />
           </div>
         </div>


         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">
                 Buddy Requests
               </p>
               <p className="text-3xl font-bold text-green-600">
                 {reports.summary.total_requests}
               </p>
               <p className="text-xs text-gray-500">
                 {reports.summary.active_requests} active
               </p>
             </div>
             <Users className="h-8 w-8 text-green-600" />
           </div>
         </div>


         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">
                 Active Incidents
               </p>
               <p className="text-3xl font-bold text-orange-600">
                 {reports.summary.active_reports}
               </p>
               <p className="text-xs text-gray-500">Last 6 hours</p>
             </div>
             <AlertTriangle className="h-8 w-8 text-orange-600" />
           </div>
         </div>


         <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">
                 Active Buddies
               </p>
               <p className="text-3xl font-bold text-blue-600">
                 {reports.summary.active_requests}
               </p>
               <p className="text-xs text-gray-500">Last 30 min</p>
             </div>
             <Navigation className="h-8 w-8 text-blue-600" />
           </div>
         </div>
       </div>


       {/* Filters */}
       <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
         <div className="flex flex-col md:flex-row gap-4">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input
               type="text"
               placeholder="Search reports and requests..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>


           <select
             value={typeFilter}
             onChange={(e) => setTypeFilter(e.target.value)}
             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="all">All Types</option>
             <option value="theft">Theft</option>
             <option value="harassment">Harassment</option>
             <option value="lights">Street Lights</option>
             <option value="other">Other</option>
           </select>


           <select
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="all">All Status</option>
             <option value="active">Active</option>
             <option value="archived">Archived</option>
             <option value="expired">Expired</option>
           </select>
         </div>
       </div>


       {/* Security Reports Section */}
       <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
         <div className="p-6 border-b border-gray-200">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <Shield className="h-5 w-5 text-red-600" />
               Security Reports
             </h2>
             <span className="text-sm text-gray-600">
               {filteredSecurityReports.length} reports
             </span>
           </div>
         </div>


         <div className="divide-y divide-gray-200">
           {filteredSecurityReports.length === 0 ? (
             <div className="p-12 text-center">
               <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                 No security reports found
               </h3>
               <p className="text-gray-600">
                 Try adjusting your search criteria.
               </p>
             </div>
           ) : (
             filteredSecurityReports.map((report) => (
               <div
                 key={report.id}
                 className="p-6 hover:bg-gray-50 transition-colors"
               >
                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-3">
                       <span
                         className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getReportTypeColor(report.type)}`}
                       >
                         <span className="mr-2">
                           {getReportTypeIcon(report.type)}
                         </span>
                         {report.type.charAt(0).toUpperCase() +
                           report.type.slice(1)}
                       </span>
                       <span
                         className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                           report.is_active
                             ? "bg-green-100 text-green-800"
                             : "bg-gray-100 text-gray-800"
                         }`}
                       >
                         {report.status}
                       </span>
                       <span className="text-sm text-gray-500 flex items-center gap-1">
                         <Clock className="h-3 w-3" />
                         {report.age_hours}h ago
                       </span>
                       <span className="text-sm text-gray-500 flex items-center gap-1">
                         <User className="h-3 w-3" />
                         {report.user_email}
                       </span>
                     </div>


                     <p className="text-gray-900 font-medium mb-2">
                       {report.description}
                     </p>


                     <div className="flex items-center gap-4 text-sm text-gray-600">
                       <span className="flex items-center gap-1">
                         <MapPin className="h-4 w-4" />
                         {report.latitude.toFixed(4)},{" "}
                         {report.longitude.toFixed(4)}
                       </span>
                       <span className="flex items-center gap-1">
                         <Calendar className="h-4 w-4" />
                         {new Date(report.created_at).toLocaleString()}
                       </span>
                     </div>
                   </div>


                   <div className="ml-4 flex gap-2">
                     <Link
                       to={`/streetwise`}
                       className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                     >
                       View on Map
                     </Link>
                   </div>
                 </div>
               </div>
             ))
           )}
         </div>
       </div>


       {/* Escort Requests Section */}
       <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
         <div className="p-6 border-b border-gray-200">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <Users className="h-5 w-5 text-green-600" />
               Buddy Requests
             </h2>
             <span className="text-sm text-gray-600">
               {filteredEscortRequests.length} requests
             </span>
           </div>
         </div>


         <div className="divide-y divide-gray-200">
           {filteredEscortRequests.length === 0 ? (
             <div className="p-12 text-center">
               <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                 No buddy requests found
               </h3>
               <p className="text-gray-600">
                 Try adjusting your search criteria.
               </p>
             </div>
           ) : (
             filteredEscortRequests.map((request) => (
               <div
                 key={request.id}
                 className="p-6 hover:bg-gray-50 transition-colors"
               >
                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-3">
                       <span
                         className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                           request.is_active
                             ? "bg-green-100 text-green-800"
                             : "bg-gray-100 text-gray-800"
                         }`}
                       >
                         {request.status}
                       </span>
                       <span className="text-sm text-gray-500 flex items-center gap-1">
                         <Clock className="h-3 w-3" />
                         {request.age_minutes} min ago
                       </span>
                       <span className="text-sm text-gray-500 flex items-center gap-1">
                         <User className="h-3 w-3" />
                         {request.user_email}
                       </span>
                     </div>


                     <div className="mb-3">
                       <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                         <MessageSquare className="h-4 w-4 text-green-600" />
                         Request Message:
                       </h4>
                       <p className="text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                         {request.message}
                       </p>
                     </div>


                     <div className="flex items-center gap-4 text-sm text-gray-600">
                       <span className="flex items-center gap-1">
                         <MapPin className="h-4 w-4" />
                         {request.latitude.toFixed(4)},{" "}
                         {request.longitude.toFixed(4)}
                       </span>
                       <span className="flex items-center gap-1">
                         <Calendar className="h-4 w-4" />
                         {new Date(request.created_at).toLocaleString()}
                       </span>
                     </div>
                   </div>


                   <div className="ml-4 flex gap-2">
                     <Link
                       to={`/streetwise`}
                       className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                     >
                       View on Map
                     </Link>
                   </div>
                 </div>
               </div>
             ))
           )}
         </div>
       </div>
     </div>


     <Footer />
   </div>
 );
}
