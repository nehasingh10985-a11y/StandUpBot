function MetricCard({ value, label, color }) {
  const colorMap = {
    default: "text-[#0f0f0f]",
    red: "text-[#D85A30]",
    green: "text-[#1D9E75]",
  };

  return (
    <div className="bg-white border border-[#E2DDD5] rounded-lg p-3">
      <div
        className={`text-2xl font-medium mb-0.5 ${colorMap[color] || colorMap.default}`}
      >
        {value}
      </div>
      <div className="text-[11px] text-[#888]">{label}</div>
    </div>
  );
}

export default MetricCard;
