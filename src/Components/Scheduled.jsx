import { useState } from "react";
import SetTimer from "./Timer";

export default function Scheduler({ AssignedRoutes, setAssignedRoutes ,setMoney}) {
  // Track which route IDs are currently "running"
  const [runningRoutes, setRunningRoutes] = useState([]);

  const startRoute = (id) => {
    setRunningRoutes([...runningRoutes, id]);
  };
  return (
    <div className="flex-grow bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-500">
          Scheduled Transits
        </h3>
      </div>
      {AssignedRoutes.length === 0 && (
        <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-600 text-sm font-medium italic">
            No buses currently on route.
          </p>
        </div>
      )}
      {AssignedRoutes.length !== 0 && (
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-2 gap-6">
          {AssignedRoutes.map((route) => (
            <div key={route.id} className="...">
              <h4 className="text-white">{route.route}</h4>

              {/* Pass the isActive prop based on whether this ID is in our state */}
              <SetTimer
                TimeOut={10000}
                SetTimeName="In Transit"
                isActive={runningRoutes.includes(route.id)}
                CallBackFunction={() => {
                    console.log(`${route.route} arrived!`)
                    setAssignedRoutes(prev => prev.filter(r => r.id !== route.id));
                    setMoney(prev => prev +1600)
                }}
              />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => startRoute(route.id)}
                  disabled={runningRoutes.includes(route.id)}
                  className={`py-2 rounded font-black uppercase text-[9px] 
                ${runningRoutes.includes(route.id) ? "bg-slate-700 text-slate-500" : "bg-slate-800 text-white hover:bg-slate-700"}`}
                >
                  {runningRoutes.includes(route.id) ? "Running..." : "Start"}
                </button>
                <button className="text-white">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
