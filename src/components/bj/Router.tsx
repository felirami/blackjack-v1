"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import HomeScreen from './HomeScreen';
import PlayScreen from './PlayScreen';
import PlayAfterScreen from './PlayAfterScreen';
import DepositScreen from './DepositScreen';
import StatsScreen from './StatsScreen';
import { useLocalStorage } from './useLocalStorage';

type Stats = { hands:number; wins:number; losses:number; pushes:number; netChips:number };
const initStats: Stats = { hands:0, wins:0, losses:0, pushes:0, netChips:0 };

export default function BJRouter() {
  const router = useRouter();
  const q = useSearchParams();
  const [, setStats] = useLocalStorage<Stats>('bj_stats', initStats);

  const view = q.get('view') || 'home';
  function go(next: string, extra?: any) {
    const params = new URLSearchParams(q.toString());
    params.set('view', next);
    if (extra?.outcome) params.set('outcome', extra.outcome);
    if (extra?.bet != null) params.set('bet', String(extra.bet));
    router.replace(`?${params.toString()}`);
    if (next === 'play-after' && extra) {
      setStats(s => {
        const ns = { ...s, hands: s.hands + 1 };
        if (extra.outcome === 'win') { ns.wins++; ns.netChips += extra.bet; }
        else if (extra.outcome === 'lose') { ns.losses++; ns.netChips -= extra.bet; }
        else { ns.pushes++; }
        return ns;
      });
    }
  }

  if (view === 'play') return <PlayScreen go={go} />;
  if (view === 'play-after') {
    const outcome = (q.get('outcome') as 'win'|'lose'|'push') || 'push';
    const bet = Number(q.get('bet') || 0);
    return <PlayAfterScreen outcome={outcome} bet={bet} go={go} />;
  }
  if (view === 'deposit') return <DepositScreen go={go} />;
  if (view === 'stats') return <StatsScreen go={go} />;
  return <HomeScreen go={go} />;
}

