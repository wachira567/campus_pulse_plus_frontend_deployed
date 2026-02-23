import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import {
 BarChart3,
 FileText,
 MessageSquare,
 Settings,
 Tag,
 TrendingUp,
 Users,
 AlertTriangle,
 CheckCircle,
 Clock,
 Activity
} from "lucide-react";


export default function AdminDashboard() {
 const [stats, setStats] = useState({
   users: { total: 0, admins: 0, students: 0 },
   posts: { total: 0, pending: 0, responded: 0 },
   security: { total_reports: 0, active_reports: 0 },
   trending: { top_category: "", most_liked_post: "" },
   recent_activity: { posts_week: 0, responses_week: 0, reports_week: 0 }
 });
 const [loading, setLoading] = useState(true);


 useEffect(() => {
   fetchStats();
 }, []);


 async function fetchStats() {
   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";


     const statsRes = await fetch(`${apiUrl}/api/admin/stats`, {
       credentials: "include",
     });


     if (statsRes.ok) {
       const realStats = await statsRes.json();
       setStats(realStats);
     } else {
       console.error("Failed to fetch admin stats");
     }
   } catch (error) {
     console.error("Failed to fetch stats:", error);
   } finally {
     setLoading(false);
   }
 }


 const adminPages = [
   {
     title: "Mission Control",
     description: "Analytics, stats, and campus health overview",
     icon: BarChart3,
     path: "/admin/analytics",
     color: "from-blue-500 to-blue-700",
     stats: `${stats.posts.total} posts`
   },
   {
     title: "Post Manager",
     description: "Review and moderate student content",
     icon: FileText,
     path: "/admin/posts",
     color: "from-orange-500 to-orange-700",
     stats: `${stats.posts.pending} pending`
   },
   {
     title: "User Management",
     description: "Manage students and admin accounts",
     icon: Users,
     path: "/admin/users",
     color: "from-indigo-500 to-indigo-700",
     stats: `${stats.users.total} users`
   },
   {
     title: "Streetwise Reports",
     description: "Campus safety reports and escort requests",
     icon: AlertTriangle,
     path: "/admin/streetwise-reports",
     color: "from-red-500 to-red-700",
     stats: `${stats.security.active_reports} active`
   },
   {
     title: "Categories",
     description: "Manage campus topics and categories",
     icon: Tag,
     path: "/admin/categories",
     color: "from-purple-500 to-purple-700",
     stats: "5 categories"
   },
   {
     title: "System Settings",
     description: "Campus configuration and controls",
     icon: Settings,
     path: "/admin/settings",
     color: "from-gray-500 to-gray-700",
     stats: "Map & config"
   }
 ];


 return (
   <div className="min-h-screen bg-gray-50 pt-16">
     {/* Header */}
     <div className="bg-white border-b-4 border-black shadow-sm">
       <div className="max-w-7xl mx-auto px-4 py-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-black text-gray-900">ADMIN CONTROL CENTER</h1>
             <p className="text-gray-600 mt-1">Campus Pulse Management Hub</p>
           </div>
           <div className="flex items-center space-x-4">
             <div className="text-right">
               <p className="text-sm text-gray-500">Last updated</p>
               <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
             </div>
           </div>
         </div>
       </div>
     </div>


     {/* Quick Stats */}
   <div className="max-w-7xl mx-auto px-4 py-8">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
       <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Posts</p>
             <p className="text-3xl font-bold text-gray-900">{stats.posts.total}</p>
           </div>
           <FileText className="h-8 w-8 text-blue-600" />
         </div>
       </div>


       <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
             <p className="text-3xl font-bold text-orange-600">{stats.posts.pending}</p>
           </div>
           <Clock className="h-8 w-8 text-orange-600" />
         </div>
       </div>


       <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Active Users</p>
             <p className="text-3xl font-bold text-green-600">{stats.users.total}</p>
           </div>
           <Users className="h-8 w-8 text-green-600" />
         </div>
       </div>


       <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Security Reports</p>
             <p className="text-3xl font-bold text-red-600">{stats.security.active_reports}</p>
           </div>
           <AlertTriangle className="h-8 w-8 text-red-600" />
         </div>
       </div>
     </div>


       {/* Trending Alerts */}
       <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
         <div className="flex items-center mb-4">
           <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
           <h3 className="text-lg font-bold text-red-900">Trending Issues</h3>
         </div>
         <div className="space-y-3">
           <div className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
             <div className="flex items-center">
               <TrendingUp className="h-5 w-5 text-red-600 mr-3" />
               <div>
                 <p className="font-medium text-gray-900">Top Category: {stats.trending.top_category}</p>
                 <p className="text-sm text-gray-600">Most reported campus issue</p>
               </div>
             </div>
             <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">HOT</span>
           </div>


           <div className="flex items-center justify-between p-3 bg-white rounded border border-orange-200">
             <div className="flex items-center">
               <Activity className="h-5 w-5 text-orange-600 mr-3" />
               <div>
                 <p className="font-medium text-gray-900">Most Liked: {stats.trending.most_liked_post}</p>
                 <p className="text-sm text-gray-600">Highest engagement post</p>
               </div>
             </div>
             <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">TRENDING</span>
           </div>
         </div>
       </div>


       {/* Admin Pages Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {adminPages.map((page) => (
           <Link
             key={page.title}
             to={page.path}
             className="group bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
           >
             <div className="flex items-center justify-between mb-4">
               <div className={`p-3 rounded-lg bg-gradient-to-br ${page.color}`}>
                 <page.icon className="h-6 w-6 text-white" />
               </div>
               <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                 {page.stats}
               </span>
             </div>


             <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
               {page.title}
             </h3>


             <p className="text-gray-600 text-sm leading-relaxed">
               {page.description}
             </p>


             <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
               Access Dashboard
               <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
             </div>
           </Link>
         ))}
       </div>
     </div>


     <Footer />
   </div>
 );
}
