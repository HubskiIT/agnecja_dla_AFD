
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
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-xs font-mono uppercase bg-brand-purple/20 text-brand-purple px-2 py-1 rounded">
                                        {idea.platform || 'Web'}
                                    </span>
                                    {idea.format && (
                                        <span className="text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 px-2 py-1 rounded border border-pink-500/30">
                                            {idea.format === 'Reel' && '🎥'}
                                            {idea.format === 'Carousel' && '🖼️'}
                                            {idea.format === 'Static' && '📸'}
                                            {idea.format === 'Text Post' && '📝'}
                                            {idea.format === 'Short Video' && '⚡'}
                                            {idea.format === 'Long Video' && '🎬'}
                                            {idea.format === 'PDF Guide' && '📄'}
                                            {idea.format === 'Image Post' && '🌄'}
                                            {idea.format === 'Poll' && '📊'}
                                            {' '}{idea.format}
                                        </span>
                                    )}
                                    {idea.scheduled_date && (
                                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                                            📅 {new Date(idea.scheduled_date).toLocaleDateString('pl-PL')}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500">{new Date(idea.created_at).toLocaleDateString()}</span>
                                    {idea.source && <span className="text-xs text-gray-600">Source: {idea.source}</span>}
                                </div>
                                <h2 className="text-xl font-semibold text-white">{idea.title}</h2>
                                <p className="text-gray-400 mt-2 line-clamp-2 max-w-3xl">{idea.description || idea.content}</p>
                                {idea.creation_details && (
                                    <details className="mt-3 text-sm">
                                        <summary className="cursor-pointer text-brand-purple hover:text-brand-purple-light transition-colors">
                                            🎬 Instrukcje tworzenia
                                        </summary>
                                        <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-gray-300">
                                            {typeof idea.creation_details === 'string'
                                                ? idea.creation_details
                                                : JSON.parse(idea.creation_details).instructions || 'Brak instrukcji'}
                                        </div>
                                    </details>
                                )}
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
