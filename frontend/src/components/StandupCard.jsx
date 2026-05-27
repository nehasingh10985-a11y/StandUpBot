import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteStandup } from "../store/slices/standupSlice";
import { FiEdit2, FiTrash2, FiCheckSquare } from "react-icons/fi";
import EditModal from "./EditModal";
import DiffText from "./DiffText";

const severityConfig = {
  critical: {
    pill: "bg-[#FAECE7] text-[#993C1D] border-[#F0997B]",
    label: "🚨 Critical",
    headerBg: "bg-[#FAECE7]",
    blockerBg: "bg-[#FAECE7]",
    blockerText: "text-[#D85A30]",
    border: "border-[#F5C4B3]",
  },
  moderate: {
    pill: "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
    label: "⚠️ Moderate",
    headerBg: "bg-[#FAEEDA]",
    blockerBg: "bg-[#FAEEDA]",
    blockerText: "text-[#BA7517]",
    border: "border-[#EF9F27]",
  },
  watch: {
    pill: "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]",
    label: "👀 Watch",
    headerBg: "bg-[#E6F1FB]",
    blockerBg: "bg-[#E6F1FB]",
    blockerText: "text-[#185FA5]",
    border: "border-[#85B7EB]",
  },
  none: {
    pill: "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
    label: "✅ On Track",
    headerBg: "bg-white",
    blockerBg: "",
    blockerText: "text-[#bbb]",
    border: "border-[#E2DDD5]",
  },
};

function StandupCard({ standup }) {
  const dispatch = useDispatch();

  // ← Current logged in user
  const { user } = useSelector((state) => state.auth);

  const severity = standup.aiSummary?.severity || "none";
  const config = severityConfig[severity];
  const [showEdit, setShowEdit] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  // ← Sirf apna standup edit/delete kar sakta hai
  const isOwner =
    user &&
    (standup.name === user.name ||
      (standup.userId && standup.userId.toString() === user._id.toString()));

  const handleDelete = () => {
    if (window.confirm("Delete this standup?")) {
      dispatch(deleteStandup(standup._id));
    }
  };

  const hasDiff =
    standup.isEdited &&
    standup.previousData &&
    (standup.previousData.yesterday !== standup.yesterday ||
      standup.previousData.today !== standup.today ||
      standup.previousData.blockers !== standup.blockers);

  return (
    <>
      <div
        className={`bg-white rounded-lg overflow-hidden mb-3 border ${config.border}`}
      >
        {/* Header */}
        <div
          className={`flex items-start gap-3 px-3 py-2.5 border-b border-[#E2DDD5] ${config.headerBg}`}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
            {standup.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          {/* Name + Role + Team */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#0f0f0f] truncate">
                {standup.name}
              </span>
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${config.pill}`}
              >
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {standup.role && (
                <span className="text-[9px] text-[#525151] font-semibold font-mono bg-black/[0.06] px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {standup.role}
                </span>
              )}
              {standup.teamName && (
                <span className="text-[9px] text-[#888] font-mono bg-black/5 px-1.5 py-0.5 rounded uppercase">
                  {standup.teamName}
                </span>
              )}
            </div>
          </div>

          {/* Time + Actions */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[10px] text-[#888] font-mono">
              {new Date(standup.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            <div className="flex items-center gap-1">
              {/* Diff button — sabko dikhta hai */}
              {standup.isEdited && (
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#E6F1FB] text-[#0C447C] border border-[#85B7EB] hover:bg-[#D0E8F8] transition-colors"
                >
                  {showDiff ? "Hide" : "Diff"}
                </button>
              )}

              {/* ← Edit + Delete — SIRF OWNER KO DIKHTA HAI */}
              {isOwner && (
                <>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="text-[#888] hover:text-[#185FA5] transition-colors"
                    title="Edit your standup"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-[#888] hover:text-[#D85A30] transition-colors"
                    title="Delete your standup"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Diff View */}
        {showDiff && hasDiff && (
          <div className="border-b border-[#E2DDD5] bg-[#F7F5F0]">
            <div className="px-3 py-2 border-b border-[#E2DDD5]">
              <p className="text-[9px] font-medium text-[#888] tracking-widest uppercase">
                Changes Made
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-2.5 border-b md:border-b-0 md:border-r border-[#E2DDD5]">
                <p className="text-[9px] font-medium text-[#888] tracking-widest uppercase mb-2">
                  Yesterday
                </p>
                <DiffText
                  oldText={standup.previousData.yesterday}
                  newText={standup.yesterday}
                />
              </div>
              <div className="p-2.5 border-b md:border-b-0 md:border-r border-[#E2DDD5]">
                <p className="text-[9px] font-medium text-[#888] tracking-widest uppercase mb-2">
                  Today
                </p>
                <DiffText
                  oldText={standup.previousData.today}
                  newText={standup.today}
                />
              </div>
              <div className="p-2.5">
                <p className="text-[9px] font-medium text-[#888] tracking-widest uppercase mb-2">
                  Blockers
                </p>
                <DiffText
                  oldText={standup.previousData.blockers}
                  newText={standup.blockers}
                />
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-2.5 border-b md:border-b-0 md:border-r border-[#E2DDD5]">
            <p className="text-[9px] font-medium text-[#888] tracking-widest uppercase mb-1">
              Yesterday
            </p>
            <p className="text-[11px] text-[#3a3a3a] leading-relaxed font-mono">
              {standup.yesterday}
            </p>
          </div>
          <div className="p-2.5 border-b md:border-b-0 md:border-r border-[#E2DDD5]">
            <p className="text-[9px] font-medium text-[#888] tracking-widest uppercase mb-1">
              Today
            </p>
            <p className="text-[11px] text-[#3a3a3a] leading-relaxed font-mono">
              {standup.today}
            </p>
          </div>
          <div className={`p-2.5 ${config.blockerBg}`}>
            <p
              className={`text-[9px] font-medium tracking-widest uppercase mb-1 ${severity !== "none" ? config.blockerText : "text-[#888]"}`}
            >
              Blockers
            </p>
            <p
              className={`text-[11px] leading-relaxed font-mono ${config.blockerText}`}
            >
              {standup.blockers || "None"}
            </p>
          </div>
        </div>

        {/* AI Action */}
        {standup.aiSummary?.actionNeeded &&
          severity !== "none" &&
          severity !== "watch" && (
            <div className="bg-[#0f0f0f] px-3 py-2">
              <p className="text-[9px] text-[#FAC775] tracking-widest uppercase mb-0.5">
                AI — Action Needed
              </p>
              <p className="text-[11px] text-white/60 font-mono">
                {standup.aiSummary.actionNeeded}
              </p>
            </div>
          )}
      </div>

      {showEdit && (
        <EditModal standup={standup} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}

export default StandupCard;
