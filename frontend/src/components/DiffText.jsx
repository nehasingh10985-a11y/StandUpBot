function computeDiff(oldLines, newLines) {
  const m = oldLines.length;
  const n = newLines.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        oldLines[i - 1] === newLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result = [];
  let i = m,
    j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: "unchanged", text: newLines[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", text: newLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: "removed", text: oldLines[i - 1] });
      i--;
    }
  }
  return result;
}

function DiffText({ oldText, newText }) {
  if (!oldText || oldText === newText) {
    return (
      <p className="text-[11px] text-[#3a3a3a] leading-relaxed font-mono">
        {newText}
      </p>
    );
  }

  const diff = computeDiff(oldText.split("\n"), newText.split("\n"));

  return (
    <div className="flex flex-col gap-0.5">
      {diff.map((line, i) => {
        if (line.type === "removed") {
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 bg-[#FAECE7] rounded px-1.5 py-0.5"
            >
              <span className="text-[#D85A30] text-[10px] font-mono mt-0.5 shrink-0">
                −
              </span>
              <p className="text-[11px] text-[#D85A30] leading-relaxed font-mono line-through">
                {line.text}
              </p>
            </div>
          );
        }

        if (line.type === "added") {
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 bg-[#E1F5EE] rounded px-1.5 py-0.5"
            >
              <span className="text-[#1D9E75] text-[10px] font-mono mt-0.5 shrink-0">
                +
              </span>
              <p className="text-[11px] text-[#1D9E75] leading-relaxed font-mono">
                {line.text}
              </p>
            </div>
          );
        }

        return (
          <div key={i} className="px-1.5 py-0.5">
            <p className="text-[11px] text-[#3a3a3a] leading-relaxed font-mono">
              {line.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default DiffText;
