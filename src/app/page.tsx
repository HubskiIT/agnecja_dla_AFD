
import Link from 'next/link';
import { Sparkles, Calendar, PenTool, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-sans)]">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Content Factory
          </h1>
          <p className="text-gray-400 mt-2">Manage your digital empire.</p>
        </div>
        <div className="flex gap-4">
          {/* Placeholder for user profile */}
          <div className="w-10 h-10 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center text-brand-purple">
            H
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="glass p-6 rounded-2xl col-span-full mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-purple" />
            Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-gray-400 text-sm">New Ideas</span>
              <p className="text-3xl font-bold mt-1">12</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-gray-400 text-sm">Drafts</span>
              <p className="text-3xl font-bold mt-1 text-yellow-400">3</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-gray-400 text-sm">Scheduled</span>
              <p className="text-3xl font-bold mt-1 text-green-400">5</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <Link href="/ideas" className="glass glass-hover p-6 rounded-2xl group cursor-pointer block">
          <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">TrendRadar Inbox</h3>
          <p className="text-gray-400 text-sm">Review 12 new viral inspirations captured from the web.</p>
        </Link>

        <Link href="/calendar" className="glass glass-hover p-6 rounded-2xl group cursor-pointer block">
          <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Content Calendar</h3>
          <p className="text-gray-400 text-sm">Plan your posts for February. Drag and drop to reschedule.</p>
        </Link>

        <Link href="/posts/new" className="glass glass-hover p-6 rounded-2xl group cursor-pointer block opacity-50">
          <div className="h-12 w-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
            <PenTool className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Manual Entry</h3>
          <p className="text-gray-400 text-sm">Write a post from scratch without AI assistance.</p>
        </Link>

      </main>
    </div>
  );
}
