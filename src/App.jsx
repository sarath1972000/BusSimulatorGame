import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Registration from "./Components/Registration"; // Import new component
import Routes from "./Components/Routes";
import Dialog from "./Components/Dialog";
import Scheduler from "./Components/Scheduled"
function App() {
  const [companyName, setCompanyName] = useState("Bus Sim");
  const [userName, setUserName] = useState("Manager");
  const [money, setMoney] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [Gameover, setGameOver] = useState(false);
  const [logo, setlogo] = useState("select Logo");
  const [gameState, setGameState] = useState({});
  const [AssignedRoutes , setAssignedRoutes] =useState([])

  useEffect(() => {
    console.log("setting up game state", gameState);
    localStorage.setItem("BusSimulator", JSON.stringify(gameState));
    console.log(
      "gamestate set and value is ",
      localStorage.getItem("BusSimulator"),
    );
  }, [gameState]);

  // This function is passed to the Registration component
  const handleGameStart = (name, manager, logo, tempBus) => {
    //Add the data to local storage.
    const newUser = {
      userId: 1,
      user: manager,
      company: name,
      SelectedLogo: logo,
      bankDetails: {
        money: 10000,
        loan: 0,
      },
      UnlockedState: [],
      Routes: [],
      buses: tempBus,
    };
    setGameState(newUser);
    setCompanyName(name);
    setUserName(manager);
    setlogo(logo);
    setIsRegistered(true);
    setMoney(newUser.bankDetails.money);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {/* top panel */}
      <Header
        companyName={companyName}
        userName={userName}
        money={money}
        setMoney={setMoney}
        Gameover={setGameOver}
        logo={logo}
        UserUpdateData={setGameState}
        UserData={gameState}
      />

      {/* left  and right panel*/}
      <main className="p-8 flex gap-6 h-[calc(135vh-120px)] overflow-hidden">
        {!isRegistered && !Gameover  ? (
          <Registration onStart={handleGameStart} />
        ) : (
          <>
            <Routes
              UserData={gameState}
              UserUpdateData={setGameState}
              setMoney={setMoney}
              AssignedRoutes={AssignedRoutes}
              SetAssignedRoutes={setAssignedRoutes}
            />
            <section className="flex-grow flex flex-col gap-4">
              {/* Top Management Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-white font-bold uppercase text-xs hover:border-blue-500 transition-all">
                  Add Buses
                </button>
                <button className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-white font-bold uppercase text-xs hover:border-orange-500 transition-all">
                  Repair Bus
                </button>
                <button className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-white font-bold uppercase text-xs hover:border-green-500 transition-all">
                  Add Food
                </button>
              </div>
              <Scheduler AssignedRoutes={AssignedRoutes} setAssignedRoutes={setAssignedRoutes} setMoney={setMoney}/>
            </section>
          </>
        )}
        {Gameover && (
          <Dialog
            onClose={() => {
              setGameOver(false);
            }}
          >
            <h1>Game Over due to negative balance!</h1>
          </Dialog>
        )}

        {money < 0 && (
          <Dialog
            onClose={() => {
              setGameOver(false);
              setMoney(0);
              setIsRegistered(false);
            }}
          >
            <h1>Game Over , Negative balance </h1>
          </Dialog>
        )}
      </main>
    </div>
  );
}

export default App;
