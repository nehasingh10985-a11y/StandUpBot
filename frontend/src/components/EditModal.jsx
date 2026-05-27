import { useState } from "react";
import { useDispatch } from "react-redux";
import { editStandup } from "../store/slices/standupSlice";

function EditModal({ standup, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    yesterday: standup.yesterday,
    today: standup.today,
    blockers: standup.blockers,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    await dispatch(editStandup({ id: standup._id, formData: form }));
    setLoading(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          {/* Modal Top Bar */}
          <div className="bg-[#0f0f0f] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/30 tracking-widest uppercase font-mono mb-0.5">
                editing standup
              </p>
              <h2 className="text-[15px] font-medium text-white">
                {standup.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <div className="p-5">
            {/* Field Numbers */}
            <div className="flex flex-col gap-4">
              {/* Yesterday */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded bg-[#F7F5F0] border border-[#E2DDD5] flex items-center justify-center text-[9px] font-mono text-[#888]">
                    01
                  </div>
                  <label className="text-[12px] font-medium text-[#0f0f0f]">
                    Yesterday
                  </label>
                </div>
                <textarea
                  name="yesterday"
                  value={form.yesterday}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-[#F7F5F0] border border-[#E2DDD5] focus:border-[#0f0f0f] rounded-lg px-3 py-2 text-xs font-mono outline-none resize-none leading-relaxed text-[#0f0f0f] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              {/* Today */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded bg-[#F7F5F0] border border-[#E2DDD5] flex items-center justify-center text-[9px] font-mono text-[#888]">
                    02
                  </div>
                  <label className="text-[12px] font-medium text-[#0f0f0f]">
                    Today
                  </label>
                </div>
                <textarea
                  name="today"
                  value={form.today}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-[#F7F5F0] border border-[#E2DDD5] focus:border-[#0f0f0f] rounded-lg px-3 py-2 text-xs font-mono outline-none resize-none leading-relaxed text-[#0f0f0f] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              {/* Blockers */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded bg-[#FAECE7] border border-[#F5C4B3] flex items-center justify-center text-[9px] font-mono text-[#D85A30]">
                    03
                  </div>
                  <label className="text-[12px] font-medium text-[#0f0f0f]">
                    Blockers
                    <span className="text-[#888] font-normal ml-1 text-[11px]">
                      (optional)
                    </span>
                  </label>
                </div>
                <textarea
                  name="blockers"
                  value={form.blockers}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any blockers?"
                  className={`w-full bg-[#F7F5F0] rounded-lg px-3 py-2 text-xs font-mono outline-none resize-none leading-relaxed text-[#0f0f0f] transition-colors placeholder:text-[#bbb] border
                    ${
                      form.blockers
                        ? "border-[#F5C4B3] focus:border-[#D85A30]"
                        : "border-[#E2DDD5] focus:border-[#0f0f0f]"
                    }`}
                />
              </div>
            </div>

            {/* AI Notice */}
            <div className="bg-[#0f0f0f] rounded-lg px-3 py-2.5 mt-4 flex items-start gap-2">
              <span className="text-[#FAC775] text-[10px] mt-0.5">●</span>
              <p className="text-[11px] text-white/50 font-mono leading-relaxed">
                AI will re-analyze blockers after saving
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-[#F7F5F0] text-[#0f0f0f] text-sm font-medium py-2.5 rounded-lg border border-[#E2DDD5] hover:bg-[#EDEAE4] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-[#0f0f0f] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1a1a1a] disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.3s]" />
                  </>
                ) : (
                  "Save Changes →"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditModal;
