import { useEffect, useState } from "react";
import CategoryChart from "../components/analytics/CategoryChart";
import VoteChart from "../components/analytics/VoteChart";
import Footer from "../components/layout/Footer";


export default function AnalyticsDashboard() {
 const [analytics, setAnalytics] = useState(null);


 useEffect(() => {
   async function fetchAnalytics() {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const res = await fetch(`${apiUrl}/api/analytics`, {
       credentials: "include",
     });
     const data = await res.json();
     setAnalytics(data);
   }
   fetchAnalytics();
 }, []);


 if (!analytics) return <p className="p-4">Loading analytics...</p>;


 return (
   <div className="max-w-4xl mx-auto p-4 pt-16">
     <h1 className="text-2xl font-bold mb-4">Campus Analytics</h1>
     <CategoryChart data={analytics.categories} />
     <VoteChart data={analytics.posts} />
     <Footer />
   </div>
 );
}
