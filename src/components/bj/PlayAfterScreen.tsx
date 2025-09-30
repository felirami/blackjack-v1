"use client";
export default function PlayAfterScreen({
  outcome, bet, go,
}: { outcome:'win'|'lose'|'push'; bet:number; go:(v:string)=>void }) {
  const msg = outcome==='win' ? 'You won!' : outcome==='lose' ? 'You lost' : 'Push';
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border p-4 bg-white text-center">
        <div className="text-2xl font-bold mb-1">{msg}</div>
        <div className="text-sm text-zinc-600">Bet: {bet} CHIPS</div>
      </div>

      <button onClick={()=>go('play')}
        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">
        Play again
      </button>

      <div className="grid gap-2">
        <button onClick={()=>go('deposit')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:opacity-90">
          Deposit more $CHIPS
        </button>
        <button onClick={()=>go('stats')}
          className="px-4 py-2 rounded-xl bg-zinc-200 font-semibold hover:bg-zinc-300">
          View stats
        </button>
      </div>

      <button onClick={()=>go('home')} className="text-sm text-indigo-600 underline">Back to Home</button>
    </div>
  );
}

