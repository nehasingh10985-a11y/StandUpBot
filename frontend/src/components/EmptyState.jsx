function EmptyState({ message }) {
  return (
    <div className="text-center py-16 bg-white border border-[#E2DDD5] rounded-xl">
      <p className="text-3xl mb-3">📋</p>
      <p className="text-[#888] text-sm">{message}</p>
    </div>
  );
}

export default EmptyState;
