export default function BusinessTip({ tip }: { tip: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm animate-fade-in-up">
      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-lg">
        ⭐
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-bold text-amber-900">Pro Tip: </span>
        <span className="text-sm text-amber-800 leading-relaxed">{tip}</span>
      </div>
    </div>
  );
}
