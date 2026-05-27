import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStandups, deleteStandup } from "../store/slices/standupSlice";
import LoadingState from "../components/LoadingState";
import { FiTrash2 } from "react-icons/fi";

const severityConfig = {
  critical: {
    label: "🚨 Critical",
    pill: "bg-[#FAECE7] text-[#993C1D] border-[#F0997B]",
    headerBg: "bg-[#FAECE7]",
    border: "border-[#F5C4B3]",
    roleText: "text-[#712B13]",
  },
  moderate: {
    label: "⚠️ Moderate",
    pill: "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
    headerBg: "bg-[#FAEEDA]",
    border: "border-[#EF9F27]",
    roleText: "text-[#633806]",
  },
  watch: {
    label: "👀 Watch",
    pill: "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]",
    headerBg: "bg-[#E6F1FB]",
    border: "border-[#85B7EB]",
    roleText: "text-[#0C447C]",
  },
};

const roleConfig = {
  "Frontend Developer": "bg-[#E1F5EE] text-[#0F6E56]",
  "Backend Developer": "bg-[#E6F1FB] text-[#0C447C]",
  "Full Stack Developer": "bg-[#EEEDFE] text-[#3C3489]",
  "DevOps Engineer": "bg-[#FAEEDA] text-[#633806]",
  "UI/UX Designer": "bg-[#FBEAF0] text-[#72243E]",
  "QA Engineer": "bg-[#EAF3DE] text-[#27500A]",
  "Product Manager": "bg-[#FAEEDA] text-[#854F0B]",
};

function Blockers() {
  const dispatch = useDispatch();
  const { standups, loading } = useSelector((state) => state.standup);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);

  const blockedStandups = standups.filter(
    (s) =>
      s.aiSummary?.blockersDetected === true &&
      s.aiSummary?.severity !== "none",
  );

  const critical = blockedStandups.filter(
    (s) => s.aiSummary?.severity === "critical",
  );
  const moderate = blockedStandups.filter(
    (s) => s.aiSummary?.severity === "moderate",
  );
  const watch = blockedStandups.filter(
    (s) => s.aiSummary?.severity === "watch",
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this blocker?")) {
      dispatch(deleteStandup(id));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-4 border-b border-[#E2DDD5]">
        <div>
          <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
            team blockers
          </p>
          <h1 className="text-[18px] font-medium text-[#0f0f0f]">Blockers</h1>
        </div>
        <p className="text-[11px] text-[#888] font-mono pt-5">
          {blockedStandups.length} active
        </p>
      </div>

      {/* Severity Summary */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-[#FAECE7] border border-[#F5C4B3] rounded-lg p-3">
          <p className="text-[20px] font-medium text-[#D85A30] mb-0.5">
            {critical.length}
          </p>
          <p className="text-[10px] text-[#993C1D] font-mono">critical</p>
        </div>
        <div className="bg-[#FAEEDA] border border-[#EF9F27] rounded-lg p-3">
          <p className="text-[20px] font-medium text-[#BA7517] mb-0.5">
            {moderate.length}
          </p>
          <p className="text-[10px] text-[#854F0B] font-mono">moderate</p>
        </div>
        <div className="bg-[#E6F1FB] border border-[#85B7EB] rounded-lg p-3">
          <p className="text-[20px] font-medium text-[#185FA5] mb-0.5">
            {watch.length}
          </p>
          <p className="text-[10px] text-[#0C447C] font-mono">watch</p>
        </div>
      </div>

      {/* Empty State */}
      {blockedStandups.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F5F0] border border-[#E2DDD5] rounded-xl">
          <i
            className="ti ti-circle-check"
            style={{
              fontSize: 28,
              color: "#1D9E75",
              display: "block",
              marginBottom: 8,
            }}
            aria-hidden="true"
          />
          <p className="text-[#888] text-sm">No blockers right now!</p>
          <p className="text-[#bbb] text-[11px] font-mono mt-1">
            Team is fully on track
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {blockedStandups.map((s) => {
            const severity = s.aiSummary?.severity || "watch";
            const config = severityConfig[severity];
            const avatarClass =
              roleConfig[s.role] || "bg-[#E1F5EE] text-[#0F6E56]";

            // Ownership check
            const isOwner =
              user &&
              (s.name === user.name ||
                (s.userId && s.userId.toString() === user._id?.toString()));

            return (
              <div
                key={s._id}
                className={`bg-white rounded-xl border ${config.border} overflow-hidden`}
              >
                {/* Header */}
                <div
                  className={`flex items-center gap-2 px-4 py-3 border-b border-[#E2DDD5] ${config.headerBg}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${avatarClass}`}
                  >
                    {s.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + Team + Role */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-medium text-[#0f0f0f]">
                        {s.name}
                      </p>
                      {/* Team Badge */}
                      {s.teamName && (
                        <span className="text-[9px] text-[#555] font-mono bg-black/[0.08] px-1.5 py-0.5 rounded uppercase font-semibold tracking-wide">
                          {s.teamName}
                        </span>
                      )}
                    </div>
                    {s.role && (
                      <p
                        className={`text-[10px] font-mono mt-0.5 ${config.roleText}`}
                      >
                        {s.role}
                      </p>
                    )}
                  </div>

                  {/* Severity Pill */}
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ml-2 shrink-0 ${config.pill}`}
                  >
                    {config.label}
                  </span>

                  {/* Date */}
                  <span className="ml-auto text-[10px] text-[#888] font-mono shrink-0">
                    {new Date(s.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  {/* Delete — sirf owner ko dikhta hai */}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-[#888] hover:text-[#D85A30] transition-colors ml-1 shrink-0"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="px-4 py-3">
                  <p className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono mb-1.5">
                    Blocker
                  </p>
                  <p className="text-[12px] text-[#3a3a3a] font-mono leading-relaxed mb-3">
                    {s.blockers}
                  </p>

                  {/* AI Action */}
                  {s.aiSummary?.actionNeeded && (
                    <div className="bg-[#0f0f0f] rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-[4px] h-[4px] rounded-full bg-[#FAC775] inline-block" />
                        <p className="text-[10px] text-white/30 tracking-widest uppercase font-mono">
                          ai action needed
                        </p>
                      </div>
                      <p className="text-[11px] text-white/55 font-mono leading-relaxed">
                        {s.aiSummary.actionNeeded}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Blockers;
