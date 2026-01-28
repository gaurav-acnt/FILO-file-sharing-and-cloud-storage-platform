import { useState } from "react";
import toast from "react-hot-toast";
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { axiosInstance } from "../services/api";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/contact", formData);

      toast.success(res.data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 sm:py-12 px-3 sm:px-4">
   
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Contact Us 📩
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
          Have questions, feedback or want to collaborate? Send us a message and
          we’ll get back to you soon.
        </p>
      </div>

 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-10">
       
        <div className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Get in touch
          </h2>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            We are always open to discussing new projects, ideas, and internship
            opportunities.
          </p>

          <div className="mt-6 space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3 break-all">
              <MdEmail className="text-green-600 shrink-0" size={20} />
              <span>filocontact2026@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <MdPhone className="text-green-600 shrink-0" size={20} />
              <span>+91 90000 00000</span>
            </div>

            <div className="flex items-center gap-3">
              <MdLocationOn className="text-green-600 shrink-0" size={22} />
              <span>India</span>
            </div>
          </div>

        
          <div className="mt-8">
            <p className="font-semibold text-gray-900 mb-3">Follow us</p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full border hover:bg-gray-50 hover:text-green-600 transition"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full border hover:bg-gray-50 hover:text-green-600 transition"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full border hover:bg-gray-50 hover:text-green-600 transition"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full border hover:bg-gray-50 hover:text-green-600 transition"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>

       
          <div className="mt-8">
            <div className="bg-gray-50 border rounded-2xl p-4 text-sm text-gray-600">
              📍 <b>Delhi, India</b>
            </div>
          </div>
        </div>

       
        <div className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Send a message
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Fill the form and we will contact you soon 
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold p-3 rounded-xl hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              We typically reply within 24 hours 
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
