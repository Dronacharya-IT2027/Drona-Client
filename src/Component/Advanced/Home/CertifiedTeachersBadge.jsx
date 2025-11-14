import axios from "axios";
import { useState, useEffect } from "react";
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

 
export default function CertifiedTeachersBadge() {
 

  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    async function fetchTotalUsers() {
      try {
        const res = await axios.get(`${API_BASE}/api/users/totaluser`); 
        setTotalUsers(res.data.totalUsers);
      } catch (err) {
        console.error("Failed to fetch total users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTotalUsers();
  }, []);

  console.log("user" + totalUsers);
  return (
    <div
      className="
        absolute 
        top-20 right-4
        sm:top-24 sm:right-6  
        md:top-28 md:right-8 
        lg:top-20 lg:right-12 
        rounded-3xl 
        px-3 sm:px-4 md:px-5 
        py-2 sm:py-2.5 md:py-3
 
        
      "
    >
      <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3">
        {/* Text */}
        <p className="font-kodchasan text-[10px] sm:text-xs md:text-sm font-medium text-gray-800 whitespace-nowrap">
          Total numbers of students
        </p>

        {/* Avatar Stack */}
        <div className="flex items-center -space-x-2">
          {/* Avatar 1 */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white overflow-hidden bg-yellow-400 shadow-sm">
            <img
              src="https://media.istockphoto.com/id/1388253782/photo/positive-successful-millennial-business-professional-man-head-shot-portrait.webp?a=1&b=1&s=612x612&w=0&k=20&c=CYtNAx70jQEi71qyzo6Cw1boTW3bpLcwQfXZmy5IxW4="
              alt="Teacher"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar 2 */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white overflow-hidden bg-purple-300 shadow-sm">
            <img
              src="https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.webp?a=1&b=1&s=612x612&w=0&k=20&c=u5RPl326UFf1oyrM1iLFJtqdQ3K28TdBdSaSPKeCrdc="
              alt="Teacher"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar 3 */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white overflow-hidden bg-pink-300 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600"
              alt="Teacher"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar 4 */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white overflow-hidden bg-red-400 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1698510047345-ff32de8a3b74?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600"
              alt="Teacher"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Count Badge */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white bg-yellow-400 flex items-center justify-center shadow-sm">
            <span className="font-kodchasan text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-800">
              135+
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}