import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const profile = {
  img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
  fullName: "Alex Johnson",
  location: "New York, USA",
  email: "alex.johnson@email.co",
  nationality: "American",
  dob: "01/15/1990",
};

export default function PersonalDetails() {
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState("");

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* Sidebar */}
     

      <div className="flex-1 ml-20">
        {/* Navbar / Topbar */}
      

        <main className="px-12 py-8 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-7">Profile Settings</h1>
          {/* User Digital ID */}
          <div className="flex items-center space-x-16 mb-12">
            <div className="relative">
              <img src={profile.img} alt="User Digital ID" className="w-24 h-24 rounded-full border-2 border-gray-300 shadow" />
              <span className="absolute top-0 right-0 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="7" width="16" height="10" rx="2"/></svg>
              </span>
            </div>
            <div>
              <span className="text-lg font-bold">User ID</span><br />
              <span className="text-3xl font-extrabold">User's Digital ID</span>
              <span className="inline-flex ml-6 bg-black text-white rounded-full w-8 h-8 items-center justify-center text-xl align-middle">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="7" width="16" height="10" rx="2"/></svg>
              </span>
            </div>
          </div>

          {/* Identity Information & Subscription/Privacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Identity Information */}
            <section className="font-sans max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-6">Identity Information</h2>
              <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                {[
                  { label: "Full Name", value: profile.fullName },
                  { label: "Location", value: profile.location },
                  { label: "Email", value: <a href={`mailto:${profile.email}`} className="text-blue-700 underline">{profile.email}</a> },
                  { label: "Nationality", value: profile.nationality },
                  { label: "Date of Birth", value: profile.dob },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between p-4">
                    <span className="font-medium">{label}</span>
                    <span className="text-gray-800">{value}</span>
                    <button className="text-blue-500 hover:underline text-sm">Edit</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Subscription & Privacy Controls */}
            <section className="max-w-md w-full flex flex-col gap-8">
              <div className="bg-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-3">Subscription</h2>
                <p className="mb-4 text-gray-700">Access 24/7 monitoring services.</p>
                <button className="bg-black text-white font-bold px-8 py-2 rounded hover:bg-white hover:text-black transition">Upgrade</button>
              </div>
              <div className="bg-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-3">Privacy Controls</h2>
                <p className="mb-4 text-gray-700">Adjust your privacy settings here.</p>
                <div className="flex gap-6">
                  <button className="bg-white font-bold px-8 py-2 rounded hover:bg-black hover:text-white transition">Make visible</button>
                  <button className="bg-white font-bold px-8 py-2 rounded hover:bg-black hover:text-white transition">Keep private</button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
