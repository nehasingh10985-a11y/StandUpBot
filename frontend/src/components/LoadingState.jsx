function LoadingState() {
  return (
    <div className="flex items-center gap-2 py-8">
      <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f] animate-bounce" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f] animate-bounce [animation-delay:0.15s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f] animate-bounce [animation-delay:0.3s]" />
    </div>
  );
}

export default LoadingState;
