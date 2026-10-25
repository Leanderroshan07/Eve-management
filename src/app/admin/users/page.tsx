"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import {
  SEEDED_PLATFORM_ACCOUNTS,
  CURRENT_ADMIN,
  PlatformAccount,
  updateAccountSanction,
} from "@/lib/admin-data";

export default function AdminUsersPage() {
  const [accounts, setAccounts] = React.useState<PlatformAccount[]>([]);
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Sanction Modal State
  const [selectedAccount, setSelectedAccount] = React.useState<PlatformAccount | null>(null);
  const [sanctionAction, setSanctionAction] = React.useState<"warned" | "suspended" | "active">("warned");
  const [justificationNotes, setJustificationNotes] = React.useState<string>("");
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    setAccounts([...SEEDED_PLATFORM_ACCOUNTS]);
  }, []);

  const filteredAccounts = React.useMemo(() => {
    return accounts.filter((acc) => {
      const matchRole = roleFilter === "all" || acc.role === roleFilter;
      const matchStatus = statusFilter === "all" || acc.status === statusFilter;
      const matchQuery =
        !searchQuery ||
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchStatus && matchQuery;
    });
  }, [accounts, roleFilter, statusFilter, searchQuery]);

  const openSanctionModal = (account: PlatformAccount, action: "warned" | "suspended" | "active") => {
    setSelectedAccount(account);
    setSanctionAction(action);
    setJustificationNotes("");
  };

  const handleApplySanction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !justificationNotes.trim()) return;

    const updated = updateAccountSanction(
      selectedAccount.id,
      sanctionAction,
      justificationNotes,
      CURRENT_ADMIN.name
    );

    setAccounts([...SEEDED_PLATFORM_ACCOUNTS]);
    setSelectedAccount(null);
    setSuccessNotice(
      `Account "${updated.name}" updated to status ${updated.status.toUpperCase()}. Action logged in Audit Trail.`
    );
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Account Governance & Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage, verify, and moderate accounts across Organizers, Customers, Workers, and Rental Providers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-border text-foreground">
            Total Entities: {accounts.length}
          </Badge>
        </div>
      </div>

      {/* Success Banner */}
      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400/80 z-10" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="pl-10 text-xs glass-field text-foreground placeholder:text-amber-200/40"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-xl glass-field px-3 py-2 text-xs text-foreground cursor-pointer"
          >
            <option value="all">All Platform Roles</option>
            <option value="organizer">Event Organizers</option>
            <option value="customer">Customers / Couples</option>
            <option value="worker">Catering Workers</option>
            <option value="rental_provider">Rental Providers</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl glass-field px-3 py-2 text-xs text-foreground cursor-pointer"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="warned">Warned / Flagged</option>
            <option value="suspended">Suspended Accounts</option>
          </select>
        </div>
      </div>

      {/* Accounts Directory Table */}
      <Card className="border-amber-500/20 bg-[#1c0c05]/80 overflow-hidden shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#240e05]/90 text-amber-200/80 uppercase text-[10px] font-semibold border-b border-amber-500/20">
              <tr>
                <th className="py-3.5 px-4">Entity & Contact</th>
                <th className="py-3.5 px-3">Role</th>
                <th className="py-3.5 px-3">City / Hub</th>
                <th className="py-3.5 px-4">Activity Summary</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/15 text-foreground">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-[#240e05]/40 transition-colors">
                  {/* Entity Name & Verification */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{account.name}</span>
                      {account.verified && (
                        <span title="Identity Verified">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{account.email}</span>
                  </td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-3 capitalize">
                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300 font-mono">
                      {account.role.replace("_", " ")}
                    </Badge>
                  </td>

                  {/* City */}
                  <td className="py-3.5 px-3 text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 inline" />
                      {account.city}
                    </span>
                  </td>

                  {/* Activity Summary */}
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {account.metric_summary}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center">
                    <Badge
                      variant={
                        account.status === "active"
                          ? "success"
                          : account.status === "warned"
                          ? "warning"
                          : "destructive"
                      }
                      className="text-[10px] capitalize px-2 py-0.5"
                    >
                      {account.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {account.status === "active" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openSanctionModal(account, "warned")}
                          className="text-[11px] h-7 border-amber-500/30 text-amber-300 hover:bg-amber-500/10 px-2"
                        >
                          Issue Warning
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openSanctionModal(account, "suspended")}
                          className="text-[11px] h-7 px-2"
                        >
                          Suspend
                        </Button>
                      </>
                    )}

                    {account.status === "warned" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => openSanctionModal(account, "active")}
                          className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700 text-white px-2"
                        >
                          Clear Warning
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openSanctionModal(account, "suspended")}
                          className="text-[11px] h-7 px-2"
                        >
                          Suspend
                        </Button>
                      </>
                    )}

                    {account.status === "suspended" && (
                      <Button
                        size="sm"
                        onClick={() => openSanctionModal(account, "active")}
                        className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                      >
                        Reinstate Account
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sanction Dialog Modal */}
      <Dialog
        open={!!selectedAccount}
        onOpenChange={(open) => !open && setSelectedAccount(null)}
        title={
          sanctionAction === "suspended"
            ? "Account Suspension Notice"
            : sanctionAction === "warned"
            ? "Issue Official Administrative Warning"
            : "Reinstate Account to Active Status"
        }
        description={`Target Entity: ${selectedAccount?.name} (${selectedAccount?.role})`}
      >
        {selectedAccount && (
          <form onSubmit={handleApplySanction} className="space-y-4 py-2 text-xs">
            <div className="p-3.5 rounded-xl bg-[#240e05]/85 border border-amber-500/25 space-y-1">
              <span className="text-amber-200/70 block font-semibold">Action Being Applied:</span>
              <span className="font-bold text-amber-400 uppercase tracking-wide">
                {sanctionAction === "suspended"
                  ? "Suspend Platform Access"
                  : sanctionAction === "warned"
                  ? "Issue Warning Flag"
                  : "Remove Sanction & Restore Active Status"}
              </span>
              <p className="text-[11px] text-amber-200/50 pt-1">
                This administrative action will be recorded in the immutable platform audit trail with your admin credentials ({CURRENT_ADMIN.name}).
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-amber-200 block mb-1">
                Official Justification & Policy Reference <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={justificationNotes}
                onChange={(e) => setJustificationNotes(e.target.value)}
                placeholder="State the violation category, complaint reference, or grounds for reinstatement..."
                className="w-full rounded-xl glass-field p-3 text-xs text-white placeholder:text-amber-200/40 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedAccount(null)}
                className="text-xs border-amber-500/30 text-amber-200/70 hover:bg-amber-500/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`text-xs font-bold ${
                  sanctionAction === "suspended"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : sanctionAction === "warned"
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                Confirm & Record in Audit Log
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
