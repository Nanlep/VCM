
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import { AggregatedResult, Session } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Download, Wifi, FileText, Share2, Copy, Check, Lock } from 'lucide-react';
import { Button } from './Button';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BoardroomViewProps {
  session: Session;
  results: AggregatedResult[];
  isPro: boolean;
  onUpgrade: () => void;
  onDownload: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl max-w-xs z-50">
        <h4 className="font-bold text-slate-800 text-sm mb-2">{data.name}</h4>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-50">
           <span className="text-xs text-slate-500 uppercase font-semibold">Vector Score</span>
           <span className={`text-lg font-bold ${data.vectorScore > 75 ? 'text-teal-600' : data.vectorScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>
             {data.vectorScore}
           </span>
        </div>
        <div className="space-y-1">
           <div className="flex justify-between text-xs">
              <span className="text-slate-400">Importance (35%)</span>
              <span className="font-mono font-medium text-slate-700">{data.avgImportance}</span>
           </div>
           <div className="flex justify-between text-xs">
              <span className="text-slate-400">Alignment (30%)</span>
              <span className="font-mono font-medium text-slate-700">{data.avgAlignment}</span>
           </div>
           <div className="flex justify-between text-xs">
              <span className="text-slate-400">Feasibility (20%)</span>
              <span className="font-mono font-medium text-slate-700">{data.avgFeasibility}</span>
           </div>
           <div className="flex justify-between text-xs">
              <span className="text-slate-400">Urgency (15%)</span>
              <span className="font-mono font-medium text-slate-700">{data.avgUrgency}</span>
           </div>
        </div>
      </div>
    );
  }
  return null;
};

export const BoardroomView: React.FC<BoardroomViewProps> = ({ session, results, isPro, onUpgrade, onDownload }) => {
  const [isCopied, setIsCopied] = useState(false);
  const averageVector = Math.round(results.reduce((acc, curr) => acc + curr.vectorScore, 0) / (results.length || 1));
  
  // Prepare data for Scatter Chart (Feasibility vs Importance)
  const scatterData = results.map(r => ({
    x: r.avgFeasibility, // X Axis
    y: r.avgImportance, // Y Axis
    z: r.vectorScore,   // Size/Color proxy
    name: r.name,
    avgImportance: r.avgImportance,
    avgFeasibility: r.avgFeasibility,
    avgUrgency: r.avgUrgency,
    avgAlignment: r.avgAlignment,
    vectorScore: r.vectorScore,
    fill: r.vectorScore > 75 ? '#0d9488' : r.vectorScore > 50 ? '#f59e0b' : '#ef4444'
  }));

  const handleShare = () => {
    // Generate a shareable link text
    const shareText = `🚀 Vector Clarity Results: ${session.name}\n\n🏆 Top Initiative: ${results[0]?.name || 'N/A'} (Score: ${results[0]?.vectorScore || 0})\n📈 Average Alignment: ${averageVector}/100\n\nView full report: ${window.location.origin}?join=${session.id}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const canDownload = isPro || (session.downloadsCount || 0) < 1;

  const handleExportCSV = () => {
    if (!canDownload) {
        onUpgrade();
        return;
    }

    const headers = ["Initiative", "Description", "Vector Score", "Avg Importance", "Avg Feasibility", "Avg Urgency", "Avg Alignment", "Votes"];
    const rows = results.map(r => {
      const description = session.initiatives.find(i => i.id === r.initiativeId)?.description || '';
      return [
        `"${r.name.replace(/"/g, '""')}"`,
        `"${description.replace(/"/g, '""')}"`,
        r.vectorScore,
        r.avgImportance,
        r.avgFeasibility,
        r.avgUrgency,
        r.avgAlignment,
        r.voteCount
      ];
    });
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vector_export_${session.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!isPro) onDownload();
  };

  const handleExportPDF = () => {
    if (!canDownload) {
        onUpgrade();
        return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Vector Clarity Report", 14, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text(`Session: ${session.name}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 32);

    // Summary Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text("Strategic Alignment Summary", 14, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Overall Vector Score: ${averageVector}/100`, 14, 56);
    doc.text(`Total Initiatives: ${results.length}`, 14, 61);
    doc.text(`Total Votes: ${results.reduce((acc, r) => acc + r.voteCount, 0)}`, 14, 66);

    // Table
    const tableColumn = ["Initiative", "Vector", "Imp", "Feas", "Urg", "Align", "Votes"];
    const tableRows = results.map(r => [
        r.name,
        r.vectorScore,
        r.avgImportance,
        r.avgFeasibility,
        r.avgUrgency,
        r.avgAlignment,
        r.voteCount
    ]);

    autoTable(doc, {
        startY: 75,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold' }, // Brand teal
        styles: { fontSize: 9, cellPadding: 3, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        columnStyles: { 
            0: { cellWidth: 60, fontStyle: 'bold' }, // Wider column for Name
            1: { fontStyle: 'bold', halign: 'center' },
            6: { halign: 'right' }
        } 
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Generated by Vector Clarity Mapper - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }

    doc.save(`vector_report_${session.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

    if (!isPro) onDownload();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Real-time Indicator */}
      <div className="flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
        </span>
        Live Sync Active
      </div>

      {/* Header KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 size={60} />
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Strategic Coherence</div>
          <div className="text-5xl font-extrabold flex items-center gap-3">
            {averageVector}<span className="text-2xl text-slate-500">/100</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mt-4 ${averageVector > 70 ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'}`}>
            {averageVector > 70 ? 'Strong Alignment' : 'Optimization Needed'}
          </div>
          <p className="text-xs text-slate-500 mt-4 border-t border-slate-800 pt-4">Based on {results.reduce((acc, r) => acc + r.voteCount, 0)} total data points across {session.initiatives.length} initiatives.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-2 flex flex-col justify-center">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Leading Strategic Bet</h3>
          {results[0] ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{results[0].name}</div>
                <div className="text-sm text-slate-500 line-clamp-2 max-w-lg">{
                    session.initiatives.find(i => i.id === results[0].initiativeId)?.description
                }</div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-4xl font-bold text-brand-600">{results[0].vectorScore}</div>
                <div className="text-xs text-slate-400 font-medium uppercase">Vector Score</div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 italic flex items-center gap-2"><AlertTriangle size={16}/> Not enough data yet.</div>
          )}
          
          {results[0] && (
             <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Importance</div>
                    <div className="text-lg font-bold text-slate-700">{results[0].avgImportance.toFixed(1)}</div>
                    <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${(results[0].avgImportance/5)*100}%`}}></div></div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Feasibility</div>
                    <div className="text-lg font-bold text-slate-700">{results[0].avgFeasibility.toFixed(1)}</div>
                    <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-green-500" style={{width: `${(results[0].avgFeasibility/5)*100}%`}}></div></div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Urgency</div>
                    <div className="text-lg font-bold text-slate-700">{results[0].avgUrgency.toFixed(1)}</div>
                    <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-amber-500" style={{width: `${(results[0].avgUrgency/5)*100}%`}}></div></div>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vector Score Ranking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800">Initiative Vector Ranking</h4>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-medium">Sorted by Score</span>
            </div>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results} layout="vertical" margin={{ left: 40, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={140} 
                            tick={({ x, y, payload }) => (
                                <text x={x} y={y} dy={4} textAnchor="end" fill="#64748b" fontSize={11} fontWeight={500}>
                                    {payload.value.length > 18 ? `${payload.value.substring(0, 18)}...` : payload.value}
                                </text>
                            )} 
                        />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}} 
                            content={<CustomTooltip />}
                        />
                        <Bar dataKey="vectorScore" fill="#0d9488" radius={[0, 6, 6, 0]} barSize={24} isAnimationActive={true} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Feasibility vs Importance Matrix */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
             <div className="mb-6">
                <h4 className="font-bold text-slate-800">Prioritization Matrix</h4>
                <p className="text-xs text-slate-500">Identifying quick wins vs strategic bets.</p>
            </div>
            
            <div className="h-96 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis type="number" dataKey="x" name="Feasibility" domain={[0, 6]} label={{ value: 'Feasibility →', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }} tickCount={6} />
                        <YAxis type="number" dataKey="y" name="Importance" domain={[0, 6]} label={{ value: 'Importance →', angle: -90, position: 'left', fontSize: 10, fill: '#94a3b8' }} tickCount={6}/>
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Scatter name="Initiatives" data={scatterData} isAnimationActive={true} animationDuration={500} />
                    </ScatterChart>
                </ResponsiveContainer>

                {/* Matrix Quadrant Labels */}
                <div className="absolute top-10 right-10 text-[10px] font-black text-teal-500 uppercase tracking-widest opacity-40">Quick Wins</div>
                <div className="absolute top-10 left-16 text-[10px] font-black text-amber-500 uppercase tracking-widest opacity-40">Strategic Bets</div>
                <div className="absolute bottom-16 right-10 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-40">Low Value</div>
                <div className="absolute bottom-16 left-16 text-[10px] font-black text-red-400 uppercase tracking-widest opacity-40">Avoid</div>
            </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h4 className="font-bold text-slate-800">Aggregated Scoring Data</h4>
                <p className="text-xs text-slate-500">Granular breakdown of voting dimensions.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleShare} className="gap-2 h-9 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20">
                    {isCopied ? <Check size={14} /> : <Share2 size={14} />} {isCopied ? 'Link Copied!' : 'Share Results'}
                </Button>
                <div className="h-9 w-px bg-slate-300 mx-1"></div>
                
                {/* CSV Export */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportCSV} 
                    className={`gap-2 h-9 text-xs font-bold hover:border-brand-300 hover:text-brand-600 ${!canDownload ? 'opacity-80' : ''}`}
                >
                    {canDownload ? <Download size={14} /> : <Lock size={14} className="text-amber-500" />} CSV
                </Button>
                
                {/* PDF Export */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportPDF} 
                    className={`gap-2 h-9 text-xs font-bold hover:border-brand-300 hover:text-brand-600 ${!canDownload ? 'opacity-80' : ''}`}
                >
                     {canDownload ? <FileText size={14} /> : <Lock size={14} className="text-amber-500" />} PDF
                </Button>
              </div>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                      <tr>
                          <th className="px-6 py-4 font-semibold">Initiative</th>
                          <th className="px-6 py-4 font-semibold text-brand-700">Vector</th>
                          <th className="px-6 py-4 font-semibold">Importance</th>
                          <th className="px-6 py-4 font-semibold">Feasibility</th>
                          <th className="px-6 py-4 font-semibold">Urgency</th>
                          <th className="px-6 py-4 font-semibold">Alignment</th>
                          <th className="px-6 py-4 font-semibold text-right">Votes</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {results.map((r) => (
                          <tr key={r.initiativeId} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{r.name}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-1 rounded font-bold text-xs ${r.vectorScore >= 75 ? 'bg-teal-100 text-teal-800' : r.vectorScore >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                    {r.vectorScore}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{r.avgImportance}</td>
                              <td className="px-6 py-4 text-slate-600">{r.avgFeasibility}</td>
                              <td className="px-6 py-4 text-slate-600">{r.avgUrgency}</td>
                              <td className="px-6 py-4 text-slate-600">{r.avgAlignment}</td>
                              <td className="px-6 py-4 text-right font-mono text-slate-400">{r.voteCount}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
