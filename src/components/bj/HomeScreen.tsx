"use client";
import TokenBalance from '~/components/TokenBalance';

const DEGEN = process.env.NEXT_PUBLIC_DEGEN_ADDRESS as `0x${string}` | undefined;
const CHIPS = process.env.NEXT_PUBLIC_CHIPS_ADDRESS as `0x${string}` | undefined;

export default function HomeScreen({ go }: { go: (v:string)=>void }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        <h2 className="text-lg font-bold mb-1">Blackjack with $CHIPS</h2>
        <p className="text-sm text-zinc-600">
          Buy $CHIPS with $DEGEN, place your bet like in a casino, and play right here.
        </p>
      </div>

      <div className="grid gap-3">
        {DEGEN && <TokenBalance token={DEGEN} label="$DEGEN Balance" />}
        {CHIPS && <TokenBalance token={CHIPS} label="$CHIPS Balance" />}
      </div>

      <button onClick={()=>go('play')}
        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">
        Play
      </button>

      <div className="text-center">
        <button onClick={()=>go('deposit')} className="text-sm text-indigo-600 underline">Deposit $CHIPS</button>
        <span className="mx-2">·</span>
        <button onClick={()=>go('stats')} className="text-sm text-indigo-600 underline">View Stats</button>
      </div>
    </div>
  );
}

