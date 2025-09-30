"use client";
import { useEffect, useMemo, useState } from 'react';

type Outcome = 'win' | 'lose' | 'push';

type Suit = '♠'|'♥'|'♦'|'♣';
type Rank = 'A'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K';
type Card = { rank: Rank; suit: Suit };

const RANKS: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SUITS: Suit[] = ['♠','♥','♦','♣'];

function buildShuffledDeck(): Card[] {
  const d: Card[] = [];
  for (const s of SUITS) for (const r of RANKS) d.push({ rank: r, suit: s });
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
}
function isRed(s: Suit) { return s === '♥' || s === '♦'; }
function val(rank: Rank){ if(rank==='A')return 11; if(['K','Q','J','10'].includes(rank))return 10; return parseInt(rank,10); }
function handValue(hand: Card[]) { let t=0,a=0; for(const c of hand){ t+=val(c.rank); if(c.rank==='A')a++; } while(t>21&&a>0){t-=10;a--;} return { total:t, soft:a>0 && t<=21 }; }
function isBJ(h: Card[]){ return h.length===2 && handValue(h).total===21; }

function CardPill({ c }: { c: Card }) {
  const red = isRed(c.suit);
  return (
    <div className={`px-3 py-2 rounded-xl border shadow-sm text-sm font-semibold bg-white ${red?'text-red-500 border-red-300':'text-zinc-800 border-zinc-300'}`}>
      {c.rank}{c.suit}
    </div>
  );
}
function FaceDown() {
  return (
    <div className="px-3 py-2 rounded-xl border border-zinc-300 shadow-sm bg-gradient-to-br from-zinc-200 to-zinc-300 w-[44px] h-[36px] grid place-items-center">
      <div className="w-5 h-5 rounded-md bg-zinc-400" />
    </div>
  );
}

export default function BlackjackTable({
  onHandEnd,
  bet = 0,
}: {
  onHandEnd?: (o: Outcome) => void;
  bet?: number;
}) {
  const [deck,setDeck]=useState<Card[]>([]);
  const [player,setPlayer]=useState<Card[]>([]);
  const [dealer,setDealer]=useState<Card[]>([]);
  const [dealerHidden,setDealerHidden]=useState(true);
  type Phase='idle'|'playing'|'dealer'|'result';
  const [phase,setPhase]=useState<Phase>('idle');
  const [result,setResult]=useState('');

  const pHV=useMemo(()=>handValue(player),[player]);
  const dHV=useMemo(()=>handValue(dealer),[dealer]);
  const canDouble = phase==='playing' && player.length===2;

  function deal(){
    const d=buildShuffledDeck();
    const p=[d.pop()!,d.pop()!];
    const dl=[d.pop()!,d.pop()!];
    setDeck(d); setPlayer(p); setDealer(dl);
    setDealerHidden(true); setResult(''); setPhase('playing');
    const pBJ=isBJ(p), dBJ=isBJ(dl);
    if(pBJ||dBJ){
      setTimeout(()=>{ setDealerHidden(false);
        let outcome: Outcome = 'push';
        if(pBJ&&dBJ){ setResult('Blackjack both — Push 🤝'); outcome='push'; }
        else if(pBJ){ setResult('Blackjack! You win 🎉'); outcome='win'; }
        else { setResult('Dealer Blackjack 😬'); outcome='lose'; }
        setPhase('result');
        if (onHandEnd) onHandEnd(outcome);
      },350);
    }
  }
  function hit(){
    if(phase!=='playing')return;
    const d=[...deck]; const next=d.pop(); if(!next)return;
    const p=[...player,next]; setPlayer(p); setDeck(d);
    if(handValue(p).total>21){ setDealerHidden(false); setResult('You busted 😵'); setPhase('result'); if(onHandEnd) onHandEnd('lose'); }
  }
  function stand(){ if(phase!=='playing')return; setDealerHidden(false); setPhase('dealer'); }
  function doubleDown(){
    if(!canDouble) return;
    const d=[...deck]; const next=d.pop(); if(!next)return;
    const p=[...player,next]; setPlayer(p); setDeck(d);
    if(handValue(p).total>21){ setDealerHidden(false); setResult('You busted on Double 😵'); setPhase('result'); if(onHandEnd) onHandEnd('lose'); }
    else { setDealerHidden(false); setPhase('dealer'); }
  }

  useEffect(()=>{ if(phase!=='dealer')return; let cancelled=false;
    (async()=>{ let d=[...deck], dl=[...dealer];
      while(!cancelled){ const hv=handValue(dl); if(hv.total>=17) break;
        await new Promise(r=>setTimeout(r,380));
        const take=d.pop(); if(!take) break; dl=[...dl,take]; setDealer(dl); setDeck(d);
      }
      const pv=handValue(player).total, dv=handValue(dl).total;
      let r='';
      let outcome: Outcome = 'push';
      if (dv > 21) { r = 'Dealer busts — You win! 🎉'; outcome = 'win'; }
      else if (pv > dv) { r = 'You win! 🎉'; outcome = 'win'; }
      else if (pv < dv) { r = 'Dealer wins 😬'; outcome = 'lose'; }
      else { r = 'Push 🤝'; outcome = 'push'; }
      setResult(r); setPhase('result');
      if (onHandEnd) onHandEnd(outcome);
    })(); return()=>{cancelled=true};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[phase]);

  return (
    <div className="w-full max-w-[520px] mx-auto grid gap-4">
      {/* Dealer */}
      <div className="bg-zinc-900 text-white rounded-2xl p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Dealer</h3>
          <span className="opacity-80">Total: {dealerHidden && phase==='playing' ? '？' : dHV.total}{(!dealerHidden||phase!=='playing') && dHV.soft ? ' (soft)': ''}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {dealer.map((c,i)=> (i===1 && dealerHidden && phase==='playing') ? <FaceDown key="down"/> : <CardPill key={i} c={c}/>)}
        </div>
      </div>

      {/* Player */}
      <div className="bg-white rounded-2xl p-4 shadow border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">You</h3>
          <span className="text-zinc-600">Total: {pHV.total}{pHV.soft ? ' (soft)' : ''}</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-3">{player.map((c,i)=><CardPill key={i} c={c} />)}</div>

        <div className="flex flex-wrap gap-2">
          {phase==='idle' && <button onClick={deal} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">Deal</button>}
          {phase==='playing' && <>
            <button onClick={hit} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">Hit</button>
            <button onClick={stand} className="px-4 py-2 rounded-xl bg-zinc-200 font-semibold hover:bg-zinc-300">Stand</button>
            <button onClick={doubleDown} disabled={!canDouble} className={`px-4 py-2 rounded-xl font-semibold ${canDouble?'bg-amber-500 text-white hover:opacity-90':'bg-zinc-100 text-zinc-400'}`}>Double</button>
          </>}
          {phase==='result' && <button onClick={()=>{setPhase('idle'); setResult(''); setPlayer([]); setDealer([]);}} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90">New Hand</button>}
        </div>

        {result && <div className="text-center text-base font-semibold mt-3">{result}</div>}
      </div>
    </div>
  );
}
