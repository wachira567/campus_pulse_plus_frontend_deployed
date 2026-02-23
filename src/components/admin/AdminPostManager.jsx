import { useState } from "react";
import AdminResponseForm from "./AdminResponseForm";


export default function AdminPostManager({ post, refresh }) {
 const [showForm, setShowForm] = useState(!post.admin_response);


 return (
   <div className="border p-4 rounded shadow mb-4 bg-white">
     <p className="text-gray-800 mb-2">{post.content}</p>


     {post.admin_response && (
       <p className="mb-2 text-green-600 font-semibold">
         Admin Response: {post.admin_response}
       </p>
     )}


     {showForm && (
       <AdminResponseForm
         postId={post.id}
         onResponseAdded={() => {
           setShowForm(false);
           refresh();
         }}
       />
     )}
   </div>
 );
}
