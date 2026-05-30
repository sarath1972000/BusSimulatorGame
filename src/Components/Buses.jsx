import React, { useEffect, useState } from "react";
import Dialog from "./Dialog";

function Buses({ open, onClose, gameState, setGameState, money, setMoney }) {
  const [lockedBuses, setLockedBuses] = useState([]);
  const [buyMessage, setBuyMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    fetch("/json/Buses.json")
      .then((res) => res.json())
      .then((data) => setLockedBuses(data.filter((bus) => bus.locked)))
      .catch((err) => console.error("Error loading locked buses", err));
  }, [open]);

  if (!open) {
    return null;
  }

  const ownedBuses = gameState?.buses || [];
  const currentBalance = money ?? gameState?.bankDetails?.money ?? 0;

  const handleBuy = (bus) => {
    if (ownedBuses.includes(bus.busName)) return;
    if (currentBalance < bus.price) {
      setBuyMessage("Not enough balance to buy this bus.");
      return;
    }

    const updatedBuses = [...ownedBuses, bus.busName];
    const updatedMoney = currentBalance - bus.price;

    setGameState({
      ...gameState,
      bankDetails: {
        ...gameState.bankDetails,
        money: updatedMoney,
      },
      buses: updatedBuses,
    });
    setMoney(updatedMoney);
    setBuyMessage(`Purchased ${bus.busName} successfully.`);
  };

  return (
    <Dialog onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">Buy Locked Buses</h1>
          <p className="text-sm text-slate-400 mt-2">
            Purchase buses that are currently locked in the garage.
          </p>
        </div>

        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {lockedBuses.length === 0 ? (
            <p className="text-sm text-slate-400">No locked buses available.</p>
          ) : (
            lockedBuses.map((bus) => {
              const alreadyOwned = ownedBuses.includes(bus.busName);
              return (
                <div
                  key={bus.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{bus.busName}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Capacity: {bus.BusState.capacity} · Fuel: {bus.BusState.fuelType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-400">${bus.price}</p>
                      {alreadyOwned && (
                        <p className="text-[10px] text-slate-500 uppercase mt-1">
                          Owned
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleBuy(bus)}
                      disabled={alreadyOwned}
                      className={`w-full rounded-lg px-4 py-3 text-sm font-bold transition-all ${alreadyOwned ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                    >
                      {alreadyOwned ? "OWNED" : "BUY"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Current Balance
          </p>
          <p className="mt-1 text-lg font-black text-white">${currentBalance}</p>
        </div>

        {buyMessage && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/40 p-3 text-sm text-emerald-200">
            {buyMessage}
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default Buses;
