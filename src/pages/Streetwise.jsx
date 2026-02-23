import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
 MapPin,
 AlertTriangle,
 Users,
 Shield,
 Clock,
 Navigation,
 Send,
 X,
 Maximize2,
 Minimize2,
 LogIn,
 ChevronDown,
 ChevronUp,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";


// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;


const Streetwise = () => {
 const { user } = React.useContext(AuthContext);
 const navigate = useNavigate();
 const mapContainer = useRef(null);
 const map = useRef(null);
 const [lng, setLng] = useState(36.8219); // Default Nairobi coordinates
 const [lat, setLat] = useState(-1.2921);
 const [zoom, setZoom] = useState(15);
 const [universityName, setUniversityName] = useState("Campus University");
 const [showReportModal, setShowReportModal] = useState(false);
 const [showBuddyUpModal, setShowBuddyUpModal] = useState(false);
 const [reportLocation, setReportLocation] = useState(null);
 const [buddyUpLocation, setBuddyUpLocation] = useState(null);
 const [reportType, setReportType] = useState("");
 const [reportDescription, setReportDescription] = useState("");
 const [buddyUpMessage, setBuddyUpMessage] = useState("");
 const [isMaximized, setIsMaximized] = useState(false);
 const [mapError, setMapError] = useState(false);
 const [pinMode, setPinMode] = useState(false); // When true, user can drop pins
 const [droppedMarkers, setDroppedMarkers] = useState([]); // Array of Mapbox markers
 const droppedMarkersRef = useRef([]); // Ref to track current markers


 // Live-sync dashboard state
 const [activeReports, setActiveReports] = useState([]);
 const [chatModalOpen, setChatModalOpen] = useState(false);
 const [selectedReport, setSelectedReport] = useState(null);
 const [chatMessages, setChatMessages] = useState([]);
 const [newMessage, setNewMessage] = useState("");
 const [showInstructions, setShowInstructions] = useState(false);
 const [lastRefresh, setLastRefresh] = useState(new Date());
 const [isRefreshing, setIsRefreshing] = useState(false);


 // Keep ref in sync with state
 useEffect(() => {
   droppedMarkersRef.current = droppedMarkers;
 }, [droppedMarkers]);
 const [pinType, setPinType] = useState("location"); // "location" or "road"


 // Update cursor when pin mode changes
 useEffect(() => {
   if (map.current) {
     const canvas = map.current.getCanvas();
     if (pinMode) {
       canvas.style.cursor = "crosshair";
     } else {
       canvas.style.cursor = "";
     }
   }
 }, [pinMode]);


 // Load security pins from API
 const loadSecurityData = async () => {
   if (!map.current) return;


   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/security-reports`, {
       credentials: "include",
     });
     const reports = await response.json();


     const securityPins = reports.map((report) => ({
       type: "Feature",
       properties: {
         intensity: report.intensity,
         decay_weight: report.decay_weight,
         type: report.type,
       },
       geometry: {
         type: "Point",
         coordinates: [report.longitude, report.latitude],
       },
     }));


     if (map.current.getSource("security-pins")) {
       map.current.getSource("security-pins").setData({
         type: "FeatureCollection",
         features: securityPins,
       });
     }
   } catch (error) {
     console.error("Failed to load security data:", error);
   }
 };


 // Load escort requests
 const loadEscortData = async () => {
   if (!map.current) return;


   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/escort-requests`, {
       credentials: "include",
     });
     const requests = await response.json();


     const escortFeatures = requests.map((request) => ({
       type: "Feature",
       properties: {
         message: request.message,
         created_at: request.created_at,
       },
       geometry: {
         type: "Point",
         coordinates: [request.longitude, request.latitude],
       },
     }));


     if (map.current.getSource("escort-requests")) {
       map.current.getSource("escort-requests").setData({
         type: "FeatureCollection",
         features: escortFeatures,
       });
     }
   } catch (error) {
     console.error("Failed to load escort data:", error);
   }
 };


 // Load active reports for feed
 const loadActiveReports = async () => {
   try {
     setIsRefreshing(true);
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/security-reports`, {
       credentials: "include",
     });
     const reports = await response.json();
     setActiveReports(reports);
     setLastRefresh(new Date());
   } catch (error) {
     console.error("Failed to load active reports:", error);
   } finally {
     setIsRefreshing(false);
   }
 };


 // Update click handler when pinMode changes
 useEffect(() => {
   if (map.current) {
     // Remove existing click handler
     map.current.off("click");


     // Add new click handler with current pinMode
     map.current.on("click", (e) => {
       console.log("Map clicked event fired, pinMode:", pinMode, "event:", e);
       if (!pinMode) {
         console.log("Pin mode not active, ignoring click");
         return;
       }


       console.log("Processing pin drop from map click...");
       const { lng, lat } = e.lngLat;
       console.log("Dropping pin at coordinates:", { lng, lat });


       if (pinType === "location") {
         console.log("Dropping location pin");
         // Create marker
         const marker = createCustomMarker(lng, lat, "location");
         setDroppedMarkers([marker]);
         setReportLocation({ lng, lat });
         setShowReportModal(true);
         setPinMode(false);
         toast.success("Location pinned! Fill in the report details.");
       } else if (pinType === "road") {
         if (droppedMarkers.length === 0) {
           console.log("Dropping start pin");
           // Create start marker
           const startMarker = createCustomMarker(lng, lat, "road", 0);
           setDroppedMarkers([startMarker]);
           toast.success("Start point set. Click to set end point.");
         } else if (droppedMarkers.length === 1) {
           console.log("Dropping end pin");
           // Create end marker
           const endMarker = createCustomMarker(lng, lat, "road", 1);
           const newMarkers = [...droppedMarkers, endMarker];
           setDroppedMarkers(newMarkers);
           setReportLocation({
             start: droppedMarkers[0].getLngLat(),
             end: { lng, lat },
           });
           setShowReportModal(true);
           setPinMode(false);
           toast.success("Road segment pinned! Fill in the report details.");
         }
       }
     });
   }
 }, [pinMode, pinType, droppedMarkers]);


 useEffect(() => {
   // Fetch university settings
   const fetchUniversitySettings = async () => {
     try {
       const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
       const response = await fetch(`${apiUrl}/api/university-settings`);
       const settings = await response.json();
       setLng(settings.longitude);
       setLat(settings.latitude);
       setZoom(settings.zoom_level);
       setUniversityName(settings.name);
     } catch (error) {
       console.error("Failed to fetch university settings:", error);
       // Keep defaults
     }
   };


   fetchUniversitySettings();
 }, []);


 // Load active reports for feed
 useEffect(() => {
   loadActiveReports();
   // Refresh every 10 seconds for rapid updates
   const interval = setInterval(loadActiveReports, 10 * 1000);
   return () => clearInterval(interval);
 }, []);


 // Poll chat messages when modal is open
 useEffect(() => {
   if (!chatModalOpen || !selectedReport) return;


   const pollMessages = async () => {
     try {
       const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
       const response = await fetch(
         `${apiUrl}/api/security-reports/${selectedReport.id}/messages`,
         {
           credentials: "include",
         },
       );
       const messages = await response.json();
       setChatMessages(messages);
     } catch (error) {
       console.error("Failed to poll chat messages:", error);
     }
   };


   // Poll immediately and then every 5 seconds
   pollMessages();
   const interval = setInterval(pollMessages, 5000);
   return () => clearInterval(interval);
 }, [chatModalOpen, selectedReport]);


 useEffect(() => {
   if (map.current) return; // initialize map only once


   // Small delay to ensure DOM is ready
   const timer = setTimeout(() => {
     if (!mapContainer.current) return;


     try {
       map.current = new mapboxgl.Map({
         container: mapContainer.current,
         style: "mapbox://styles/mapbox/streets-v11",
         center: [lng, lat],
         zoom: zoom,
         pitch: 0,
         bearing: 0,
         // Performance optimizations
         maxZoom: 18,
         minZoom: 10,
         maxPitch: 0, // Disable 3D tilting for better performance
         preserveDrawingBuffer: false,
         // Smooth interactions
         interactive: true,
         doubleClickZoom: true,
         dragRotate: false, // Disable rotation for simplicity
         pitchWithRotate: false,
         touchZoomRotate: true,
         cooperativeGestures: true, // Better touch handling
         // Attribution
         attributionControl: false,
       });


       // Add optimized controls
       map.current.addControl(
         new mapboxgl.NavigationControl({
           showCompass: false,
           showZoom: true,
           visualizePitch: false,
         }),
         "top-right",
       );


       map.current.addControl(
         new mapboxgl.ScaleControl({
           maxWidth: 100,
           unit: "metric",
         }),
         "bottom-left",
       );


       // Add fullscreen control
       map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");


       // Map is ready for marker placement
       console.log("Map ready for pin dropping");


       // Improve performance with better rendering settings
       map.current.on("load", () => {
         // Optimize rendering for better performance
         map.current.setMaxZoom(18);
         map.current.setMinZoom(10);


         console.log("Map fully loaded and optimized");
       });


       // Update cursor based on pin mode
       map.current.on("mouseenter", () => {
         if (pinMode) {
           map.current.getCanvas().style.cursor = "crosshair";
         } else {
           map.current.getCanvas().style.cursor = "";
         }
       });


       map.current.on("mouseleave", () => {
         map.current.getCanvas().style.cursor = "";
       });


       console.log("Map initialized successfully");
       setMapError(false);
     } catch (error) {
       console.error("Failed to initialize map:", error);
       setMapError(true);
       return;
     }
   }, 100);


   return () => clearTimeout(timer);


 }, []);


 const handleReportSubmit = async () => {
   if (!reportType || !reportDescription) {
     toast.error("Please fill in all fields");
     return;
   }


   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";


     // Verify user is still logged in
     const authResponse = await fetch(`${apiUrl}/auth/current_user`, {
       credentials: "include",
     });


     if (!authResponse.ok) {
       toast.error("Please login again");
       setUser(null);
       return;
     }


     const currentUser = await authResponse.json();
     if (!currentUser) {
       toast.error("Please login again");
       setUser(null);
       return;
     }


     const response = await fetch(`${apiUrl}/api/security-reports`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       credentials: "include",
       body: JSON.stringify({
         type: reportType,
         description: reportDescription,
         latitude: reportLocation.lat,
         longitude: reportLocation.lng,
       }),
     });


     if (response.ok) {
       toast.success("Security report submitted!");
       setShowReportModal(false);
       setReportType("");
       setReportDescription("");
       // Clear temporary pins and refresh map data
       clearPins();
       loadSecurityData();
     } else if (response.status === 403) {
       toast.error("Only students can submit security reports");
     } else {
       toast.error("Failed to submit report");
     }
   } catch (error) {
     toast.error("Network error");
   }
 };


 const handleBuddyUpRequest = async () => {
   if (!buddyUpMessage) {
     toast.error("Please enter a message");
     return;
   }


   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/escort-requests`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       credentials: "include",
       body: JSON.stringify({
         message: buddyUpMessage,
         latitude: buddyUpLocation.lat,
         longitude: buddyUpLocation.lng,
       }),
     });


     if (response.ok) {
       toast.success("Buddy up request sent!");
       setShowBuddyUpModal(false);
       setBuddyUpMessage("");
       // Add pulse animation to map
       addPulseAnimation(buddyUpLocation);
     } else {
       toast.error("Failed to send request");
     }
   } catch (error) {
     toast.error("Network error");
   }
 };


 const addPulseAnimation = (location) => {
   if (!map.current) return;


   // Add a pulsing marker
   const marker = new mapboxgl.Marker({
     color: "#00ff00",
   })
     .setLngLat([location.lng, location.lat])
     .addTo(map.current);


   // Remove after 30 seconds
   setTimeout(() => {
     marker.remove();
   }, 30000);
 };


 const createCustomMarker = (lng, lat, type, index = 0) => {
   // Create custom HTML element for brutalist pin
   const el = document.createElement("div");
   el.className = "brutalist-pin";
   el.style.width = "30px";
   el.style.height = "30px";
   el.style.backgroundColor =
     type === "road" && index === 0 ? "#ff6b35" : "#ff4444";
   el.style.border = "4px solid #000000";
   el.style.borderRadius = "50%";
   el.style.display = "flex";
   el.style.alignItems = "center";
   el.style.justifyContent = "center";
   el.style.fontSize = "16px";
   el.style.fontWeight = "bold";
   el.style.color = "#ffffff";
   el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
   el.style.cursor = "pointer";


   // Add text based on type
   if (type === "road") {
     el.innerText = index === 0 ? "S" : "E"; // Start/End
   } else {
     el.innerText = "!";
   }


   // Add pulse animation
   el.style.animation = "pinPulse 2s infinite";


   // Create marker
   const marker = new mapboxgl.Marker(el)
     .setLngLat([lng, lat])
     .addTo(map.current);


   return marker;
 };


 const clearPins = () => {
   // Remove all markers from map
   droppedMarkers.forEach((marker) => marker.remove());
   setDroppedMarkers([]);


   // Clear road segments line
   if (map.current && map.current.getSource("road-segments")) {
     map.current.getSource("road-segments").setData({
       type: "FeatureCollection",
       features: [],
     });
   }
 };


 const requestBuddyUp = () => {
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(
       (position) => {
         const { latitude, longitude } = position.coords;
         setBuddyUpLocation({ lat: latitude, lng: longitude });
         setShowBuddyUpModal(true);
       },
       (error) => {
         toast.error("Unable to get your location");
       },
     );
   } else {
     toast.error("Geolocation is not supported");
   }
 };


 const buddyUpToReport = async (report) => {
   // Center map on report location
   if (map.current) {
     map.current.flyTo({
       center: [report.longitude, report.latitude],
       zoom: 18,
       duration: 2000,
     });
   }


   // Open chat for this report
   setSelectedReport(report);
   setChatModalOpen(true);


   // Load chat messages
   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(
       `${apiUrl}/api/security-reports/${report.id}/messages`,
       {
         credentials: "include",
       },
     );
     const messages = await response.json();
     setChatMessages(messages);
   } catch (error) {
     console.error("Failed to load chat messages:", error);
   }
 };


 const sendChatMessage = async () => {
   if (!newMessage.trim()) return;


   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(
       `${apiUrl}/api/security-reports/${selectedReport.id}/messages`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify({ message: newMessage }),
       },
     );


     if (response.ok) {
       setNewMessage("");
       // Reload messages
       const messagesResponse = await fetch(
         `${apiUrl}/api/security-reports/${selectedReport.id}/messages`,
         {
           credentials: "include",
         },
       );
       const messages = await messagesResponse.json();
       setChatMessages(messages);
     } else {
       toast.error("Failed to send message");
     }
   } catch (error) {
     toast.error("Network error");
   }
 };


 // If user is not logged in or not a student, show appropriate message
 if (!user) {
   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
       <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center"
       >
         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <Shield size={32} className="text-blue-600" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 mb-4">
           Login Required
         </h2>
         <p className="text-gray-600 mb-6">
           You need to be logged in to access Streetwise security features and
           report incidents.
         </p>
         <button
           onClick={() => navigate("/")}
           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
         >
           <LogIn size={18} />
           Go to Login
         </button>
       </motion.div>
     </div>
   );
 }


 if (user.role !== "student") {
   return (
     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
       <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center"
       >
         <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <AlertTriangle size={32} className="text-orange-600" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 mb-4">
           Access Restricted
         </h2>
         <p className="text-gray-600 mb-6">
           Streetwise security reporting is available only for students. Admins
           can view reports through the dashboard.
         </p>
         <button
           onClick={() =>
             navigate(user.role === "admin" ? "/admin/dashboard" : "/")
           }
           className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
         >
           {user.role === "admin" ? "Go to Dashboard" : "Go to Home"}
         </button>
       </motion.div>
     </div>
   );
 }


 return (
   <div className="min-h-screen bg-white text-gray-900 pt-20">
     {/* Header */}
     <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
       <div className="max-w-7xl mx-auto flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold text-blue-600">Streetwise</h1>
           <p className="text-gray-600 text-sm">
             {universityName} Security Heatmap
           </p>
           <div className="flex items-center gap-2 mt-1">
             {isRefreshing ? (
               <div className="flex items-center gap-1 text-xs text-blue-600">
                 <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                 Refreshing...
               </div>
             ) : (
               <div className="text-xs text-gray-500">
                 Last updated: {lastRefresh.toLocaleTimeString()}
               </div>
             )}
           </div>
         </div>
         <div className="flex gap-4">
           <button
             onClick={() => setIsMaximized(!isMaximized)}
             className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-300"
           >
             {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
             {isMaximized ? "Minimize" : "Maximize"} Map
           </button>
           <div className="flex gap-2">
             <select
               value={pinType}
               onChange={(e) => setPinType(e.target.value)}
               className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
               disabled={pinMode}
             >
               <option value="location">📍 Location</option>
               <option value="road">🛣️ Road Segment</option>
             </select>
             <button
               onClick={() => {
                 if (pinMode) {
                   setPinMode(false);
                   clearPins();
                 } else {
                   setPinMode(true);
                   clearPins(); // Clear any existing pins when starting
                 }
               }}
               className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                 pinMode
                   ? "bg-red-600 hover:bg-red-700 text-white"
                   : "bg-orange-600 hover:bg-orange-700 text-white"
               }`}
             >
               <MapPin size={18} />
               {pinMode ? "CANCEL PIN" : "PIN_INCIDENT"}
             </button>
           </div>
           {pinMode && (
             <div className="flex items-center gap-4">
               <div className="text-sm text-orange-600 font-medium">
                 {pinType === "location"
                   ? "Click on the map to pin a location"
                   : droppedMarkers.length === 0
                     ? "Click to set START point"
                     : "Click to set END point"}
               </div>
               <button
                 onClick={() => {
                   console.log(
                     "Test pin drop - pinMode:",
                     pinMode,
                     "pinType:",
                     pinType,
                   );
                   // Simulate a pin drop at map center
                   if (map.current && pinMode) {
                     const center = map.current.getCenter();
                     console.log("Map center:", center);


                     if (pinType === "location") {
                       console.log("Dropping test location pin");
                       const marker = createCustomMarker(
                         center.lng,
                         center.lat,
                         "location",
                       );
                       setDroppedMarkers([marker]);
                       setReportLocation({ lng: center.lng, lat: center.lat });
                       setShowReportModal(true);
                       setPinMode(false);
                       toast.success(
                         "Test location pinned! Fill in the report details.",
                       );
                     } else if (pinType === "road") {
                       if (droppedMarkersRef.current.length === 0) {
                         console.log("Dropping test start pin");
                         const startMarker = createCustomMarker(
                           center.lng,
                           center.lat,
                           "road",
                           0,
                         );
                         setDroppedMarkers([startMarker]);
                         toast.success(
                           "Test start point set. Click to set end point.",
                         );
                       } else if (droppedMarkersRef.current.length === 1) {
                         console.log("Dropping test end pin");
                         const endMarker = createCustomMarker(
                           center.lng,
                           center.lat,
                           "road",
                           1,
                         );
                         const newMarkers = [
                           ...droppedMarkersRef.current,
                           endMarker,
                         ];
                         setDroppedMarkers(newMarkers);


                         // Create line between start and end points
                         const startCoords =
                           droppedMarkersRef.current[0].getLngLat();
                         const lineFeature = {
                           type: "Feature",
                           properties: {},
                           geometry: {
                             type: "LineString",
                             coordinates: [
                               [startCoords.lng, startCoords.lat],
                               [center.lng, center.lat],
                             ],
                           },
                         };


                         // Update the road segments source
                         if (
                           map.current &&
                           map.current.getSource("road-segments")
                         ) {
                           map.current.getSource("road-segments").setData({
                             type: "FeatureCollection",
                             features: [lineFeature],
                           });
                         }


                         setReportLocation({
                           start: startCoords,
                           end: center,
                         });
                         setShowReportModal(true);
                         setPinMode(false);
                         toast.success(
                           "Test road segment pinned! Fill in the report details.",
                         );
                       }
                     }
                   } else {
                     toast.error(
                       "Please enable pin mode first by clicking PIN_INCIDENT",
                     );
                   }
                 }}
                 className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
               >
                 Test Pin Drop
               </button>
             </div>
           )}
         </div>
       </div>
     </div>


     {/* Map Container */}
     <div
       className={`relative mx-4 mt-4 mb-8 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
         isMaximized ? "h-[calc(100vh-180px)]" : "h-[600px]"
       } ${pinMode ? "ring-4 ring-orange-400 ring-opacity-50" : ""}`}
     >
       {pinMode && (
         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
           🎯 Pin Mode Active - Click on the map to drop a pin
         </div>
       )}
       {mapError ? (
         <div className="w-full h-full bg-gray-100 flex items-center justify-center">
           <div className="text-center p-8">
             <div className="text-6xl mb-4">🗺️</div>
             <h3 className="text-xl font-semibold text-gray-700 mb-2">
               Map Unavailable
             </h3>
             <p className="text-gray-500 mb-4">
               Unable to load the interactive map. Please check your internet
               connection or try refreshing the page.
             </p>
             <button
               onClick={() => window.location.reload()}
               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
             >
               Refresh Page
             </button>
           </div>
         </div>
       ) : (
         <div
           ref={mapContainer}
           className="w-full h-full"
           style={{ minHeight: isMaximized ? "calc(100vh - 180px)" : "600px" }}
         />
       )}


       {/* Legend */}
       <div className="absolute top-4 left-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg border border-gray-200">
         <h3 className="font-semibold mb-2 text-gray-900">Security Heatmap</h3>
         <div className="space-y-2 text-sm">
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-red-500 rounded"></div>
             <span className="text-gray-700">High Risk (Recent)</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-yellow-500 rounded"></div>
             <span className="text-gray-700">Medium Risk</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-blue-500 rounded"></div>
             <span className="text-gray-700">Low Risk (Old)</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
             <span className="text-gray-700">Buddy Up Requests</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-1 bg-red-500"></div>
             <span className="text-gray-700">Reported Road Segments</span>
           </div>
         </div>
         <p className="text-xs text-gray-500 mt-2">
           Right-click or tap to report incidents
         </p>
       </div>


       {/* Instructions Dropdown */}
       <div className="absolute bottom-4 left-4 z-10">
         <button
           onClick={() => setShowInstructions(!showInstructions)}
           className="bg-white bg-opacity-95 hover:bg-opacity-100 px-4 py-2 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 text-sm font-medium text-gray-900 transition-all"
         >
           <Shield size={16} className="text-blue-600" />
           Safety Guide
           {showInstructions ? (
             <ChevronUp size={14} />
           ) : (
             <ChevronDown size={14} />
           )}
         </button>


         {showInstructions && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-2 bg-white bg-opacity-95 p-4 rounded-lg max-w-sm shadow-lg border border-gray-200"
           >
             <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
               <Shield size={18} className="text-blue-600" />
               Stay Safe
             </h4>
             <ul className="text-sm space-y-2 text-gray-600">
               <li>
                 • Use PIN_INCIDENT button to drop location pins or road
                 segments
               </li>
               <li>• Heatmap shows recent security reports</li>
               <li>• Green markers show buddy up requests</li>
               <li>• Buddy up for safe group walking</li>
               <li>
                 • Use zoom controls, mouse wheel, or +/- keys for navigation
               </li>
               <li>• Press 'R' key for quick buddy up request</li>
               <li>• Reports fade over 6 hours (Vibe Decay)</li>
             </ul>
           </motion.div>
         )}
       </div>
     </div>


     {/* Contextual Feed */}
     <div className="bg-gray-50 border-t border-gray-200 px-6 py-8">
       <div className="max-w-7xl mx-auto">
         <h2 className="text-2xl font-bold text-gray-900 mb-6">
           Active Incidents Feed
         </h2>
         <div className="space-y-4 max-h-96 overflow-y-auto">
           {activeReports.length === 0 ? (
             <div className="text-center py-8 text-gray-500">
               No active incidents at the moment
             </div>
           ) : (
             activeReports.map((report) => (
               <div
                 key={report.id}
                 className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                 onClick={() => {
                   if (map.current) {
                     map.current.flyTo({
                       center: [report.longitude, report.latitude],
                       zoom: 18,
                       duration: 2000,
                     });
                     // Show temporary popup on map
                     const popup = new mapboxgl.Popup({
                       closeButton: false,
                       closeOnClick: false,
                     })
                       .setLngLat([report.longitude, report.latitude])
                       .setHTML(
                         `
                         <div class="p-2 max-w-xs">
                           <div class="font-semibold text-sm mb-1">${
                             report.type
                           } Report</div>
                           <div class="text-xs text-gray-600">${
                             report.description || "No description"
                           }</div>
                         </div>
                       `,
                       )
                       .addTo(map.current);


                     // Remove popup after 3 seconds
                     setTimeout(() => {
                       popup.remove();
                     }, 3000);
                   }
                 }}
               >
                 <div className="flex justify-between items-start">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                       <span
                         className={`px-2 py-1 rounded text-xs font-medium ${
                           report.type === "theft"
                             ? "bg-red-100 text-red-800"
                             : report.type === "harassment"
                               ? "bg-yellow-100 text-yellow-800"
                               : report.type === "lights"
                                 ? "bg-blue-100 text-blue-800"
                                 : "bg-gray-100 text-gray-800"
                         }`}
                       >
                         {report.type}
                       </span>
                       <span className="text-sm text-gray-500">
                         {Math.round(report.age_hours * 10) / 10} hours ago
                       </span>
                     </div>
                     <p className="text-gray-700 mb-2">
                       {report.description || "No description"}
                     </p>
                     <p className="text-xs text-gray-500">
                       Coordinates: {report.latitude.toFixed(4)},{" "}
                       {report.longitude.toFixed(4)}
                     </p>
                   </div>
                   <button
                     onClick={(e) => {
                       e.stopPropagation(); // Prevent triggering the parent click
                       buddyUpToReport(report);
                     }}
                     className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                   >
                     <Users size={16} />
                     BuddyUp
                   </button>
                 </div>
               </div>
             ))
           )}
         </div>
       </div>
     </div>


     {/* Chat Modal */}
     {chatModalOpen && selectedReport && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] flex flex-col"
         >
           <div className="flex justify-between items-center p-4 border-b border-gray-200">
             <h3 className="text-lg font-bold text-gray-900">
               Chat - {selectedReport.type} Incident
             </h3>
             <button
               onClick={() => setChatModalOpen(false)}
               className="text-gray-400 hover:text-gray-600"
             >
               <X size={24} />
             </button>
           </div>


           <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
             {chatMessages.length === 0 ? (
               <div className="text-center text-gray-500 py-8">
                 No messages yet. Start the conversation!
               </div>
             ) : (
               chatMessages.map((msg) => (
                 <div key={msg.id} className="flex gap-3">
                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                     {msg.user_id}
                   </div>
                   <div className="flex-1">
                     <p className="text-sm text-gray-700">{msg.message}</p>
                     <p className="text-xs text-gray-500 mt-1">
                       {new Date(msg.created_at).toLocaleTimeString()}
                     </p>
                   </div>
                 </div>
               ))
             )}
           </div>


           <div className="p-4 border-t border-gray-200">
             <div className="flex gap-2">
               <input
                 type="text"
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                 placeholder="Type your message..."
                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               <button
                 onClick={sendChatMessage}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
               >
                 <Send size={16} />
               </button>
             </div>
           </div>
         </motion.div>
       </div>
     )}


     {/* Report Modal */}
     {showReportModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl"
         >
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold text-gray-900">
               Report Security Issue
             </h3>
             <button
               onClick={() => setShowReportModal(false)}
               className="text-gray-400 hover:text-gray-600"
             >
               <X size={24} />
             </button>
           </div>


           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-2 text-gray-700">
                 Type of Issue
               </label>
               <select
                 value={reportType}
                 onChange={(e) => setReportType(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="">Select type...</option>
                 <option value="theft">Theft</option>
                 <option value="harassment">Harassment</option>
                 <option value="lights">No Street Lights</option>
                 <option value="other">Other</option>
               </select>
             </div>


             <div>
               <label className="block text-sm font-medium mb-2 text-gray-700">
                 Description
               </label>
               <textarea
                 value={reportDescription}
                 onChange={(e) => setReportDescription(e.target.value)}
                 placeholder="Describe what happened..."
                 className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-900 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>


             <button
               onClick={handleReportSubmit}
               className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors"
             >
               Submit Report
             </button>
           </div>
         </motion.div>
       </div>
     )}


     {/* Buddy Up Modal */}
     {showBuddyUpModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl"
         >
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold text-gray-900">
               Buddy Up Request
             </h3>
             <button
               onClick={() => setShowBuddyUpModal(false)}
               className="text-gray-400 hover:text-gray-600"
             >
               <X size={24} />
             </button>
           </div>


           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-2 text-gray-700">
                 Message
               </label>
               <textarea
                 value={buddyUpMessage}
                 onChange={(e) => setBuddyUpMessage(e.target.value)}
                 placeholder="Where are you going? When?"
                 className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-900 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
 ,

             <button
               onClick={handleBuddyUpRequest}
               className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
             >
               <Send size={18} />
               Send Buddy Up Request
             </button>
           </div>
         </motion.div>
       </div>
     )}


     {/* Footer Info */}
     <div className="bg-gray-50 border-t border-gray-200 px-6 py-8">
       <div className="max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div>
             <h3 className="text-lg font-semibold text-blue-600 mb-2">
               About Streetwise
             </h3>
             <p className="text-gray-600 text-sm">
               Real-time campus security heatmap powered by community reports.
               Stay informed and safe with live data from fellow students.
             </p>
           </div>
           <div>
             <h3 className="text-lg font-semibold text-blue-600 mb-2">
               Safety Tips
             </h3>
             <ul className="text-gray-600 text-sm space-y-1">
               <li>• Walk in groups after dark</li>
               <li>• Use the buddy up service</li>
               <li>• Report suspicious activity</li>
               <li>• Stay aware of surroundings</li>
             </ul>
           </div>
           <div>
             <h3 className="text-lg font-semibold text-blue-600 mb-2">
               Emergency Contacts
             </h3>
             <p className="text-gray-600 text-sm">
               Campus Security: (254) 123-4567-89
               <br />
               Local Police: 911
               <br />
               Emergency: 911
             </p>
           </div>
         </div>
       </div>
     </div>


     <Toaster />
   </div>
 );
};


export default Streetwise;




