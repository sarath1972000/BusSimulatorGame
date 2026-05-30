import React, { useEffect, useState } from "react";
import Dialog from "./Dialog";

function Routes({ UserData, UserUpdateData, setMoney ,AssignedRoutes,setAssignedRoutes }) {
  const [masterData, setMasterData] = useState(null); // The whole JSON
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogModalOpen, setDialogModalOpen] = useState(false);
  const [buyData, setBuyData] = useState({});
  const [warningMessage, setWarningMessage] = useState("");
  const [setassignbus, setAssignBusOpen] = useState(false);
  const [AssignBusRoute, setAssignBusRouteData] = useState({});
  const [isAssignBusModalOpen, setAssignBusModalOpen] = useState(false);
  const [busMasterData, setBusMasterData] = useState([]);

  // Form State
  const [selection, setSelection] = useState({
    country: "",
    state: null,
    fromCity: "",
    toCity: "",
  });

  useEffect(() => {
    fetch("/json/routes.json")
      .then((res) => res.json())
      .then((data) => setMasterData(data))
      .catch((err) => console.error("Error loading routes:", err));
  }, []);

  useEffect(() => {
    setBusMasterData(JSON.parse(localStorage.getItem("BusSimulator")).buses);
    console.log("bus data received", busMasterData);
  }, [isAssignBusModalOpen]);

  const handleAddRoute = () => {
    const routeName = `${selection.fromCity} ➔ ${selection.toCity}`;
    // Find distance from JSON
    const distanceObj = selection.state.placeDetails.Distance.find(
      (d) =>
        (d.from === selection.fromCity && d.TO === selection.toCity) ||
        (d.from === selection.toCity && d.TO === selection.fromCity),
    );

    const newRoute = {
      id: Date.now(),
      name: routeName,
      distance: distanceObj ? `${distanceObj.KM} KM` : "N/A",
    };

    setActiveRoutes([...activeRoutes, newRoute]);
    setIsModalOpen(false);
    let Routedata = [
      {
        country: selection.country,
        fromCity: selection.fromCity,
        toCity: selection.toCity,
      },
    ];
    UserUpdateData({ ...UserData, Routes: [...UserData.Routes, Routedata] });
    setSelection({ country: "", state: null, fromCity: "", toCity: "" });
  };

  return (
    <div className="w-[30%] h-full flex flex-col gap-2 border-r border-slate-800 pr-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full h-20 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-xl flex items-center justify-center gap-3 transition-all"
      >
        <span className="text-xl">➕</span>
        <span className="text-sm font-bold text-white uppercase">
          Add Routes
        </span>
      </button>

      <div className="flex-grow bg-[#0f172a] border border-slate-700 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/30">
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-500">
            Available Routes
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto p-3 space-y-2">
          {activeRoutes.map((route) => (
            <div
              key={route.id}
              className="p-4 rounded-lg bg-slate-900 border border-slate-800"
            >
              <p className="text-sm font-bold text-blue-400">{route.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase">
                Distance: {route.distance}
              </p>
              <button
                onClick={() => {
                  setAssignBusOpen(true);
                  setAssignBusModalOpen(true);
                  setAssignBusRouteData({
                    id: route.id,
                    route: route.name,
                    Distance: route.distance,
                  });
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded uppercase transition-colors"
              >
                AssignBus
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* ---- assign bus modal ----- */}
      {setassignbus && isAssignBusModalOpen && (
        <Dialog
          onClose={() => {
            setAssignBusModalOpen(false);
          }}
        >
          <div className="p-2">
            {/* Header Section */}
            <div className="border-b border-slate-700 pb-4 mb-6">
              <h2 className="text-xl font-black text-blue-400 tracking-tight flex items-center gap-2">
                <span>📍</span> {AssignBusRoute.route}
              </h2>
              <p className="text-slate-400 text-xs font-semibold uppercase mt-1">
                Distance:{" "}
                <span className="text-white">{AssignBusRoute.distance}</span>
              </p>
            </div>

            {/* Form Section */}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">
                  Select Available Bus
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                  defaultValue=""
                >
                  {busMasterData.map((b) => {
                    if (b !== null) return <option key = {b} value={b}>{b}</option>;
                  })}
                </select>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  // Logic to handle assignment goes here
                  setAssignBusModalOpen(false);
                  setActiveRoutes(activeRoutes.filter((v)=>{return v.id !== AssignBusRoute.id}));
                  UserUpdateData({ ...UserData, Routes: activeRoutes.filter((v)=>{return v.id !== AssignBusRoute.id})});
                  setAssignedRoutes(...AssignedRoutes,AssignedRoutes.push(AssignBusRoute))
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all flex justify-center items-center gap-2 mt-4"
              >
                <span>Confirm Assignment</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* --- CASCADING FORM MODAL --- */}
      {isModalOpen && masterData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 border-b text-white border-slate-800 pb-2">
              Assign New Route
            </h3>

            <div className="space-y-4">
              {/* 1. Select Country */}
              <div>
                <label className="text-[10px] text-slate-500 text-white font-bold uppercase">
                  Country
                </label>
                <select
                  className="w-full bg-slate-800 border  text-white border-slate-700 p-2 rounded mt-1"
                  onChange={(e) =>
                    setSelection({ ...selection, country: e.target.value })
                  }
                >
                  <option value="">Choose Country</option>
                  <option value={masterData.Country}>
                    {masterData.Country}
                  </option>
                </select>
              </div>

              {/* 2. Select State (Shows Lock) */}
              {selection.country && (
                <div>
                  <label className="text-[10px] text-slate-500 text-white font-bold uppercase">
                    State
                  </label>
                  <div className="flex flex-col gap-2 mt-1">
                    {masterData.state.map((s) => (
                      <div
                        key={s.StateName}
                        className="flex items-center gap-2 mb-2"
                      >
                        <button
                          onClick={() => {
                            setSelection({ ...selection, state: s });
                          }}
                          disabled={
                            s.Statelock === 1 &&
                            !UserData.UnlockedState.includes(s.StateName)
                          }
                          className={`flex-grow p-3 rounded text-white border text-left flex justify-between ${
                            s.Statelock === 1 &&
                            !UserData.UnlockedState.includes(s.StateName)
                              ? "opacity-50 bg-slate-800"
                              : "bg-slate-900 border-blue-500/30"
                          }${selection.state?.StateName === s.StateName ? "border-blue-500 bg-blue-500/10" : ""}`}
                        >
                          <span>{s.StateName}</span>
                          {s.Statelock === 1 &&
                            !UserData.UnlockedState.includes(s.StateName) && (
                              <span>🔒</span>
                            )}
                        </button>

                        {/* SHOW BUY BUTTON ONLY IF LOCKED */}
                        {s.Statelock === 1 &&
                          !UserData.UnlockedState.includes(s.StateName) && (
                            <button
                              onClick={() => {
                                setDialogModalOpen(true);
                                setBuyData({
                                  option: s.StateName,
                                  cost: s.StateCost,
                                });
                              }}
                              className="bg-green-600 text-white hover:bg-green-500 px-4 py-3 rounded text-xs font-bold transition-all"
                            >
                              BUY
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Select Cities (Shows Lock) */}
              {selection.state && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 text-white font-bold uppercase">
                      From
                    </label>
                    <select
                      className="w-full bg-slate-800 border text-white border-slate-700 p-2 rounded mt-1 text-sm"
                      onChange={(e) =>
                        setSelection({ ...selection, fromCity: e.target.value })
                      }
                    >
                      <option value="">Source</option>
                      {selection.state.placeDetails.Cities.map((c) => (
                        <option
                          key={c.key}
                          value={c.key}
                          disabled={c.cityLock === 1}
                        >
                          {c.place} {c.cityLock === 1 ? "🔒" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 text-white font-bold uppercase">
                      To
                    </label>
                    <select
                      className="w-full text-white bg-slate-800 border border-slate-700 p-2 rounded mt-1 text-sm"
                      onChange={(e) =>
                        setSelection({ ...selection, toCity: e.target.value })
                      }
                    >
                      <option value="">Destination</option>
                      {selection.state.placeDetails.Cities.map((c) => (
                        <option
                          key={c.key}
                          value={c.key}
                          disabled={c.cityLock === 1}
                        >
                          {c.place} {c.cityLock === 1 ? "🔒" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelection({});
                }}
                className="flex-1 p-2 text-white bg-slate-800 rounded font-bold text-xs"
              >
                CANCEL
              </button>
              <button
                disabled={
                  !selection.fromCity ||
                  !selection.toCity ||
                  selection.fromCity === selection.toCity
                }
                onClick={handleAddRoute}
                className="flex-1 p-2 bg-blue-600  text-white rounded font-bold text-xs disabled:opacity-30"
              >
                CONFIRM ROUTE
              </button>
            </div>
          </div>
        </div>
      )}
      {isDialogModalOpen && (
        <Dialog
          onClose={() => {
            setDialogModalOpen(false);
          }}
        >
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="bg-slate-900 border border-green-500/50 p-6 rounded-2xl w-80 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <h3 className="text-lg font-bold text-center">
                Unlock {buyData.option}
              </h3>

              <div className="my-6 text-center">
                <p className="text-slate-400 text-xs uppercase tracking-widest">
                  Required Funds
                </p>
                <p className="text-2xl font-black text-green-400">
                  {buyData.cost}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (UserData.bankDetails.money >= buyData.cost) {
                      let newMoney = UserData.bankDetails.money - buyData.cost;
                      UserUpdateData({
                        ...UserData,
                        bankDetails: {
                          ...UserData.bankDetails,
                          money: UserData.bankDetails.money - buyData.cost,
                        },
                        UnlockedState: [
                          ...UserData.UnlockedState,
                          buyData.option,
                        ],
                      });
                      setMoney(newMoney);
                      setWarningMessage("Purshased successfully");
                      setDialogModalOpen(false);
                      setBuyData({});
                    } else {
                      setWarningMessage("No sufficient Funds");
                    }
                  }}
                  className="w-full bg-green-600 p-3 rounded-lg font-bold hover:bg-green-500 transition-all"
                >
                  CONFIRM PURCHASE
                </button>
                <button
                  onClick={() => {
                    setDialogModalOpen(false);
                    setBuyData({});
                  }}
                  className="w-full bg-slate-800 p-3 rounded-lg font-bold text-slate-400"
                >
                  MAYBE LATER
                </button>
              </div>

              <p className="text-[10px] text-center mt-4 text-slate-500">
                Current Balance: ${UserData.bankDetails.money}
              </p>
            </div>
          </div>
        </Dialog>
      )}
      {warningMessage !== "" && (
        <Dialog
          onClose={() => {
            setWarningMessage("");
          }}
        >
          <p>{warningMessage}</p>
        </Dialog>
      )}
    </div>
  );
}

export default Routes;
