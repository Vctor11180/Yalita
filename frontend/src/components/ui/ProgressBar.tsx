export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 bg-quipu-text/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-quipu-primary transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
