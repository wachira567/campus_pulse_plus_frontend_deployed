import { useState } from "react";


export default function AdminResponseForm({ postId, onResponseAdded }) {
 const [content, setContent] = useState("");


 async function handleSubmit(e) {
   e.preventDefault();
   if (!content.trim()) return;


   try {
     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/admin/responses`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       credentials: "include",
       body: JSON.stringify({ post_id: postId, content: content.trim() }),
     });


     if (response.ok) {
       setContent("");
       onResponseAdded();
     } else {
       const errorData = await response.json();
       alert(`Error: ${errorData.error || "Failed to submit response"}`);
     }
   } catch (error) {
     alert("Network error. Please try again.");
   }
 }


 return (
   <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
     <input
       type="text"
       value={content}
       onChange={(e) => setContent(e.target.value)}
       placeholder="Write admin response..."
       className="flex-1 border p-2 rounded"
     />
     <button type="submit" className="bg-blue-600 text-white px-3 rounded">
       Respond
     </button>
   </form>
 );
}
