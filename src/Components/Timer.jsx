import { useEffect, useState } from "react";

export default function SetTimer({
  TimeOut = 5000,
  SetTimeName = "",
  CallBackFunction,
  isActive,
}) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    // ONLY start the interval if isActive is true
    if (!isActive) return;

    const intervalTime = 50;
    const increment = (intervalTime / TimeOut) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (CallBackFunction) CallBackFunction();
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
    // Add isActive to the dependency array
  }, [TimeOut, CallBackFunction, isActive]);

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-xs mb-1 text-slate-400 font-mono">
        <span>{SetTimeName}</span>
        <span>{Math.round(progress) || 0}%</span>
      </div>

      {/* Background Track */}
      <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-600">
        {/* Moving Filler */}
        <div
          className="bg-blue-500 h-full transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
