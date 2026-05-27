function BlockerBanner({ blockedStandups }) {
  if (blockedStandups.length === 0) return null;

  const critical = blockedStandups.filter(
    (s) => s.aiSummary?.severity === "critical",
  );

  // Sirf critical blockers banner mein dikhao
  if (critical.length === 0) return null;

  return (
    <div className="flex gap-3 bg-[#FAECE7] border border-[#F5C4B3] rounded-lg p-3 mb-5">
      <span className="text-lg shrink-0">🚨</span>
      <div>
        <p className="text-[10px] font-medium text-[#D85A30] tracking-widest uppercase mb-1">
          Manager Action Required
        </p>
        {critical.map((s) => (
          <p key={s._id} className="text-xs text-[#993C1D] mt-1">
            <strong>{s.name}:</strong> {s.aiSummary?.actionNeeded || s.blockers}
          </p>
        ))}
      </div>
    </div>
  );
}

export default BlockerBanner;
