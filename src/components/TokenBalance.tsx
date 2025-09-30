"use client";
import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { erc20Abi } from '~/abis/erc20';

export default function TokenBalance({ token, label }: { token: `0x${string}`; label: string }) {
  const { address } = useAccount();
  const client = usePublicClient();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!client || !address) { setValue(null); return; }
      try {
        const [decimals, raw] = await Promise.all([
          client.readContract({ address: token, abi: erc20Abi, functionName: 'decimals' }) as Promise<number>,
          client.readContract({ address: token, abi: erc20Abi, functionName: 'balanceOf', args: [address] }) as Promise<bigint>,
        ]);
        if (!cancelled) setValue(Number(formatUnits(raw, decimals)).toFixed(4));
      } catch {
        if (!cancelled) setValue('0.0000');
      }
    })();
    return () => { cancelled = true; };
  }, [client, address, token]);

  return (
    <div className="rounded-xl border p-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600">{label}</div>
        <div className="text-sm font-semibold">{value ?? (address ? '…' : 'Connect wallet')}</div>
      </div>
    </div>
  );
}
