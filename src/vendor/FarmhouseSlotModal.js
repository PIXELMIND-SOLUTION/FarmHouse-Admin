import React, { useEffect, useState } from "react";
import axios from "axios";

const DATE = "2026-02-10";

const FarmhouseSlotsModal = ({ farmhouseId, open, onClose, name }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");

  const fetchSlots = async () => {
    if (!farmhouseId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://31.97.206.144:5124/api/${farmhouseId}/slots?date=${DATE}`
      );
      setSlots(res.data.slots);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { if (open) fetchSlots(); }, [open]);

  const toggleSlot = async () => {
    if (!selectedSlot) return;
    setToggling(selectedSlot.slotId);

    try {
      await axios.put(
        `http://31.97.206.144:5124/api/${farmhouseId}/slots/${selectedSlot.slotId}/toggle?date=${DATE}`,
        { isActive: !selectedSlot.isActive, reason: reason || "Vendor updated" }
      );

      setSlots(prev =>
        prev.map(s => s.slotId === selectedSlot.slotId ? { ...s, isActive: !s.isActive } : s)
      );

      setSelectedSlot(null);
      setReason("");
    } catch (err) { console.error(err); }

    setToggling(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-lime-200">

        {/* HEADER */}
        <div className="sticky top-0 flex justify-between items-center px-8 py-6 border-b bg-gradient-to-r from-lime-50 to-amber-50">
          <div>
            <h2 className="text-2xl font-bold text-lime-800">Slot Manager</h2>
            <p className="text-sm text-lime-600">{name} • {DATE}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-lime-100 hover:bg-lime-200">✕</button>
        </div>

        {/* BODY */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-96px)]">
          {loading ? (
            <div className="text-center py-20 text-lime-600">Loading slots…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {slots.map(slot => (
                <div key={slot.slotId}
                  className="relative border border-lime-200 rounded-2xl p-5 bg-gradient-to-br from-white to-lime-50 shadow hover:shadow-xl transition">

                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${slot.isActive ? "bg-lime-500" : "bg-gray-300"}`} />

                  <h3 className="font-bold text-lg text-lime-800">{slot.label}</h3>
                  <p className="text-sm text-lime-600">{slot.timing}</p>
                  <p className="mt-2 font-semibold text-lime-800">₹{slot.price}</p>

                  <button
                    onClick={() => { setSelectedSlot(slot); setReason(""); }}
                    className={`mt-4 w-full py-2 rounded-xl font-semibold text-white transition ${
                      slot.isActive ? "bg-red-500 hover:bg-red-600" : "bg-lime-500 hover:bg-lime-600"
                    }`}
                  >
                    {slot.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REASON MODAL */}
        {selectedSlot && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-lime-200">

              <h3 className="text-xl font-bold mb-2 text-lime-800">
                {selectedSlot.isActive ? "Deactivate Slot" : "Activate Slot"}
              </h3>

              <p className="text-lime-600 mb-4">Please provide a reason.</p>

              <textarea
                rows={3}
                className="w-full border border-lime-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-lime-400"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-lime-50">Cancel</button>

                <button disabled={toggling} onClick={toggleSlot}
                  className={`px-5 py-2 rounded-lg text-white font-semibold ${
                    selectedSlot.isActive ? "bg-red-500 hover:bg-red-600" : "bg-lime-500 hover:bg-lime-600"
                  }`}>
                  {toggling ? "Updating..." : "Confirm"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmhouseSlotsModal;
