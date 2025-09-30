"use client";
import BuyChipsPanel from '~/components/BuyChipsPanel';

export default function DepositScreen({ go }: { go:(v:string)=>void }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border p-4 bg-white">
        <h2 className="text-lg font-bold mb-1">Deposit $CHIPS</h2>
        <p className="text-sm text-zinc-600 mb-2">
          Swap $DEGEN for $CHIPS via the Bank contract. Approve first, then Buy.
        </p>
        <BuyChipsPanel />
      </div>

      <button onClick={()=>go('play')}
        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">
        Back to Table
      </button>
      <button onClick={()=>go('home')} className="text-sm text-indigo-600 underline">Back to Home</button>
    </div>
  );
}
