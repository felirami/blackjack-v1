"use client";
/**
 * Center slot only. Shell/providers untouched.
 */
import BJRouter from '~/components/bj/Router';

export function HomeTab() {
  return (
    <div className="flex items-start justify-center h-[calc(100vh-200px)] px-6">
      <div className="w-full max-w-md mx-auto pt-6">
        <BJRouter />
      </div>
    </div>
  );
}
