import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStandups } from "../store/slices/standupSlice";
import LoadingState from "../components/LoadingState";

const roleConfig = {
  "Frontend Developer": {
    icon: "ti-palette",
    class: "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
    avatar: "bg-[#E1F5EE] text-[#0F6E56]",
  },
  "Backend Developer": {
    icon: "ti-server",
    class: "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]",
    avatar: "bg-[#E6F1FB] text-[#0C447C]",
  },
  "Full Stack Developer": {
    icon: "ti-layers-intersect",
    class: "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]",
    avatar: "bg-[#EEEDFE] text-[#3C3489]",
  },
  "DevOps Engineer": {
    icon: "ti-tool",
    class: "bg-[#FAEEDA] text-[#633806] border-[#EF9F27]",
    avatar: "bg-[#FAEEDA] text-[#633806]",
  },
  "UI/UX Designer": {
    icon: "ti-brush",
    class: "bg-[#FBEAF0] text-[#72243E] border-[#ED93B1]",
    avatar: "bg-[#FBEAF0] text-[#72243E]",
  },
  "QA Engineer": {
    icon: "ti-bug",
    class: "bg-[#EAF3DE] text-[#27500A] border-[#97C459]",
    avatar: "bg-[#EAF3DE] text-[#27500A]",
  },
  "Product Manager": {
    icon: "ti-clipboard-list",
    class: "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
    avatar: "bg-[#FAEEDA] text-[#854F0B]",
  },
};

const defaultConfig = {
  icon: "ti-user",
  class: "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]",
  avatar: "bg-[#E1F5EE] text-[#0F6E56]",
};

function Members() {
  const dispatch = useDispatch();
  const { standups, loading } = useSelector((state) => state.standup);

  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);

  const members = standups.reduce((acc, standup) => {
    const existing = acc.find((m) => m.name === standup.name);
    if (existing) {
      existing.totalStandups += 1;
      existing.lastSubmission = standup.createdAt;
      if (standup.blockers && standup.blockers.trim() !== "") {
        existing.totalBlockers += 1;
      }
    } else {
      acc.push({
        name: standup.name,
        role: standup.role || "",
        teamName: standup.teamName || "",
        totalStandups: 1,
        totalBlockers:
          standup.blockers && standup.blockers.trim() !== "" ? 1 : 0,
        lastSubmission: standup.createdAt,
      });
    }
    return acc;
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-4 border-b border-[#E2DDD5]">
        <div>
          <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
            team overview
          </p>
          <h1 className="text-[18px] font-medium text-[#0f0f0f]">Members</h1>
        </div>
        <p className="text-[11px] text-[#888] font-mono pt-5">
          {members.length} members
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-[#F7F5F0] rounded-lg p-3">
          <p className="text-[20px] font-medium text-[#0f0f0f] mb-0.5">
            {members.length}
          </p>
          <p className="text-[10px] text-[#888] font-mono">total members</p>
        </div>
        <div className="bg-[#F7F5F0] rounded-lg p-3">
          <p className="text-[20px] font-medium text-[#1D9E75] mb-0.5">
            {members.filter((m) => m.totalBlockers === 0).length}
          </p>
          <p className="text-[10px] text-[#888] font-mono">no blockers</p>
        </div>
        <div className="bg-[#F7F5F0] rounded-lg p-3">
          <p className="text-[20px] font-medium text-[#D85A30] mb-0.5">
            {members.filter((m) => m.totalBlockers > 0).length}
          </p>
          <p className="text-[10px] text-[#888] font-mono">have blockers</p>
        </div>
      </div>

      {/* Members List */}
      {members.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F5F0] border border-[#E2DDD5] rounded-xl">
          <i
            className="ti ti-users"
            style={{
              fontSize: 28,
              color: "#bbb",
              display: "block",
              marginBottom: 8,
            }}
            aria-hidden="true"
          />
          <p className="text-[#888] text-sm">No members yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members
            .sort((a, b) => b.totalStandups - a.totalStandups)
            .map((member) => {
              const config = roleConfig[member.role] || defaultConfig;
              const onTrackPercent = member.totalStandups
                ? Math.round(
                    ((member.totalStandups - member.totalBlockers) /
                      member.totalStandups) *
                      100,
                  )
                : 100;

              return (
                <div
                  key={member.name}
                  className="bg-white border border-[#E2DDD5] rounded-xl overflow-hidden"
                >
                  {/* Top Row */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2DDD5]">
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium shrink-0 ${config.avatar}`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name, Team & Role Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-[14px] font-medium text-[#0f0f0f] truncate">
                          {member.name}
                        </p>
                        {/* Team Name Badge added here */}
                        <span className="text-[9px] text-[#555] font-mono bg-black/[0.08] px-1.5 py-0.5 rounded uppercase shrink-0 font-semibold tracking-wide">
                          {member.teamName ? member.teamName : "NO TEAM"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Role Badge */}
                        {member.role ? (
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 font-mono ${config.class}`}
                          >
                            <i
                              className={`ti ${config.icon}`}
                              style={{ fontSize: 10 }}
                              aria-hidden="true"
                            />
                            {member.role}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#888]">
                            No Role
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-[#888] font-mono shrink-0">
                      {new Date(member.lastSubmission).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 border-b border-[#E2DDD5]">
                    <div className="p-3 border-r border-[#E2DDD5]">
                      <p className="text-[16px] font-medium text-[#0f0f0f] mb-0.5">
                        {member.totalStandups}
                      </p>
                      <p className="text-[10px] text-[#888] font-mono">
                        standups
                      </p>
                    </div>
                    <div className="p-3 border-r border-[#E2DDD5]">
                      <p
                        className={`text-[16px] font-medium mb-0.5 ${
                          member.totalBlockers > 0
                            ? "text-[#D85A30]"
                            : "text-[#1D9E75]"
                        }`}
                      >
                        {member.totalBlockers}
                      </p>
                      <p className="text-[10px] text-[#888] font-mono">
                        blockers
                      </p>
                    </div>
                    <div className="p-3">
                      <p
                        className={`text-[16px] font-medium mb-0.5 ${
                          onTrackPercent >= 80
                            ? "text-[#1D9E75]"
                            : "text-[#D85A30]"
                        }`}
                      >
                        {onTrackPercent}%
                      </p>
                      <p className="text-[10px] text-[#888] font-mono">
                        on track
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-4 py-2.5 flex items-center gap-3">
                    <div className="flex-1 bg-[#F7F5F0] rounded-full h-[3px]">
                      <div
                        className={`h-[3px] rounded-full transition-all ${
                          onTrackPercent >= 80 ? "bg-[#0f0f0f]" : "bg-[#D85A30]"
                        }`}
                        style={{ width: `${onTrackPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#888] font-mono min-w-[30px] text-right">
                      {onTrackPercent}%
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Members;
