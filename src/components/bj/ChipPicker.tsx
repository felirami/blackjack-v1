"use client";
export default function ChipPicker({
  value, onChange, options = [1,10,50,100],
}: { value: number; onChange: (v:number)=>void; options?: number[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(n => (
        <button key={n}
          onClick={() => onChange(n)}
          className={`px-3 py-2 rounded-full border font-semibold ${value===n ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-zinc-50'}`}>
          {n}
        </button>
      ))}
    </div>
  );
}

