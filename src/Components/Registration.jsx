import React, { useState } from "react";
let CompanyLogo = [
  "/Images/Logos/logo1.png",
  "/Images/Logos/logo2.png",
  "/Images/Logos/logo3.png",
  "/Images/Logos/logo4.png",
  "/Images/Logos/logo5.png",
];

function Registration({ onStart }) {
  const [tempCompany, setTempCompany] = useState("");
  const [tempUser, setTempUser] = useState("");
  const [logo, setLogo] = useState(CompanyLogo[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempCompany && tempUser) {
      // We call the function passed down from App.jsx
      onStart(tempCompany, tempUser, logo);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl mt-10">
      <h2 className="text-2xl font-black mb-6 text-blue-400 uppercase tracking-tight">
        Initialize Company
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
            Company Name
          </label>
          <input
            required
            type="text"
            value={tempCompany}
            onChange={(e) => setTempCompany(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
            Company Logo
          </label>
          <div className="flex flex-row gap-4 overflow-x-auto pb-2">
            {CompanyLogo.map((path, index) => (
              <img
                key={index}
                src={path}
                alt={`Logo ${index}`}
                onClick={() => setLogo(path)}
                className={`w-14 h-14 p-1 cursor-pointer rounded-lg border-2 transition-all 
                ${logo === path ? "border-blue-500 bg-slate-700" : "border-transparent bg-slate-900 hover:border-slate-600"}`}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
            Manager Name
          </label>
          <input
            required
            type="text"
            value={tempUser}
            onChange={(e) => setTempUser(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500  text-white outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4"
        >
          Start Simulator
        </button>
      </form>
    </div>
  );
}

export default Registration;
