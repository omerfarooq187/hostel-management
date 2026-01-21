import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function FeeConfigSection() {
  const hostelId = localStorage.getItem("selectedHostelId");

  const [currentConfig, setCurrentConfig] = useState(null);
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const loadCurrentConfig = async () => {
    try {
      const res = await api.get("/api/admin/fee-config/active", {
        params: { hostelId }
      });
      setCurrentConfig(res.data);
    } catch (err) {
      console.error("Failed to load fee config", err);
    }
  };

  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const saveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await api.post("/api/admin/fee-config", null, {
        params: { hostelId, amount, dueDay }
      });

      setSuccess("Monthly fee updated successfully");
      setAmount("");
      setDueDay("");
      loadCurrentConfig();
    } catch (err) {
      console.error("Failed to update fee config", err);
      alert("Failed to save fee configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg space-y-6">
      <h2 className="text-xl font-semibold">Fee Configuration</h2>

      {/* Current config */}
      {currentConfig ? (
        <div className="bg-gray-50 border rounded-lg p-4 space-y-1">
          <p className="text-sm text-gray-600">Current Monthly Fee</p>
          <p className="text-2xl font-bold">
            Rs. {currentConfig.monthlyAmount}
          </p>

          <p className="text-sm text-gray-600">
            Effective From:
            <span className="ml-2 font-medium text-gray-800">
              {currentConfig.effectiveFrom}
            </span>
          </p>

          <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            Active
          </span>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No fee configuration set yet.
        </p>
      )}

      {/* Update form */}
      <form onSubmit={saveConfig} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            New Monthly Fee Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter new monthly fee"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Fee Due Day (every month)
          </label>
          <input
            type="number"
            min="1"
            max="28"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            placeholder="Example: 10"
            className="w-full border rounded px-3 py-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Fee will be due on this day every month
          </p>
        </div>


        {success && (
          <p className="text-green-600 text-sm">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Fee"}
        </button>
      </form>
    </div>
  );
}
