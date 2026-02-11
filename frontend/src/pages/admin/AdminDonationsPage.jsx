import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import { Heart, Search, Cat, DollarSign, FileDown } from "lucide-react";
import { generateDonationsPDF } from "../../utils/pdfExport.js";

export default function AdminDonationsPage() {
  const { admin } = useAdminAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/donations`);
        if (response.ok) {
          const data = await response.json();
          setDonations(data);
        }
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(
    (donation) =>
      donation.cat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royal flex items-center gap-2">
            <Heart className="w-7 h-7 text-pink-500" />
            Royal Donations
          </h1>
          <p className="text-ink/60">All donations from our generous supporters</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setExporting(true);
              try {
                generateDonationsPDF(filteredDonations, searchTerm, admin?.username || "Admin");
              } catch (error) {
                console.error("Failed to generate PDF:", error);
                alert("Failed to generate PDF. Please try again.");
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting || filteredDonations.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-ink/20 text-royal rounded-xl font-medium hover:bg-cream transition-all disabled:opacity-50"
            title="Export to PDF"
          >
            <FileDown className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`} />
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
          <div className="bg-gradient-to-r from-blush to-blush/50 px-6 py-3 rounded-xl">
            <p className="text-sm text-ink/60">Total Donations</p>
            <p className="text-2xl font-bold text-royal">${totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <input
          type="text"
          placeholder="Search by cat name or donation type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
        />
      </div>

      {/* Donations Table */}
      {filteredDonations.length > 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blush/30 border-b border-ink/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Cat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Frequency
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredDonations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-pink-500" />
                        </div>
                        <span className="font-medium text-ink capitalize">
                          {donation.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Cat className="w-4 h-4 text-royal" />
                        <span className="text-ink">{donation.cat}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-emerald-600">
                        <DollarSign className="w-4 h-4" />
                        {donation.amount?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          donation.frequency === "monthly"
                            ? "bg-royal/10 text-royal"
                            : "bg-banana-100 text-amber-700"
                        }`}
                      >
                        {donation.frequency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          donation.status === "completed"
                            ? "bg-mint/50 text-emerald-700"
                            : "bg-banana-100 text-amber-700"
                        }`}
                      >
                        {donation.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/60">
                      {donation.createdAt
                        ? new Date(donation.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-2xl">
          <Heart className="w-16 h-16 mx-auto text-ink/20 mb-4" />
          <p className="text-ink/50">No donations yet 💝</p>
          <p className="text-sm text-ink/40 mt-1">
            Donations will appear here when supporters contribute
          </p>
        </div>
      )}
    </div>
  );
}
