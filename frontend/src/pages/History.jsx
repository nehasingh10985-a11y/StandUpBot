import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStandups, deleteStandup } from "../store/slices/standupSlice";
import LoadingState from "../components/LoadingState";
import { FiTrash2, FiDownload } from "react-icons/fi";

const severityConfig = {
  critical: {
    label: "Critical",
    class: "bg-[#FAECE7] text-[#993C1D] border-[#F0997B]",
  },
  moderate: {
    label: "Moderate",
    class: "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
  },
  watch: {
    label: "Watch",
    class: "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]",
  },
  none: {
    label: "On Track",
    class: "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
  },
};

const roleConfig = {
  "Frontend Developer": "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
  "Backend Developer": "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]",
  "Full Stack Developer": "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]",
  "DevOps Engineer": "bg-[#FAEEDA] text-[#633806] border-[#EF9F27]",
  "UI/UX Designer": "bg-[#FBEAF0] text-[#72243E] border-[#ED93B1]",
  "QA Engineer": "bg-[#EAF3DE] text-[#27500A] border-[#97C459]",
  "Product Manager": "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
};

function History() {
  const dispatch = useDispatch();
  const { standups, loading } = useSelector((state) => state.standup);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);

  const filtered = standups.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this standup?")) {
      dispatch(deleteStandup(id));
    }
  };

  const handleExport = async () => {
    setDownloading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/standup/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "standups.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Export error:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-4 border-b border-[#E2DDD5]">
        <div>
          <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
            standup history
          </p>
          <h1 className="text-[18px] font-medium text-[#0f0f0f]">History</h1>
        </div>
        <button
          onClick={handleExport}
          disabled={downloading}
          className="flex items-center gap-2 bg-[#0f0f0f] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#222] disabled:opacity-50 transition-all cursor-pointer font-mono mt-4"
        >
          <FiDownload
            size={13}
            className={downloading ? "animate-bounce" : ""}
          />
          {downloading ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#F7F5F0] rounded-lg p-3">
          <p className="text-[18px] font-medium text-[#0f0f0f] mb-0.5">
            {standups.length}
          </p>
          <p className="text-[10px] text-[#888] font-mono">total</p>
        </div>
        <div className="bg-[#F7F5F0] rounded-lg p-3">
          <p className="text-[18px] font-medium text-[#D85A30] mb-0.5">
            {
              standups.filter((s) => s.blockers && s.blockers.trim() !== "")
                .length
            }
          </p>
          <p className="text-[10px] text-[#888] font-mono">blocked</p>
        </div>
        <div className="bg-[#F7F5F0] rounded-lg p-3">
          <p className="text-[18px] font-medium text-[#185FA5] mb-0.5">
            {standups.filter((s) => s.isEdited).length}
          </p>
          <p className="text-[10px] text-[#888] font-mono">edited</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 group">
        <i
          className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"
          style={{ fontSize: 14 }}
          aria-hidden="true"
        />
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#E2DDD5] rounded-lg pl-8 pr-4 py-2.5 text-sm outline-none text-[#0f0f0f] placeholder:text-[#bbb] font-mono focus:border-[#0f0f0f] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2DDD5] rounded-xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[75px_1fr_90px_32px] gap-2 px-4 py-2.5 bg-[#F7F5F0] border-b border-[#E2DDD5]">
          <span className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono">
            Date
          </span>
          <span className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono">
            Member
          </span>
          <span className="text-[10px] font-medium text-[#888] tracking-widest uppercase font-mono">
            Status
          </span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#888] text-sm font-mono">No standups found.</p>
          </div>
        ) : (
          filtered.map((s) => {
            const rawSeverity = s.aiSummary?.severity || "none";
            const config = severityConfig[rawSeverity] || severityConfig.none;

            // Ownership check
            const isOwner =
              user &&
              (s.name === user.name ||
                (s.userId && s.userId.toString() === user._id?.toString()));

            return (
              <div
                key={s._id}
                className="grid grid-cols-[75px_1fr_90px_32px] gap-2 px-4 py-3 border-b border-[#F0EDE8] items-start last:border-b-0 hover:bg-[#F7F5F0] transition-colors group"
              >
                {/* Date */}
                <span className="text-[11px] text-[#888] font-mono pt-0.5">
                  {new Date(s.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {/* Member Info */}
                <div className="flex flex-col gap-1 min-w-0">
                  {/* Name + Team + Edited */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] text-[#0f0f0f] font-medium">
                      {s.name}
                    </span>
                    {s.teamName && (
                      <span className="text-[9px] text-[#555] font-mono bg-black/[0.08] px-1.5 py-0.5 rounded uppercase font-semibold tracking-wide shrink-0">
                        {s.teamName}
                      </span>
                    )}
                    {s.isEdited && (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#E6F1FB] text-[#0C447C] border border-[#85B7EB] shrink-0 font-mono">
                        edited
                      </span>
                    )}
                  </div>

                  {/* Role Badge */}
                  {s.role && (
                    <span
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-full border inline-block font-mono w-fit
                        ${roleConfig[s.role] || "bg-[#F7F5F0] text-[#888] border-[#E2DDD5]"}`}
                    >
                      {s.role
                        .replace(" Developer", " Dev")
                        .replace(" Engineer", " Eng")}
                    </span>
                  )}
                </div>

                {/* Status */}
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border inline-block text-center font-mono ${config.class}`}
                >
                  {config.label}
                </span>

                {/* Delete — sirf owner ko dikhta hai */}
                <div className="flex items-center justify-center pt-0.5">
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-[#bbb] hover:text-[#D85A30] transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Delete standup"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default History;
