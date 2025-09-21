import { useEffect, useState } from "react";
import { fetchSupplierStatement } from "../api/supplierLedgerApi";

export default function SupplierStatement({ supplierId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchSupplierStatement(supplierId, { from, to });
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message || "حدث خطأ");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [supplierId]);

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">
        كشف حساب: {data.supplier.name}
      </h2>

      {/* فلاتر التاريخ */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-1 rounded"
        />
        <button
          onClick={loadData}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          تحديث
        </button>
      </div>

      {/* رصيد افتتاحي */}
      <div className="mb-2">
        <strong>الرصيد الافتتاحي:</strong> {data.opening_balance.toFixed(2)}
      </div>

      {/* جدول الحركة */}
      <table className="min-w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">التاريخ</th>
            <th className="border p-2">الوصف</th>
            <th className="border p-2">مدين</th>
            <th className="border p-2">دائن</th>
            <th className="border p-2">الرصيد</th>
          </tr>
        </thead>
        <tbody>
          {data.statement.map((row, idx) => (
            <tr key={idx}>
              <td className="border p-2">{row.date}</td>
              <td className="border p-2">{row.description}</td>
              <td className="border p-2 text-right">{row.debit.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.credit.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.running_balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 font-bold">
        الرصيد الختامي: {data.closing_balance.toFixed(2)}
      </div>
    </div>
  );
}
