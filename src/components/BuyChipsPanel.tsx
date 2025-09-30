"use client";
import { useEffect, useMemo, useState } from 'react';
import { createPublicClient, createWalletClient, custom, http, parseUnits } from 'viem';
import { base } from 'viem/chains';
import { erc20Abi } from '~/abis/erc20';
import { bankAbi } from '~/abis/bank';

const DEGEN = process.env.NEXT_PUBLIC_DEGEN_ADDRESS as `0x${string}`;
const BANK  = process.env.NEXT_PUBLIC_BANK_ADDRESS  as `0x${string}`;

export default function BuyChipsPanel() {
  const [decimals, setDecimals] = useState<number>(18);
  const [symbol, setSymbol] = useState<string>('DEGEN');
  const [addr, setAddr] = useState<`0x${string}`|null>(null);
  const [amount, setAmount] = useState('10');
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [status, setStatus] = useState('');

  const pc = useMemo(() => createPublicClient({ chain: base, transport: http() }), []);
  const wc = useMemo(() => {
    const eth = (globalThis as any).ethereum;
    return eth ? createWalletClient({ chain: base, transport: custom(eth) }) : null;
  }, []);

  const parsed = useMemo(() => {
    try { return parseUnits(amount || '0', decimals); } catch { return 0n; }
  }, [amount, decimals]);

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const [d, s] = await Promise.all([
          pc.readContract({ address: DEGEN, abi: erc20Abi, functionName: 'decimals' }) as Promise<number>,
          pc.readContract({ address: DEGEN, abi: erc20Abi, functionName: 'symbol' })   as Promise<string>,
        ]);
        if (stop) return;
        setDecimals(d); setSymbol(s);

        const addrs = await (wc as any)?.getAddresses?.();
        const user = addrs?.[0] as `0x${string}` | undefined;
        setAddr(user ?? null);

        if (user) {
          const a = await pc.readContract({
            address: DEGEN, abi: erc20Abi, functionName: 'allowance', args: [user, BANK]
          }) as bigint;
          if (!stop) setAllowance(a);
        }
      } catch {/* ignore */}
    })();

    const id = setInterval(() => {
      if (!addr) return;
      pc.readContract({ address: DEGEN, abi: erc20Abi, functionName: 'allowance', args: [addr, BANK] })
        .then(a => setAllowance(a as bigint)).catch(()=>{});
    }, 8000);

    return () => { stop = true; clearInterval(id); };
  }, [pc, wc, addr]);

  const needsApproval = allowance < parsed;
  const disabled = !addr || parsed === 0n;

  async function onApprove() {
    if (!wc || !addr) return;
    setStatus('Approving…');
    try {
      const hash = await wc.writeContract({ address: DEGEN, abi: erc20Abi, functionName: 'approve', args: [BANK, parsed] });
      setStatus('Approval tx sent…');
      await pc.waitForTransactionReceipt({ hash });
      setStatus('Approved ✓');
      const a = await pc.readContract({ address: DEGEN, abi: erc20Abi, functionName: 'allowance', args: [addr, BANK] }) as bigint;
      setAllowance(a);
    } catch (e:any) {
      setStatus(`Approval error: ${e.shortMessage || e.message}`);
    }
  }

  async function onBuy() {
    if (!wc || !addr) return;
    setStatus('Buying…');
    try {
      const hash = await wc.writeContract({ address: BANK, abi: bankAbi, functionName: 'buyChips', args: [parsed] });
      setStatus('Buy tx sent…');
      await pc.waitForTransactionReceipt({ hash });
      setStatus('Purchased ✓');
    } catch (e:any) {
      setStatus(`Buy error: ${e.shortMessage || e.message}`);
    }
  }

  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm grid gap-3">
      <div className="text-sm text-zinc-600">Buy $CHIPS with ${symbol} (Base)</div>
      <label className="text-sm text-zinc-600">Amount ({symbol})</label>
      <input
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
        className="w-full rounded-xl border p-2"
        placeholder="10"
        inputMode="decimal"
      />
      {needsApproval ? (
        <button onClick={onApprove} disabled={disabled}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90 disabled:opacity-50">
          Approve
        </button>
      ) : (
        <button onClick={onBuy} disabled={disabled}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:opacity-90 disabled:opacity-50">
          Buy CHIPS
        </button>
      )}
      {status && <div className="text-sm text-zinc-700">{status}</div>}
    </div>
  );
}

