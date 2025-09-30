"use client";
import { useEffect, useState } from 'react';
import ChipPicker from './ChipPicker';
import BlackjackTable from '~/components/BlackjackTable';
import TokenBalance from '~/components/TokenBalance';

const CHIPS = process.env.NEXT_PUBLIC_CHIPS_ADDRESS as `0x${string}` | undefined;

export default function PlayScreen({ go }: { go:(v:string, extra?:any)=>void }) {
  const [bet, setBet] = useState<number>(10);
  const [last, setLast] = useState<'win'|'lose'|'push'|null>(null);

  useEffect(()=>{ setLast(null); }, []);

  return (
    <div className="grid gap-4">
      {/* CHIPS balance on top */}
      {CHIPS && <TokenBalance token={CHIPS} label="$CHIPS Balance" />}

      {/* Bet picker */}
      <div className="rounded-xl border p-3 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-zinc-600">Choose your bet (CHIPS)</div>
          <div className="text-sm font-semibold">{bet}</div>
        </div>
        <ChipPicker value={bet} onChange={setBet} options={[1,10,25,50,100]} />
      </div>

      {/* Table */}
      <BlackjackTable
        bet={bet}
        onHandEnd={(o)=>{ setLast(o); go('play-after', { outcome: o, bet }); }}
      />
    </div>
  );
}

