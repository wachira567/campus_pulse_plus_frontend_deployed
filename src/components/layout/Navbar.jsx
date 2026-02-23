import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChevronDown, User, Activity, LogOut } from "lucide-react";


export default function Navbar() {
 const { user, setUser } = useContext(AuthContext);
 const location = useLocation();
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const dropdownRef = useRef(null);


 // Close dropdown when clicking outside
 useEffect(() => {
   const handleClickOutside = (event) => {
     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
       setDropdownOpen(false);
     }
   };


   document.addEventListener("mousedown", handleClickOutside);
   return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);


 const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
   await fetch(`${apiUrl}/auth/logout`, {
     method: "POST",
     credentials: "include",
   });
   setUser(null);
   setDropdownOpen(false);
 };


 const isActive = (path) => location.pathname === path;


 return (
   <nav className="bg-white border-b-4 border-black fixed top-0 left-0 right-0 z-50">
     <div className="max-w-7xl mx-auto px-4">
       <div className="flex justify-between items-center h-16">
         {/* Left Zone: Brand */}
         <div className="flex-shrink-0">
           <Link
             to="/home"
             className="font-inter font-black text-xl tracking-wider uppercase hover:opacity-80 transition-opacity"
           >
             CAMPUSPULSE+
           </Link>
         </div>


         {/* Center Zone: Core Navigation */}
         {user?.role === "student" && (
                <div className="hidden md:flex items-center space-x-8">
             <Link
               to="/home"
               className={`px-3 py-2 text-sm font-medium transition-colors ${
                 isActive("/home")
                   ? "underline decoration-4 underline-offset-8"
                   : "hover:text-gray-600"
               }`}
             >
               Home
             </Link>
             <Link
               to="/posts"
               className={`px-3 py-2 text-sm font-medium transition-colors ${
                 isActive("/posts")
                   ? "underline decoration-4 underline-offset-8"
                   : "hover:text-gray-600"
               }`}
             >
               Posts
             </Link>
             <Link
               to="/streetwise"
               className={`px-3 py-2 text-sm font-medium transition-colors ${
                 isActive("/streetwise")
                      ? "underline decoration-4 underline-offset-8"
                   : "hover:text-gray-600"
               }`}
             >
               Streetwise
             </Link>
           </div>
         )}


         {user?.role === "admin" && (
           <div className="hidden md:flex items-center space-x-6">
             <Link
               to="/admin/dashboard"
               className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                 isActive("/admin/dashboard")
                   ? "underline decoration-4 underline-offset-8 text-black"
                   : "hover:text-gray-600"
               }`}
             >
               DASHBOARD
             </Link>
             <Link
               to="/admin/posts"
               className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                 isActive("/admin/posts")
                   ? "underline decoration-4 underline-offset-8 text-black"
                    : "hover:text-gray-600"
               }`}
             >
               POSTS
             </Link>
             <Link
               to="/admin/categories"
               className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                 isActive("/admin/categories")
                   ? "underline decoration-4 underline-offset-8 text-black"
                   : "hover:text-gray-600"
               }`}
             >
               CATEGORIES
             </Link>
             <Link
               to="/admin/users"
               className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                 isActive("/admin/users")
                   ? "underline decoration-4 underline-offset-8 text-black"
                   : "hover:text-gray-600"
               }`}
             >
               USERS
             </Link>
             <Link
               to="/admin/streetwise-reports"
 className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                 isActive("/admin/streetwise-reports")
                   ? "underline decoration-4 underline-offset-8 text-black"
                   : "hover:text-gray-600"
               }`}
             >
               STREETWISE
             </Link>
             <Link
               to="/admin/settings"
               className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                 isActive("/admin/settings")
                   ? "underline decoration-4 underline-offset-8 text-black"
                   : "hover:text-gray-600"
               }`}
             >
               SETTINGS
             </Link>
           </div>
         )}


         {/* Right Zone: Create Button + User Dropdown */}
         <div className="flex items-center space-x-4">
           {user?.role === "student" && (
             <Link
               to="/create"
                className="bg-orange-500 text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold text-sm uppercase tracking-wide"
             >
               + NEW POST
             </Link>
           )}


           {user && (
             <div className="relative" ref={dropdownRef}>
               <button
                 onClick={() => setDropdownOpen(!dropdownOpen)}
                 className="flex items-center space-x-2 px-3 py-2 border-2 border-black bg-white hover:bg-gray-50 transition-colors"
               >
                 <span className="font-medium text-sm">
                   {user.email.split("@")[0]}
                 </span>
                 <ChevronDown
                   className={`w-4 h-4 transition-transform ${
                     dropdownOpen ? "rotate-180" : ""
                   }`}
                 />
               </button>


               {dropdownOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                   <div className="py-1">
                     <Link
                       to="/profile"
                       className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                       onClick={() => setDropdownOpen(false)}
                     >
                       <User className="w-4 h-4" />
                       <span>Edit Profile</span>
                     </Link>
                     <Link
                       to="/activity"
                       className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                       onClick={() => setDropdownOpen(false)}
                     >
                       <Activity className="w-4 h-4" />
                       <span>My Activity</span>
                     </Link>
                     <hr className="border-gray-200 my-1" />
                     <button
                       onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                     >
                       <LogOut className="w-4 h-4" />
                       <span>Logout</span>
                     </button>
                   </div>
                 </div>
               )}
             </div>
           )}
         </div>
       </div>
     </div>


     {/* Mobile Navigation */}
     {user?.role === "student" && (
       <div className="md:hidden border-t-2 border-black bg-gray-50">
         <div className="flex justify-around py-2">
           <Link
             to="/home"
             className={`px-3 py-2 text-xs font-medium ${
               isActive("/home") ? "text-black font-bold" : "text-gray-600"
             }`}
           >
             Home
           </Link>
           <Link
             to="/posts"
             lassName={`px-3 py-2 text-xs font-medium ${
               isActive("/posts") ? "text-black font-bold" : "text-gray-600"
             }`}
           >
             Posts
           </Link>
           <Link
             to="/streetwise"
             className={`px-3 py-2 text-xs font-medium ${
               isActive("/streetwise")
                 ? "text-black font-bold"
                 : "text-gray-600"
             }`}
           >
             Streetwise
           </Link>
           <Link
             to="/create"
             className="px-3 py-2 text-xs font-medium text-orange-600 font-bold"
           >
             + Post
           </Link>
         </div>
       </div>
     )}
   </nav>
 );
}


