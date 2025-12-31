
import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { Receipt } from './components/Receipt';
import { WritingEntry } from './types';

const STORAGE_KEY = 'novel_writing_entries_v2';

const App: React.FC = () => {
  const [entries, setEntries] = useState<WritingEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<WritingEntry | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (entry: WritingEntry) => {
    setEntries(prev => [...prev, entry]);
  };

  const handleUpdateEntry = (updatedEntry: WritingEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: WritingEntry) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEntry = (id: string) => {
    // 移除 window.confirm 以防在某些环境下被静默拦截
    setEntries(prev => prev.filter(e => e.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  };

  const handleClear = () => {
    // 移除 window.confirm
    setEntries([]);
    setEditingEntry(null);
  };

  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight sm:text-5xl mb-2 drop-shadow-sm">
            写手年终总结
          </h1>
          <p className="text-lg text-sky-600 font-medium">
            这一年到底在码字这件事上花了多少时间呢？
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <section>
            <InputForm 
              onAdd={handleAddEntry} 
              onUpdate={handleUpdateEntry} 
              editingEntry={editingEntry}
              onCancelEdit={() => setEditingEntry(null)}
            />
            <div className="mt-8 bg-pink-50 border border-pink-100 rounded-2xl p-6 text-pink-900 text-sm shadow-sm">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                使用指南
              </h3>
              <ul className="list-decimal list-inside space-y-3 opacity-90 text-sky-800 leading-relaxed">
                <li>
                  按照指引添加篇目即可！连载作品点击按钮后获取更多选项。
                </li>
                <li>
                  鼠标悬浮在条目上会显示删改按钮。
                </li>
              </ul>
            </div>
          </section>

          <section className="sticky top-8">
            <Receipt 
              entries={entries} 
              onDelete={handleDeleteEntry}
              onEdit={handleEditEntry}
              onClear={handleClear}
            />
          </section>
        </div>
        
        <footer className="mt-20 text-center text-sky-300 text-xs">
          &copy; {new Date().getFullYear()} ANNUAL WRITING BILL • THINK, WRITE, CREATE
        </footer>
      </div>
    </div>
  );
};

export default App;
