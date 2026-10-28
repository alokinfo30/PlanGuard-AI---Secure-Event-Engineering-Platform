import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  FileCheck, 
  Calendar, 
  Building, 
  Phone, 
  Tag, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { VendorChecklistItem } from '../../types';

interface VendorChecklistModuleProps {
  activeTenant: string;
  onNavigateToTab?: (tab: string) => void;
}

export const VendorChecklistModule: React.FC<VendorChecklistModuleProps> = ({
  activeTenant,
  onNavigateToTab
}) => {
  const [checklist, setChecklist] = useState<VendorChecklistItem[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'signed' | 'paid'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('General');
  const [newTaskWeeks, setNewTaskWeeks] = useState(8);
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskCost, setNewTaskCost] = useState(1500);
  const [newTaskVendor, setNewTaskVendor] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Fetch from server
  const loadChecklist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events', {
        headers: {
          'x-user-id': activeTenant,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          const evt = data.events[0];
          setEventTitle(evt.title);
          setTargetDate(evt.targetDate);
          setChecklist(evt.vendorChecklist || []);
        }
      }
    } catch (err) {
      console.error('Failed to load vendor checklist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, [activeTenant]);

  // Cycle status
  const handleCycleStatus = async (item: VendorChecklistItem) => {
    const cycleMap: Record<string, 'pending' | 'contacted' | 'signed' | 'paid'> = {
      pending: 'contacted',
      contacted: 'signed',
      signed: 'paid',
      paid: 'pending'
    };
    const nextStatus = cycleMap[item.status] || 'pending';

    // Optimistic UI update
    setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, status: nextStatus } : c));

    try {
      await fetch('/api/events/checklist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeTenant,
        },
        body: JSON.stringify({
          checklistId: item.id,
          newStatus: nextStatus,
        }),
      });
    } catch (err) {
      console.error('Failed to persist status change:', err);
    }
  };

  // Add Custom Task
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const eventDateObj = targetDate ? new Date(targetDate) : new Date(Date.now() + 90 * 86400000);
    const dueDateObj = new Date(eventDateObj);
    dueDateObj.setDate(dueDateObj.getDate() - (newTaskWeeks * 7));

    const newItem: VendorChecklistItem = {
      id: `chk-custom-${Date.now()}`,
      task: newTaskTitle.trim(),
      category: newTaskCategory,
      deadlineWeeksBefore: newTaskWeeks,
      dueDate: dueDateObj.toISOString().split('T')[0],
      priority: newTaskPriority,
      estimatedCost: Number(newTaskCost) || 0,
      status: 'pending',
      assignedVendorName: newTaskVendor.trim() || undefined,
      notes: newTaskNotes.trim() || undefined,
    };

    setChecklist(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTaskTitle('');
    setNewTaskVendor('');
    setNewTaskNotes('');
  };

  // Compute Metrics
  const totalTasks = checklist.length;
  const completedOrSigned = checklist.filter(c => c.status === 'signed' || c.status === 'paid').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedOrSigned / totalTasks) * 100) : 0;
  
  const totalEstimatedCost = checklist.reduce((acc, c) => acc + (c.estimatedCost || 0), 0);
  const committedCost = checklist
    .filter(c => c.status === 'signed' || c.status === 'paid')
    .reduce((acc, c) => acc + (c.estimatedCost || 0), 0);

  // Categories list for filter
  const categoriesList = ['all', ...Array.from(new Set(checklist.map(c => c.category)))];

  // Filtered Checklist
  const filteredChecklist = checklist.filter(item => {
    const matchesSearch = item.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.assignedVendorName && item.assignedVendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/70 text-amber-300 border border-amber-500/30">
              Procurement &amp; Contracts
            </span>
            <span className="text-xs text-slate-400">
              Target Event: <strong className="text-white">{eventTitle || 'Active Event'}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Vendor Procurement Checklist &amp; Task Board
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Track contractual milestones, vendor commitments, insurance compliance, and payment schedules backwards from your event date.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor Task</span>
          </button>
          
          <button
            onClick={loadChecklist}
            title="Refresh checklist from server"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Procurement Progress</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white">
              {completionPercentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({completedOrSigned}/{totalTasks} tasks)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Estimated Cost</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">
            ${totalEstimatedCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {checklist.length} vendor deliverables
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Committed / Signed</span>
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono">
            ${committedCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Locked in under executed contracts
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Negotiations</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
            {checklist.filter(c => c.status === 'pending' || c.status === 'contacted').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Require follow-up &amp; quote vetting
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks, vendors, or notes..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'contacted', 'signed', 'paid'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Table / Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <span className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            Loading procurement checklists...
          </div>
        ) : filteredChecklist.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs space-y-2">
            <p>No vendor tasks matching your current filters.</p>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('assistant')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Generate Plan via AI Assistant
              </button>
            )}
          </div>
        ) : (
          filteredChecklist.map((item) => {
            const isCompleted = item.status === 'signed' || item.status === 'paid';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Task Name, Status Toggle, Meta */}
                  <div className="flex items-start gap-3">
                    {/* Status Toggle Button */}
                    <button
                      onClick={() => handleCycleStatus(item)}
                      title={`Current: ${item.status}. Click to advance.`}
                      className={`mt-0.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border shrink-0 transition flex items-center gap-1.5 ${
                        item.status === 'paid'
                          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                          : item.status === 'signed'
                          ? 'bg-indigo-950/70 border-indigo-500/50 text-indigo-300'
                          : item.status === 'contacted'
                          ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300'
                          : 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.status}</span>
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold text-white ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                          {item.task}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          item.priority === 'high' ? 'bg-red-950/70 text-red-300 border border-red-500/40' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.priority}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {item.category}
                        </span>
                        
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Due: {item.dueDate} ({item.deadlineWeeksBefore}w out)
                        </span>

                        {item.assignedVendorName && (
                          <span className="flex items-center gap-1 text-cyan-300">
                            <Building className="w-3 h-3" />
                            {item.assignedVendorName}
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-1.5">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Estimated Cost */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-emerald-400 font-mono">
                      ~${item.estimatedCost.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Estimated Allocation
                    </span>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add Vendor Procurement Task
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deliverable / Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Finalize Acoustic Sound Engineer Rider"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    placeholder="Venue, Catering, Florals, etc."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Deadline (Weeks Before Event)
                  </label>
                  <input
                    type="number"
                    value={newTaskWeeks}
                    onChange={(e) => setNewTaskWeeks(Number(e.target.value))}
                    min={1}
                    max={52}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    value={newTaskCost}
                    onChange={(e) => setNewTaskCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assigned Vendor Name (Optional)
                </label>
                <input
                  type="text"
                  value={newTaskVendor}
                  onChange={(e) => setNewTaskVendor(e.target.value)}
                  placeholder="e.g., Apex Staging or Meadowood Glasshouse"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes &amp; Contract Clauses
                </label>
                <textarea
                  rows={2}
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Special stipulations, payment due dates, insurance COI"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold transition disabled:opacity-50"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
