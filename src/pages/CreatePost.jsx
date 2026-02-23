import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../components/layout/Footer";
import {
 MessageSquare,
 Image as ImageIcon,
 ArrowLeft,
 Shield,
 Users,
 Upload,
 X,
} from "lucide-react";


const CreatePost = () => {
 const {
   register,
   handleSubmit,
   watch,
   formState: { errors },
 } = useForm();
 const navigate = useNavigate();
 const content = watch("content", "");
 const maxLength = 500;
 const [imageUrl, setImageUrl] = useState("");
 const [uploadedFile, setUploadedFile] = useState(null);
 const [uploading, setUploading] = useState(false);
 const fileInputRef = useRef(null);
const handleFileUpload = (event) => {
   const file = event.target.files[0];
   if (file) {
     if (file.size > 5 * 1024 * 1024) {
       // 5MB limit
       toast.error("File size must be less than 5MB");
       return;
     }


     if (!file.type.startsWith("image/")) {
       toast.error("Please select an image file");
       return;
     }


     setUploadedFile(file);
     setImageUrl(URL.createObjectURL(file));
     toast.success("Image selected successfully!");
   }
 };


 const handleRemoveImage = () => {
   setImageUrl("");
   setUploadedFile(null);
   if (fileInputRef.current) {
     fileInputRef.current.value = "";
   }
 };


 const uploadToCloudinary = async (file) => {
   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


   if (
     !cloudName ||
     !uploadPreset ||
     cloudName === "your-cloud-name" ||
     uploadPreset === "your-upload-preset"
   ) {
     throw new Error(
       "Image upload not configured. Please set up Cloudinary credentials in .env file."
     );
   }


   const formData = new FormData();
   formData.append("file", file);
   formData.append("upload_preset", uploadPreset);


   const response = await fetch(
     `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
     {
       method: "POST",
       body: formData,
     }
   );


   if (!response.ok) {
     throw new Error("Failed to upload image");
   }
const data = await response.json();
   return data.secure_url;
 };


 const onSubmit = async (data) => {
   if (!data.content.trim()) {
     toast.error("Post content cannot be empty");
     return;
   }


   try {
     let finalImageUrl = null;


     if (uploadedFile) {
       setUploading(true);
       finalImageUrl = await uploadToCloudinary(uploadedFile);
       setUploading(false);
     }


     const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
     const response = await fetch(`${apiUrl}/api/posts`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       credentials: "include",
       body: JSON.stringify({
         content: data.content,
         image: finalImageUrl,
         category_id: 1, // default category
       }),
     });


     if (response.ok) {
       toast.success("Post created successfully!", { duration: 2000 });
       navigate("/");
     } else {
       const errorData = await response.json();
       toast.error(errorData.error || "Failed to create post", {
         duration: 3000,
       });
     }
   } catch (error) {
     toast.error("Network error. Please try again.");
     setUploading(false);
   }
 };


 return (
   <div className="min-h-screen">
     {/* Hero Section */}
     <section className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center z-10">
       <div className="absolute inset-0 w-full h-full">
         <img
           src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
            alt="Create Post"
           className="w-full h-full object-cover"
           loading="eager"
         />
       </div>
       <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.8)] via-[rgba(10,10,10,0.6)] to-[rgba(10,10,10,0.8)] z-10"></div>
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-20 pointer-events-none"></div>


       <div className="relative z-30 text-center p-4 max-w-[48rem] mx-auto">
         <div className="mb-12">
           <Link
             to="/"
             className="inline-flex items-center gap-2 p-3 pr-6 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.2)] rounded-[50px] text-white no-underline font-medium text-sm mb-8 transition-all hover:bg-[rgba(255,255,255,0.2)] hover:translate-x-[-2px]"
           >
             <ArrowLeft size={20} />
             Back to Feed
           </Link>


           <h1 className="text-[3rem] font-black text-white mb-4 text-shadow-[0_4px_8px_rgba(0,0,0,0.5)] tracking-[-0.025em] leading-[1.1]">
             Share Your Voice
  </h1>


           <p className="text-xl text-[rgba(255,255,255,0.9)] font-medium leading-relaxed">
             Express your thoughts, share experiences, and connect with your
             campus community
           </p>
         </div>
       </div>
     </section>


     {/* Form Section */}
     <section className="py-16 bg-white">
       <div className="container">
         <div className="max-w-[48rem] mx-auto bg-white border-2 border-gray-200 rounded-[2rem] overflow-hidden">
           <div className="bg-gradient-to-br from-blue-500 to-blue-800 text-white p-8 text-center">
             <div className="w-16 h-16 bg-[rgba(255,255,255,0.2)] rounded-xl flex items-center justify-center mx-auto mb-4 box-shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
               <MessageSquare size={28} />
             </div>
             <h2 className="text-2xl font-bold mb-2">Create New Post</h2>
             <p className="text-blue-100">
               Share what's on your mind with the community
             </p>   </div>


           <form onSubmit={handleSubmit(onSubmit)} className="p-8">
             <div className="mb-8">
               <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3 text-base">
                 <MessageSquare size={18} />
                 Your Message
               </label>
               <textarea
                 {...register("content", {
                   required: "Content is required",
                   maxLength: {
                     value: maxLength,
                     message: `Content must be under ${maxLength} characters`,
                   },
                 })}
                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base bg-gray-50 resize-vertical transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                 rows="6"
                 placeholder="What's happening on campus? Share your thoughts, experiences, or suggestions..."
               />
               <div className="flex justify-between items-center mt-3">
                 <div className="text-sm text-gray-500">
                   {content.length}/{maxLength}
                     </div>
                 {errors.content && (
                   <p className="text-sm text-red-600 font-medium">
                     {errors.content.message}
                   </p>
                 )}
               </div>
             </div>


             <div className="mb-8">
               <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3 text-base">
                 <ImageIcon size={18} />
                 Image (Optional)
               </label>


               {/* File input and buttons */}
               <div className="flex gap-3 mb-4 flex-wrap">
                 <button
                   type="button"
                   onClick={() => fileInputRef.current?.click()}
                   className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                 >
                   <Upload size={16} />
                   Upload Image
                 </button>
               </div>  {/* Hidden file input */}
               <input
                 ref={fileInputRef}
                 type="file"
                 accept="image/*"
                 onChange={handleFileUpload}
                 style={{ display: "none" }}
               />


               {/* Image Preview */}
               {imageUrl && (
                 <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                   <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                     <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-br from-blue-500 to-blue-800 text-white rounded-full text-sm font-medium">
                       <Upload size={14} />
                       Uploaded
                     </div>
                     <button
                       type="button"
                       onClick={handleRemoveImage}
                       className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                     >
                       <X size={16} />
                     </button>
                   </div>
 <img
                     src={imageUrl}
                     alt="Post preview"
                     className="w-full h-auto"
                     onError={(e) => {
                       console.error("Image failed to load:", imageUrl);
                       // Try with a simple fallback image
                       if (!imageUrl.includes("picsum.photos")) {
                         console.log("Trying fallback image...");
                         const fallbackId =
                           Math.floor(Math.random() * 1000) + 1;
                         setImageUrl(
                           `https://picsum.photos/600/400?random=${fallbackId}`
                         );
                       } else {
                         toast.error(
                           "Image failed to load. Try different keywords."
                         );
                         setImageUrl("");
                         setImageMode("none");
                       }
                     }}
                     onLoad={() =>
                       console.log("Image loaded successfully:", imageUrl)
                             }
                   />
                 </div>
               )}
             </div>


             <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
               <Link
                 to="/"
                 className="px-6 py-3 bg-gray-100 text-gray-700 border-2 border-gray-300 rounded-[50px] font-medium text-sm no-underline transition-all hover:bg-gray-200 hover:border-gray-400"
               >
                 Cancel
               </Link>
               <button
                 type="submit"
                 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-500 to-blue-800 text-white border-2 border-blue-600 rounded-[50px] font-medium text-sm transition-all hover:translate-y-[-2px] hover:shadow-lg shadow-md"
               >
                 <MessageSquare size={18} />
                 Post to Community
               </button>
             </div>
           </form>
         </div>
  {/* Trust Indicators */}
         <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <div className="flex flex-col md:flex-row gap-6">
             <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
               <div className="w-12 h-12 text-blue-500 flex-shrink-0">
                 <Shield size={48} />
               </div>
               <div>
                 <h4 className="font-semibold text-gray-900 mb-1">
                   Anonymous & Secure
                 </h4>
                 <p className="text-gray-600 text-sm">
                   Your privacy is protected
                 </p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
               <div className="w-12 h-12 text-blue-500 flex-shrink-0">
                 <Users size={48} />
               </div>
               <div>
                 <h4 className="font-semibold text-gray-900 mb-1">
                   Community Impact
                 </h4>
 <p className="text-gray-600 text-sm">
                   Your voice drives change
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>
     <Footer />
   </div>
 );
};


export default CreatePost;



