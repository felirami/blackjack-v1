"use client";
import { useLocalStorage } from './useLocalStorage';

type Stats = {
  hands: number; wins: number; losses: number; pushes: number;
  netChips: number; // +/-
};
const init: Stats = { hands:0, wins:0, losses:0, pushes:0, netChips:0 };

export default function StatsScreen({ go }: { go:(v:string)=>void }) {
  const [stats] = useLocalStorage<Stats>('bj_stats', init);

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border p-4 bg-white">
        <h2 className="text-lg font-bold mb-3">Your stats</h2>
        <ul className="grid gap-2 text-sm">
          <li className="flex justify-between"><span>Hands played</span><span className="font-semibold">{stats.hands}</span></li>
          <li className="flex justify-between"><span>Wins</span><span className="font-semibold">{stats.wins}</span></li>
          <li className="flex justify-between"><span>Losses</span><span className="font-semibold">{stats.losses}</span></li>
          <li className="flex justify-between"><span>Pushes</span><span className="font-semibold">{stats.pushes}</span></li>
          <li className="flex justify-between"><span>Net CHIPS</span><span className={`${stats.netChips>=0?'text-emerald-600':'text-red-600'} font-semibold`}>{stats.netChips}</span></li>
        </ul>
      </div>
      <button onClick={()=>go('play')}
        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">
        Back to Table
      </button>
      <button onClick={()=>go('home')} className="text-sm text-indigo-600 underline">Back to Home</button>
    </div>
  );
}

