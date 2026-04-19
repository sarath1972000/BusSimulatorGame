import { useState } from "react"

export default function Dialog(props){
    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-400">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl max-w-sm w-full">
        {/* This is where your custom content will "land" at runtime */}
        <div className="text-white">
          {props.children}
        </div>
        <button onClick={props.onClose} className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">
         Close
         </button>
        </div>
      </div> 
  );

}