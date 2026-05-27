import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStandups } from "../store/slices/standupSlice";
import StandupCard from "../components/StandupCard";
import LoadingState from "../components/LoadingState";

function Dashboard() {
  const dispatch = useDispatch();
  const { standups, loading, error } = useSelector((state) => state.standup);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);

  const applyDateFilter = (standup) => {
    const now = new Date();
    const created = new Date(standup.createdAt);
    if (dateFilter === "today")
      return created.toDateString() === now.toDateString();
    if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return created >= weekAgo;
    }
    if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setDate(now.getDate() - 30);
      return created >= monthAgo;
    }
    return true;
  };

  const filtered = standups
    .filter(applyDateFilter)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const blocked = filtered.filter(
    (s) => s.blockers && s.blockers.trim() !== "",
  );
  const onTrack = filtered.filter(
    (s) => !s.blockers || s.blockers.trim() === "",
  );
  const critical = filtered.filter((s) => {
    const severity = s.aiSummary?.severity || s.severity || "";
    return severity.toLowerCase() === "critical";
  });

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="bg-[#FAECE7] border border-[#F5C4B3] rounded-lg px-4 py-3 flex items-center gap-3">
        <i className="ti ti-alert-circle text-[#993C1D] text-lg" />
        <p className="text-[12px] text-[#993C1D] font-mono">Error: {error}</p>
      </div>
    );
  }

  const filterButtons = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-[#E2DDD5]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#0f0f0f] tracking-tight">
            {user ? `Hey, ${user.name.split(" ")[0]} 👋` : "Team Dashboard"}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[#888] font-mono bg-[#F7F5F0] px-3 py-1.5 rounded-lg border border-[#E2DDD5]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {/* Total */}
        <div className="bg-[#0f0f0f] rounded-xl p-3.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-white/40 tracking-widest uppercase font-mono mb-2 group-hover:text-white/60 transition-colors">
            Total
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[24px] font-semibold text-white leading-none">
              {filtered.length}
            </p>
            <p className="text-[10px] text-white/40 font-mono pb-0.5">
              submitted
            </p>
          </div>
        </div>

        {/* Blocked */}
        <div className="bg-[#FAECE7] border border-[#F5C4B3] rounded-xl p-3.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-[#D85A30]/60 tracking-widest uppercase font-mono mb-2 group-hover:text-[#D85A30]/80 transition-colors">
            Blocked
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[24px] font-semibold text-[#D85A30] leading-none">
              {blocked.length}
            </p>
            <p className="text-[10px] text-[#D85A30]/60 font-mono pb-0.5">
              blockers
            </p>
          </div>
        </div>

        {/* On Track */}
        <div className="bg-[#E1F5EE] border border-[#5DCAA5] rounded-xl p-3.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-[#1D9E75]/60 tracking-widest uppercase font-mono mb-2 group-hover:text-[#1D9E75]/80 transition-colors">
            Clear
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[24px] font-semibold text-[#1D9E75] leading-none">
              {onTrack.length}
            </p>
            <p className="text-[10px] text-[#1D9E75]/60 font-mono pb-0.5">
              on track
            </p>
          </div>
        </div>

        {/* Critical */}
        <div className="bg-[#F7F5F0] border border-[#E2DDD5] rounded-xl p-3.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-2 group-hover:text-[#555] transition-colors">
            Urgent
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[24px] font-semibold text-[#0f0f0f] leading-none">
              {critical.length}
            </p>
            <p className="text-[10px] text-[#888] font-mono pb-0.5">critical</p>
          </div>
        </div>
      </div>

      {/* Filter + Search Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        {/* Segmented Control */}
        <div className="flex bg-[#F7F5F0] p-1 rounded-lg border border-[#E2DDD5] w-full sm:w-auto">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setDateFilter(btn.value)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-[11px] font-medium transition-all font-mono
                ${
                  dateFilter === btn.value
                    ? "bg-white text-[#0f0f0f] shadow-sm border border-[#E2DDD5]"
                    : "text-[#888] hover:text-[#0f0f0f] border border-transparent"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full group">
          <i
            className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[#888] group-focus-within:text-[#0f0f0f] transition-colors"
            style={{ fontSize: 14 }}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E2DDD5] rounded-lg pl-9 pr-4 py-2 text-[12px] outline-none text-[#0f0f0f] placeholder:text-[#bbb] font-mono focus:border-[#0f0f0f] focus:ring-2 focus:ring-[#F7F5F0] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Critical Blocker Banner */}
      {critical.length > 0 && (
        <div className="flex gap-3 bg-[#FAECE7] border border-[#F5C4B3] rounded-xl p-4 mb-6 shadow-sm animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-[#D85A30] flex items-center justify-center shrink-0 relative">
            <span className="absolute inset-0 rounded-full bg-[#D85A30] animate-ping opacity-20" />
            <i
              className="ti ti-alert-triangle text-white"
              style={{ fontSize: 16 }}
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#D85A30] tracking-widest uppercase font-mono mb-2">
              manager action required
            </p>
            <div className="space-y-1.5">
              {critical.map((s) => (
                <div
                  key={s._id}
                  className="flex items-start gap-2 text-[12px] text-[#993C1D] font-mono bg-white/40 p-2 rounded-md border border-[#F5C4B3]/50"
                >
                  <span className="mt-0.5 text-[#D85A30] shrink-0">→</span>
                  <p>
                    <strong className="text-[#D85A30]">{s.name}:</strong>{" "}
                    {s.aiSummary?.actionNeeded || s.blockers}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-4">
        <p className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono whitespace-nowrap">
          {search
            ? `results for "${search}"`
            : `standups — ${filterButtons.find((b) => b.value === dateFilter)?.label}`}
        </p>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#E2DDD5] to-transparent" />
        <p className="text-[10px] font-semibold text-[#0f0f0f] bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#E2DDD5] font-mono">
          {filtered.length}
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#F7F5F0] border border-[#E2DDD5] rounded-xl border-dashed">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#E2DDD5]">
              <i
                className="ti ti-clipboard-x"
                style={{ fontSize: 24, color: "#bbb" }}
                aria-hidden="true"
              />
            </div>
            <p className="text-[#0f0f0f] font-medium mb-1">No updates found</p>
            <p className="text-[#888] text-xs font-mono">
              {search
                ? `Nobody matching "${search}" has posted.`
                : "Your team's updates will appear here."}
            </p>
          </div>
        ) : (
          filtered.map((standup) => (
            <StandupCard key={standup._id} standup={standup} />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
