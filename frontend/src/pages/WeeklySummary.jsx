import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeeklySummaries,
  generateSummary,
} from "../store/slices/weeklySlice";
import LoadingState from "../components/LoadingState";

// ✅ FIXED: Real ISO week number — idx+1 ki jagah
const getWeekNum = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
};

function WeeklySummary() {
  const dispatch = useDispatch();
  const { summaries, loading, generating, error } = useSelector(
    (state) => state.weekly,
  );

  useEffect(() => {
    dispatch(fetchWeeklySummaries());
  }, [dispatch]);

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#E2DDD5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-[6px] h-[6px] rounded-full bg-[#1D9E75] inline-block animate-pulse" />
            <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono">
              weekly summary
            </p>
          </div>
          <h1 className="text-[18px] font-medium text-[#0f0f0f]">
            Team Performance Report
          </h1>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => dispatch(generateSummary())}
          disabled={generating}
          className="flex items-center gap-2 bg-white border border-[#E2DDD5] rounded-lg px-4 py-2 text-xs font-medium text-[#0f0f0f] hover:bg-[#F7F5F0] disabled:opacity-50 transition-colors cursor-pointer font-mono"
        >
          {generating ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f] animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f] animate-bounce [animation-delay:0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f0f0f] animate-bounce [animation-delay:0.3s]" />
            </>
          ) : (
            <>
              <i
                className="ti ti-cpu"
                style={{ fontSize: 14 }}
                aria-hidden="true"
              />
              Generate Now
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-[#D85A30] bg-[#FAECE7] border border-[#F5C4B3] rounded-lg px-4 py-3 mb-4 font-mono">
          {error}
        </p>
      )}

      {/* Top Metrics */}
      {summaries.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-5">
          <div className="bg-[#F7F5F0] rounded-lg p-3">
            <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
              Total
            </p>
            <p className="text-[20px] font-medium text-[#0f0f0f] leading-none mb-1">
              {summaries[0].totalStandups}
            </p>
            <p className="text-[10px] text-[#888] font-mono">standups</p>
          </div>
          <div className="bg-[#F7F5F0] rounded-lg p-3">
            <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
              Blockers
            </p>
            <p className="text-[20px] font-medium text-[#D85A30] leading-none mb-1">
              {summaries[0].totalBlockers}
            </p>
            <p className="text-[10px] text-[#888] font-mono">this week</p>
          </div>
          <div className="bg-[#F7F5F0] rounded-lg p-3">
            <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
              Most Active
            </p>
            <p className="text-[14px] font-medium text-[#185FA5] leading-none mb-1 truncate">
              {summaries[0].mostActive?.split(" ")[0] || "N/A"}
            </p>
            <p className="text-[10px] text-[#888] font-mono">top member</p>
          </div>
          <div className="bg-[#F7F5F0] rounded-lg p-3">
            <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
              Blocker Rate
            </p>
            <p className="text-[20px] font-medium text-[#0f0f0f] leading-none mb-1">
              {summaries[0].totalStandups
                ? Math.round(
                    (summaries[0].totalBlockers / summaries[0].totalStandups) *
                      100,
                  )
                : 0}
              %
            </p>
            <p className="text-[10px] text-[#888] font-mono">of standups</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {summaries.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F5F0] border border-[#E2DDD5] rounded-xl">
          <i
            className="ti ti-chart-bar"
            style={{
              fontSize: 28,
              color: "#bbb",
              display: "block",
              marginBottom: 8,
            }}
            aria-hidden="true"
          />
          <p className="text-[#888] text-sm mb-1">No weekly summaries yet.</p>
          <p className="text-[#bbb] text-[11px] font-mono">
            Auto-generates every Friday · or click Generate Now
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {summaries.map((s, idx) => (
            <div
              key={s._id}
              className="bg-white border border-[#E2DDD5] rounded-xl overflow-hidden"
              style={{ opacity: idx === 0 ? 1 : 0.6 }}
            >
              {/* Dark Header */}
              <div className="bg-[#0f0f0f] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/30 tracking-widest uppercase font-mono mb-0.5">
                    weekly report
                  </p>
                  <p className="text-[13px] font-medium text-white font-mono">
                    {s.weekStart} → {s.weekEnd}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.slackSent && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] border border-[#5DCAA5]">
                      <i
                        className="ti ti-check"
                        style={{ fontSize: 10 }}
                        aria-hidden="true"
                      />{" "}
                      Slack sent
                    </span>
                  )}
                  {/* ✅ FIXED: Real ISO week number */}
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10 font-mono">
                    #W{getWeekNum(s.weekStart)}
                  </span>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 border-b border-[#E2DDD5]">
                <div className="p-3 border-r border-[#E2DDD5]">
                  <p className="text-[16px] font-medium text-[#0f0f0f] mb-0.5">
                    {s.totalStandups}
                  </p>
                  <p className="text-[10px] text-[#888] font-mono">standups</p>
                </div>
                <div className="p-3 border-r border-[#E2DDD5]">
                  <p className="text-[16px] font-medium text-[#D85A30] mb-0.5">
                    {s.totalBlockers}
                  </p>
                  <p className="text-[10px] text-[#888] font-mono">blockers</p>
                </div>
                <div className="p-3 border-r border-[#E2DDD5]">
                  <p className="text-[13px] font-medium text-[#0f0f0f] mb-0.5 truncate">
                    {s.mostActive || "N/A"}
                  </p>
                  <p className="text-[10px] text-[#888] font-mono">
                    most active
                  </p>
                </div>
                <div className="p-3">
                  <p
                    className={`text-[13px] font-medium mb-0.5 truncate ${
                      s.mostBlocked ? "text-[#D85A30]" : "text-[#1D9E75]"
                    }`}
                  >
                    {s.mostBlocked || "None"}
                  </p>
                  <p className="text-[10px] text-[#888] font-mono">
                    most blocked
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-4">
                {/* Overview */}
                {s.rawSummary && (
                  <div>
                    <p className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono mb-2 flex items-center gap-1.5">
                      <i
                        className="ti ti-file-text"
                        style={{ fontSize: 12 }}
                        aria-hidden="true"
                      />
                      week overview
                    </p>
                    <p className="text-[12px] text-[#888] font-mono leading-relaxed bg-[#F7F5F0] px-3 py-2.5 rounded-lg border-l-2 border-[#E2DDD5]">
                      {s.rawSummary}
                    </p>
                  </div>
                )}

                {/* Issues + Wins */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {s.criticalIssues?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono mb-2 flex items-center gap-1.5">
                        <i
                          className="ti ti-alert-triangle"
                          style={{ fontSize: 12 }}
                          aria-hidden="true"
                        />
                        critical issues
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {s.criticalIssues.map((issue, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-[#FAECE7] border border-[#F5C4B3] rounded-lg px-2.5 py-2"
                          >
                            <span className="text-[11px] text-[#D85A30] font-mono mt-0.5 shrink-0">
                              →
                            </span>
                            <p className="text-[11px] text-[#993C1D] font-mono leading-relaxed">
                              {issue}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {s.wins?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono mb-2 flex items-center gap-1.5">
                        <i
                          className="ti ti-circle-check"
                          style={{ fontSize: 12 }}
                          aria-hidden="true"
                        />
                        wins this week
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {s.wins.map((win, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-[#E1F5EE] border border-[#5DCAA5] rounded-lg px-2.5 py-2"
                          >
                            <span className="text-[11px] text-[#1D9E75] font-mono mt-0.5 shrink-0">
                              →
                            </span>
                            <p className="text-[11px] text-[#0F6E56] font-mono leading-relaxed">
                              {win}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Recommendation */}
                {s.aiRecommendation && (
                  <div>
                    <p className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono mb-2 flex items-center gap-1.5">
                      <i
                        className="ti ti-brain"
                        style={{ fontSize: 12 }}
                        aria-hidden="true"
                      />
                      ai recommendation
                    </p>
                    <div className="bg-[#0f0f0f] rounded-lg px-3 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-[5px] h-[5px] rounded-full bg-[#FAC775] inline-block" />
                        <span className="text-[10px] text-white/30 tracking-widest uppercase font-mono">
                          groq llama-3.3 · generated
                        </span>
                      </div>
                      <p className="text-[11px] text-white/55 font-mono leading-relaxed">
                        {s.aiRecommendation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeeklySummary;
