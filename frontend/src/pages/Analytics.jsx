import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStandups } from "../store/slices/standupSlice";
import LoadingState from "../components/LoadingState";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Shared Role Config for consistent badging
const roleConfig = {
  "Frontend Developer": "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
  "Backend Developer": "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]",
  "Full Stack Developer": "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]",
  "DevOps Engineer": "bg-[#FAEEDA] text-[#633806] border-[#EF9F27]",
  "UI/UX Designer": "bg-[#FBEAF0] text-[#72243E] border-[#ED93B1]",
  "QA Engineer": "bg-[#EAF3DE] text-[#27500A] border-[#97C459]",
  "Product Manager": "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f0f] rounded-lg px-3 py-2 shadow-xl border border-[#333]">
        <p className="text-[10px] text-white/40 font-mono mb-1">{label}</p>
        {payload.map((p, i) => (
          <p
            key={i}
            className="text-[12px] font-medium"
            style={{ color: p.color }}
          >
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function Analytics() {
  const dispatch = useDispatch();
  const { standups, loading } = useSelector((state) => state.standup);

  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);

  // ── Daily Chart Data ───────────────────────
  const dailyData = standups.reduce((acc, s) => {
    const date = new Date(s.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.standups += 1;
      if (s.blockers && s.blockers.trim() !== "") existing.blockers += 1;
    } else {
      acc.push({
        date,
        standups: 1,
        blockers: s.blockers && s.blockers.trim() !== "" ? 1 : 0,
      });
    }
    return acc;
  }, []);

  // ── Severity Data ──────────────────────────
  const severityData = [
    {
      name: "Critical",
      value: standups.filter(
        (s) => s.aiSummary?.severity?.toLowerCase() === "critical",
      ).length,
      color: "#D85A30",
      bg: "bg-[#FAECE7]",
      text: "text-[#993C1D]",
      border: "border-[#F5C4B3]",
    },
    {
      name: "Moderate",
      value: standups.filter(
        (s) => s.aiSummary?.severity?.toLowerCase() === "moderate",
      ).length,
      color: "#BA7517",
      bg: "bg-[#FAEEDA]",
      text: "text-[#854F0B]",
      border: "border-[#EF9F27]",
    },
    {
      name: "Watch",
      value: standups.filter(
        (s) => s.aiSummary?.severity?.toLowerCase() === "watch",
      ).length,
      color: "#185FA5",
      bg: "bg-[#E6F1FB]",
      text: "text-[#0C447C]",
      border: "border-[#85B7EB]",
    },
    {
      name: "On Track",
      value: standups.filter(
        (s) =>
          s.aiSummary?.severity?.toLowerCase() === "none" ||
          !s.aiSummary?.severity,
      ).length,
      color: "#1D9E75",
      bg: "bg-[#E1F5EE]",
      text: "text-[#0F6E56]",
      border: "border-[#5DCAA5]",
    },
  ].filter((d) => d.value > 0);

  // ── Member Stats ───────────────────────────
  const memberStats = standups
    .reduce((acc, s) => {
      const existing = acc.find((m) => m.name === s.name);
      if (existing) {
        existing.standups += 1;
        if (s.blockers && s.blockers.trim() !== "") existing.blockers += 1;
        if (!existing.role && s.role) existing.role = s.role; // Capture role if it was missing
        if (!existing.teamName && s.teamName) existing.teamName = s.teamName; // Capture teamName if missing
      } else {
        acc.push({
          name: s.name,
          role: s.role, // Save the role here
          teamName: s.teamName, // Save the teamName here
          standups: 1,
          blockers: s.blockers && s.blockers.trim() !== "" ? 1 : 0,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.standups - a.standups);

  // ── Summary ────────────────────────────────
  const totalStandups = standups.length;
  const totalBlockers = standups.filter(
    (s) => s.blockers && s.blockers.trim() !== "",
  ).length;
  const blockerRate = totalStandups
    ? Math.round((totalBlockers / totalStandups) * 100)
    : 0;
  const mostActive = memberStats[0];

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#E2DDD5]">
        <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
          team overview
        </p>
        <h1 className="text-[22px] font-semibold text-[#0f0f0f] tracking-tight">
          Analytics
        </h1>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#0f0f0f] rounded-xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-white/40 tracking-widest uppercase font-mono mb-2 group-hover:text-white/60 transition-colors">
            Total
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[24px] font-semibold text-white leading-none">
              {totalStandups}
            </p>
            <p className="text-[10px] text-white/40 font-mono pb-0.5">
              standups
            </p>
          </div>
        </div>

        <div className="bg-[#FAECE7] border border-[#F5C4B3] rounded-xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-[#D85A30]/60 tracking-widest uppercase font-mono mb-2 group-hover:text-[#D85A30]/80 transition-colors">
            Blocked
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[24px] font-semibold text-[#D85A30] leading-none">
              {totalBlockers}
            </p>
            <p className="text-[10px] text-[#D85A30]/60 font-mono pb-0.5">
              blockers
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E2DDD5] rounded-xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-2 group-hover:text-[#555] transition-colors">
            Rate
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[24px] font-semibold text-[#0f0f0f] leading-none">
              {blockerRate}%
            </p>
            <p className="text-[10px] text-[#888] font-mono pb-0.5">blocked</p>
          </div>
        </div>

        <div className="bg-[#E1F5EE] border border-[#5DCAA5] rounded-xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-[#1D9E75]/60 tracking-widest uppercase font-mono mb-2 group-hover:text-[#1D9E75]/80 transition-colors">
            Top
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[18px] font-semibold text-[#0F6E56] leading-none truncate max-w-[70px]">
              {mostActive?.name.split(" ")[0] || "N/A"}
            </p>
            <p className="text-[10px] text-[#1D9E75]/60 font-mono pb-0.5">
              active
            </p>
          </div>
        </div>
      </div>

      {/* Area Chart — Daily Standups */}
      <div className="bg-white border border-[#E2DDD5] rounded-xl p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[14px] font-semibold text-[#0f0f0f]">
              Daily Activity
            </p>
            <p className="text-[11px] text-[#888] font-mono mt-0.5">
              Standups vs Blockers
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#F7F5F0] px-3 py-1.5 rounded-lg border border-[#E2DDD5]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#0f0f0f]" />
              <span className="text-[10px] font-mono text-[#888]">
                Standups
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#D85A30]" />
              <span className="text-[10px] font-mono text-[#888]">
                Blockers
              </span>
            </div>
          </div>
        </div>

        {dailyData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[180px] border border-dashed border-[#E2DDD5] rounded-lg bg-[#F7F5F0]">
            <i className="ti ti-chart-line text-[24px] text-[#bbb] mb-2" />
            <p className="text-[#888] text-[12px] font-mono">No data yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="standupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f0f0f" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#0f0f0f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blockerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D85A30" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#D85A30" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#888", fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#888", fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="standups"
                name="Standups"
                stroke="#0f0f0f"
                strokeWidth={2}
                fill="url(#standupGrad)"
                dot={{ fill: "#0f0f0f", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="blockers"
                name="Blockers"
                stroke="#D85A30"
                strokeWidth={2}
                fill="url(#blockerGrad)"
                dot={{ fill: "#D85A30", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Severity Breakdown */}
        <div className="bg-white border border-[#E2DDD5] rounded-xl p-5 shadow-sm">
          <p className="text-[14px] font-semibold text-[#0f0f0f] mb-1">
            Severity Breakdown
          </p>
          <p className="text-[11px] text-[#888] font-mono mb-5">
            AI classification
          </p>

          {severityData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[140px] border border-dashed border-[#E2DDD5] rounded-lg bg-[#F7F5F0]">
              <p className="text-[#888] text-[12px] font-mono">No data yet.</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-col gap-2 mt-4">
                {severityData.map((s) => (
                  <div
                    key={s.name}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border ${s.bg} ${s.border}`}
                  >
                    <span className={`text-[11px] font-semibold ${s.text}`}>
                      {s.name}
                    </span>
                    <span
                      className={`text-[12px] font-mono font-medium ${s.text}`}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Member Activity */}
        <div className="bg-white border border-[#E2DDD5] rounded-xl p-5 shadow-sm">
          <p className="text-[14px] font-semibold text-[#0f0f0f] mb-1">
            Member Activity
          </p>
          <p className="text-[11px] text-[#888] font-mono mb-5">
            Submissions & Roles
          </p>

          {memberStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[140px] border border-dashed border-[#E2DDD5] rounded-lg bg-[#F7F5F0]">
              <p className="text-[#888] text-[12px] font-mono">No data yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {memberStats.map((member, index) => (
                <div key={member.name} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <span className="text-[10px] font-mono text-[#bbb] w-3">
                        {index + 1}
                      </span>

                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-[#F7F5F0] border border-[#E2DDD5] text-[#0f0f0f] flex items-center justify-center text-[12px] font-semibold shadow-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name, Team & Role */}
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-medium text-[#0f0f0f]">
                            {member.name}
                          </span>

                          {/* Team Name Badge Added Here */}
                          <span className="text-[9px] text-[#555] font-mono bg-black/[0.08] px-1.5 py-0.5 rounded uppercase shrink-0 font-semibold tracking-wide">
                            {member.teamName ? member.teamName : "NO TEAM"}
                          </span>

                          {/* Blocker Pill */}
                          {member.blockers > 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-[#D85A30] bg-[#FAECE7] font-mono shrink-0">
                              {member.blockers} Blocked
                            </span>
                          )}
                        </div>

                        {/* Developer Role Field */}
                        {member.role ? (
                          <span
                            className={`text-[9px] font-medium px-2 py-[2px] rounded-full border inline-block font-mono w-fit
                              ${roleConfig[member.role] || "bg-[#F7F5F0] text-[#888] border-[#E2DDD5]"}`}
                          >
                            {member.role
                              .replace(" Developer", " Dev")
                              .replace(" Engineer", " Eng")}
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#bbb] font-mono italic">
                            No role
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Standup Count */}
                    <div className="text-right">
                      <span className="text-[14px] font-semibold text-[#0f0f0f] block leading-none">
                        {member.standups}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#F7F5F0] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0f0f0f] h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(member.standups / memberStats[0].standups) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
