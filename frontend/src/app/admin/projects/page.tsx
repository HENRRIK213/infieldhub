"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Plus, Calendar, Clock, AlignLeft, ArrowLeft } from "lucide-react";

export default function GanttChartPage() {
  const [projectTitle, setProjectTitle] = useState("New Project Work Plan");
  const [taskName, setTaskName] = useState("");
  const [startWeek, setStartWeek] = useState(1);
  const [duration, setDuration] = useState(1);
  const [color, setColor] = useState("#3B82F6"); // Default Tailwind Blue
  
  const [tasks, setTasks] = useState([
    { id: "001", name: "Mobilisation & Layout", start: 1, duration: 2, color: "#3B82F6" },
    { id: "002", name: "Trenching Works", start: 2, duration: 9, color: "#F59E0B" },
    { id: "003", name: "Pipe Position & Jointing", start: 4, duration: 11, color: "#8B5CF6" },
  ]);

  const handleAddTask = () => {
    if (!taskName) return alert("Please enter a task name");
    
    const newTask = {
      id: String(tasks.length + 1).padStart(3, '0'),
      name: taskName,
      start: Number(startWeek),
      duration: Number(duration),
      color: color
    };
    
    setTasks([...tasks, newTask]);
    setTaskName("");
    setStartWeek(1);
    setDuration(1);
  };

  const predefinedColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Orange
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#64748B"  // Slate
  ];

  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR - BUILDER */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Gantt Builder</h2>
          <p className="text-xs text-gray-500 mt-1">Add and customize your project timeline.</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Project Title</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Add New Task Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center">
              <Plus className="w-4 h-4 mr-2 text-blue-600" /> Add New Task
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Task Name</label>
              <input 
                type="text" 
                placeholder="e.g. Site Excavation"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Week</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="number" 
                    min="1" max="12"
                    value={startWeek}
                    onChange={(e) => setStartWeek(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration (Days)</label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="number" 
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Task Color</label>
              <div className="flex space-x-2">
                {predefinedColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-gray-800 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddTask}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-lg transition shadow-sm mt-2 flex justify-center items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Task to Timeline
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - GANTT CHART PREVIEW */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 p-4 px-8 flex justify-between items-center shadow-sm z-10">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Timeline Preview</h1>
            <p className="text-xs text-gray-500">Live rendering of your project schedule.</p>
          </div>
          
          {/* BUTTONS */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/admin" 
              className="px-4 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center text-sm shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition flex items-center text-sm">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </button>
          </div>
        </div>

        {/* Scrollable Chart Area */}
        <div className="flex-1 overflow-auto p-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-w-[1000px] overflow-hidden">
            
            {/* Document Header inside chart */}
            <div className="p-8 border-b border-gray-200">
              <p className="text-xs text-gray-500 font-medium mb-4">P.O BOX 62700-19052 Meru Township • 0701243548</p>
              <h2 className="text-2xl font-extrabold text-[#0D2B4E] uppercase tracking-wide">{projectTitle}</h2>
            </div>

            {/* Gantt Grid Header */}
            <div className="grid grid-cols-[60px_250px_60px_repeat(12,1fr)] bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <div className="p-3 border-r border-gray-200 text-center">ID</div>
              <div className="p-3 border-r border-gray-200">Task Description</div>
              <div className="p-3 border-r border-gray-200 text-center">Dur</div>
              {weeks.map(w => (
                <div key={w} className="p-3 text-center border-r border-gray-200 last:border-0">Wk {w}</div>
              ))}
            </div>

            {/* Gantt Rows */}
            <div className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-[60px_250px_60px_repeat(12,1fr)] hover:bg-blue-50/30 transition group">
                  
                  <div className="p-3 border-r border-gray-100 text-center text-sm font-medium text-gray-500">
                    {task.id}
                  </div>
                  
                  <div className="p-3 border-r border-gray-100 text-sm font-semibold text-gray-800">
                    {task.name}
                  </div>
                  
                  <div className="p-3 border-r border-gray-100 text-center text-sm text-gray-600">
                    {task.duration} d
                  </div>
                  
                  <div className="col-span-12 relative py-3 px-1 flex items-center">
                    <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                      {weeks.map(w => <div key={w} className="border-r border-gray-100 last:border-0"></div>)}
                    </div>
                    
                    <div 
                      className="relative h-6 rounded-md shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                      style={{ 
                        gridColumnStart: task.start, 
                        gridColumnEnd: task.start + task.duration,
                        backgroundColor: task.color,
                        width: '100%',
                        marginLeft: '2px',
                        marginRight: '2px'
                      }}
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-md transition-opacity"></div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {tasks.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                No tasks added to the timeline yet.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

