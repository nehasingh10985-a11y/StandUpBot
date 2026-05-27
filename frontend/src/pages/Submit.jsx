import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitStandup,
  resetSubmitSuccess,
} from "../store/slices/standupSlice";

function Submit() {
  const dispatch = useDispatch();
  const { loading, error, submitSuccess } = useSelector(
    (state) => state.standup,
  );
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    yesterday: "",
    today: "",
    blockers: "",
  });

  useEffect(() => {
    if (submitSuccess) {
      setForm({ yesterday: "", today: "", blockers: "" });
    }
  }, [submitSuccess]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.yesterday || !form.today) return;
    dispatch(submitStandup(form));
  };

  if (submitSuccess) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-[#E2DDD5] rounded-xl overflow-hidden">
          <div className="bg-[#0f0f0f] px-5 py-4">
            <p className="text-[10px] text-white/30 tracking-widest uppercase font-mono mb-1">
              status
            </p>
            <p className="text-[15px] font-medium text-white">
              Standup submitted
            </p>
          </div>
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center mx-auto mb-4">
              <i
                className="ti ti-check"
                style={{ fontSize: 22, color: "#1D9E75" }}
                aria-hidden="true"
              />
            </div>
            <p className="text-[#888] text-sm font-mono mb-1">
              AI is analyzing your update
            </p>
            <p className="text-[11px] text-[#bbb] font-mono mb-6">
              Slack notification sent to team channel
            </p>
            <button
              onClick={() => dispatch(resetSubmitSuccess())}
              className="bg-[#0f0f0f] text-white text-sm font-medium py-2.5 px-6 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors"
            >
              Submit another →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-5 pb-4 border-b border-[#E2DDD5]">
        <p className="text-[10px] text-[#888] tracking-widest uppercase font-mono mb-1">
          daily standup
        </p>
        <h1 className="text-[18px] font-medium text-[#0f0f0f]">
          Submit Update
        </h1>
      </div>

      <div className="bg-white border border-[#E2DDD5] rounded-xl overflow-hidden">
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F7F5F0] border-b border-[#E2DDD5]">
            <div className="w-8 h-8 rounded-full bg-[#FAC775] text-[#0f0f0f] flex items-center justify-center text-xs font-medium shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#0f0f0f]">
                {user.name}
              </p>
              <p className="text-[10px] text-[#888] font-mono">
                {user.role && `${user.role} · `}
                {user.teamName}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-[5px] h-[5px] rounded-full bg-[#1D9E75] inline-block" />
              <span className="text-[10px] text-[#888] font-mono">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Error */}
          {error && (
            <div className="bg-[#FAECE7] border border-[#F5C4B3] rounded-lg px-3 py-2.5 mb-4">
              <p className="text-[11px] text-[#993C1D] font-mono">{error}</p>
            </div>
          )}

          {/* Yesterday */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-[#F7F5F0] border border-[#E2DDD5] flex items-center justify-center text-[9px] font-mono text-[#888]">
                01
              </div>
              <label className="text-[12px] font-medium text-[#0f0f0f]">
                Yesterday
              </label>
              <span className="text-[10px] text-[#888] font-mono ml-auto">
                What did you complete?
              </span>
            </div>
            <textarea
              name="yesterday"
              value={form.yesterday}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Fixed auth bug, merged PR #198, reviewed designs..."
              className="w-full bg-[#F7F5F0] border border-[#E2DDD5] focus:border-[#888] rounded-lg px-3 py-2.5 text-xs font-mono outline-none resize-none leading-relaxed text-[#0f0f0f] placeholder:text-[#bbb] transition-colors"
            />
          </div>

          {/* Today */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-[#F7F5F0] border border-[#E2DDD5] flex items-center justify-center text-[9px] font-mono text-[#888]">
                02
              </div>
              <label className="text-[12px] font-medium text-[#0f0f0f]">
                Today
              </label>
              <span className="text-[10px] text-[#888] font-mono ml-auto">
                What are you working on?
              </span>
            </div>
            <textarea
              name="today"
              value={form.today}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Working on payment API, starting user profile module..."
              className="w-full bg-[#F7F5F0] border border-[#E2DDD5] focus:border-[#888] rounded-lg px-3 py-2.5 text-xs font-mono outline-none resize-none leading-relaxed text-[#0f0f0f] placeholder:text-[#bbb] transition-colors"
            />
          </div>

          {/* Blockers */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-[#FAECE7] border border-[#F5C4B3] flex items-center justify-center text-[9px] font-mono text-[#D85A30]">
                03
              </div>
              <label className="text-[12px] font-medium text-[#0f0f0f]">
                Blockers
              </label>
              <span className="text-[10px] text-[#888] font-mono ml-auto">
                optional
              </span>
            </div>
            <textarea
              name="blockers"
              value={form.blockers}
              onChange={handleChange}
              rows={2}
              placeholder="Anything blocking you? Leave empty if none..."
              className={`w-full bg-[#F7F5F0] rounded-lg px-3 py-2.5 text-xs font-mono outline-none resize-none leading-relaxed text-[#0f0f0f] placeholder:text-[#bbb] border transition-colors
                ${
                  form.blockers
                    ? "border-[#F5C4B3] focus:border-[#D85A30]"
                    : "border-[#E2DDD5] focus:border-[#888]"
                }`}
            />
          </div>

          {/* AI Notice */}
          <div className="bg-[#0f0f0f] rounded-lg px-3 py-2.5 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-[4px] h-[4px] rounded-full bg-[#FAC775] inline-block" />
              <span className="text-[10px] text-white/30 tracking-widest uppercase font-mono">
                ai powered
              </span>
            </div>
            <p className="text-[11px] text-white/50 font-mono leading-relaxed">
              Groq will classify blockers → generate summary → notify Slack
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0f0f0f] text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 cursor-pointer hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.3s]" />
              </>
            ) : (
              <>
                <i
                  className="ti ti-send"
                  style={{ fontSize: 14 }}
                  aria-hidden="true"
                />
                Submit Standup
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Submit;
