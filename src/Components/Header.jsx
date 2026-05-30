import { useState } from "react";
import Dialog from "./Dialog";

let message = "";

export default function Header({ companyName, userName, money, setMoney,Gameover,logo,UserUpdateData,UserData }) {
  const [dialogOpen, setOpen] = useState(false);
  const [successMessage, setMessage] = useState(false);
  const [loan, setloan] = useState(0);
  const [repayLoan, setRepayLoan] = useState(0);
  // const [moneyUpdated, setmoney] = useState(money);
  const [limitLoan, setlimitLoan] = useState(0);



  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-slate-800 text-white h-16 shadow-lg">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <div>
          <span className="block font-bold text-lg leading-tight text-blue-400">
            {companyName}
          </span>
          <span className="text-xs text-slate-400">Manager: {userName}</span>
        </div>
      </div>

      {/* MIDDLE */}
      <h1 className="text-xl font-black tracking-widest uppercase hidden md:block">
        Bus Simulator Pro
      </h1>

      {/* RIGHT */}
      <div
        className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-md cursor-pointer hover:bg-emerald-500 transition-colors"
        onClick={() => setOpen(true)}
      >
        <span className="text-xl">💰</span>
        <span className="font-mono font-bold">
          ${money.toLocaleString()}
        </span>
      </div>
      {dialogOpen && (
        <Dialog
          onClose={() => {
            setOpen(false);
          }}
        >
          <h2 className="text-xl font-bold text-emerald-400">Bank Details</h2>
          <p className="mt-2 text-slate-300">
            Available Balance: ${money}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>🏦 Loan: ${loan}</li>
            <li>📈 Interest: 5%</li>
          </ul>
          <button
            className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
            onClick={() => {
              if (limitLoan > 5 || money<=0) {
                AddMessage("No loan available now ");
                if(money<0){
                  Gameover(true)
                  setOpen(false)
                } 
                setMessage(true);
              } else {
                setloan(loan + 10000);
                setMoney(money + 10000);
                AddMessage("You received 10000 ");
                setMessage(true);
                UserUpdateData({...UserData , bankDetails:{...UserData.bankDetails ,money:UserData.bankDetails.money+10000}})
                setlimitLoan(limitLoan + 1);
              }
            }}
          >
            Take loan
          </button>
          <button
            className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
            onClick={() => {
              if (loan > 0) {
                let tempMoney = (loan * 5) / 100;
                setloan(0);
                let tempDeductMoney = money - tempMoney - loan;
                setMoney(tempDeductMoney);
                AddMessage("You repaid loan");
                setMessage(true);
                UserUpdateData({...UserData , bankDetails:{...UserData.bankDetails ,money:UserData.bankDetails.money-tempDeductMoney}})

                setlimitLoan(3)
              }
            }}
          >
            Repay loan
          </button>
        </Dialog>
      )}
      {successMessage && (
        <Dialog onClose={() => setMessage(false)}>
          <h2>{message}</h2>
        </Dialog>
      )}
    </nav>
  );
}
function GetLoanDetails() {
  return Math.random() * 100;
}
function AddMessage(text) {
  message = text;
}
