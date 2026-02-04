
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function IdeasPage() {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandingId, setExpandingId] = useState<string | null>(null);

    async function handleExpand(idea: any) {
        setExpandingId(idea.id);
        try {
            const res = await fetch('/api/ideas/expand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(idea),
            });
            if (!res.ok) throw new Error('Failed to start expansion');
            alert('AI Expansion Started! Check your Drafts in a few moments.');
        } catch (e) {
            console.error(e);
            alert('Error starting expansion. Check console.');
        } finally {
            setExpandingId(null);
        }
    }

    useEffect(() => {
        async function fetchIdeas() {
            const { data, error } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
            if (data) setIdeas(data);
            setLoading(false);
        }
        fetchIdeas();
    }, []);

    return (
        <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-sans)]">
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="text-brand-purple" /> TrendRadar Inbox
                </h1>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Back to Dashboard</Link>
            </header>

            {loading ? (
                <div className="p-20 text-center animate-pulse">Loading TrendRadar data...</div>
            ) : (
                <div className="grid gap-4">
                    {ideas.map((idea) => (
                        <div key={idea.id} className="glass p-6 rounded-xl flex flex-col md:flex-row justify-between items-start gap-4 group hover:border-brand-purple/50 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-mono uppercase bg-brand-purple/20 text-brand-purple px-2 py-1 rounded">
                                        {idea.platform || 'Web'}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(idea.created_at).toLocaleDateString()}</span>
                                    <span className="text-xs text-gray-600">Source: {idea.source}</span>
                                </div>
                                <h2 className="text-xl font-semibold text-white">{idea.title}</h2>
                                <p className="text-gray-400 mt-2 line-clamp-2 max-w-3xl">{idea.description}</p>
                                {idea.url && (
                                    <a href={idea.url} target="_blank" className="text-xs text-blue-400 hover:underline mt-2 block">View Original Source</a>
                                )}
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete">
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={() => handleExpand(idea)}
                                    disabled={expandingId === idea.id}
                                    className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {expandingId === idea.id ? (
                                        <>Processing...</>
                                    ) : (
                                        <>Draft Post <ArrowRight size={16} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    {ideas.length === 0 && (
                        <div className="text-center py-20 opacity-50 border border-dashed border-white/10 rounded-xl">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>No new ideas found.</p>
                            <p className="text-sm">TrendRadar is scanning the web for viral content...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
