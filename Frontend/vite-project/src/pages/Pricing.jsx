import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authHeader, axiosInstance } from "../services/api";

export default function Pricing() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/user/me", {
        headers: authHeader(),
      });

      setUserInfo(res.data.user);

      
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      toast.error("Failed to fetch user info");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleBuyPlan = async (planName) => {
    try {
      setLoading(true);

      const orderRes = await axiosInstance.post(
        "/api/payment/order",
        { planName },
        { headers: authHeader() }
      );

      const { order, key } = orderRes.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "FILO",
        description: "Upgrade Storage Plan",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planName,
              },
              { headers: authHeader() }
            );

            toast.success(verifyRes.data.message || " Plan upgraded!");

            
            await fetchProfile();
          } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
          }
        },

        theme: { color: "#22c55e" },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existing = document.getElementById("razorpay-script");
      if (existing) return resolve(true);

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <div className="bg-gray-100 min-h-[88vh]">
      <div className="max-w-6xl mx-auto py-12 px-4">
        
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Storage Plans 💾
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            Upgrade your plan to increase storage and upload more files 🚀
          </p>
        </div>

        
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
          <p className="text-sm text-gray-700">
            Current Plan:{" "}
            <span className="font-bold text-green-600">
              {userInfo?.plan || "FREE"}
            </span>
          </p>
        </div>

       
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlanCard
            badge="Starter"
            title="FREE"
            storage="2GB"
            price="₹0"
            features={["Upload & Share", "Expiry Link", "Password Protect"]}
            buttonText={
              userInfo?.plan === "FREE" ? "Current Plan" : "Select Plan"
            }
            onBuy={() => toast.success("You are already on Free plan")}
            disabled={true}
            loading={loading}
            highlight={false}
          />

          <PlanCard
            badge="Best Value ⭐"
            title="PRO 10GB"
            storage="10GB"
            price="₹99"
            features={["More storage", "Faster sharing", "Premium badge"]}
            buttonText={
              userInfo?.plan === "PRO_10GB" ? "Current Plan" : "Buy Now"
            }
            onBuy={() => handleBuyPlan("PRO_10GB")}
            disabled={loading || userInfo?.plan === "PRO_10GB"}
            loading={loading}
            highlight={true}
          />

          <PlanCard
            badge="Team"
            title="PRO 50GB"
            storage="50GB"
            price="₹299"
            features={["Huge storage", "Priority support", "Best for teams"]}
            buttonText={
              userInfo?.plan === "PRO_50GB" ? "Current Plan" : "Buy Now"
            }
            onBuy={() => handleBuyPlan("PRO_50GB")}
            disabled={loading || userInfo?.plan === "PRO_50GB"}
            loading={loading}
            highlight={false}
          />
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  badge,
  title,
  storage,
  price,
  features,
  onBuy,
  disabled,
  loading,
  highlight,
  buttonText,
}) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col shadow-sm transition hover:shadow-md ${
        highlight
          ? "bg-gray-900 text-white border-gray-800"
          : "bg-gray-50 text-gray-900 border-gray-200"
      }`}
    >
      
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            highlight ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {badge}
        </span>

        <span
          className={`text-xs font-medium ${
            highlight ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {storage}
        </span>
      </div>

      
      <h2 className="text-xl font-bold mt-4">{title}</h2>

      
      <p className="text-3xl font-extrabold mt-3">{price}</p>
      <p className={`text-sm mt-1 ${highlight ? "text-gray-300" : "text-gray-600"}`}>
        per month
      </p>

      
      <ul className="mt-5 text-sm space-y-2 flex-1">
        {features.map((f, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span className={highlight ? "text-gray-200" : "text-gray-700"}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      
      <button
        disabled={disabled}
        onClick={onBuy}
        className={`w-full mt-6 font-semibold p-3 rounded-xl transition ${
          disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : highlight
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "Please wait..." : buttonText}
      </button>
    </div>
  );
}
