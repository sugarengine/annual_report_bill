
import React, { useState, useEffect } from 'react';
import { WritingEntry } from '../types';

interface InputFormProps {
  onAdd: (entry: WritingEntry) => void;
  onUpdate: (entry: WritingEntry) => void;
  editingEntry: WritingEntry | null;
  onCancelEdit: () => void;
}

export const months = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export const InputForm: React.FC<InputFormProps> = ({ onAdd, onUpdate, editingEntry, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState<string>('');
  const currentMonth = months[new Date().getMonth()];
  const [month, setMonth] = useState(currentMonth);
  const [isSerial, setIsSerial] = useState(false);
  const [chapters, setChapters] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setWordCount(editingEntry.wordCount.toString());
      setMonth(editingEntry.month);
      setIsSerial(editingEntry.isSerial);
      setChapters(editingEntry.chapters || '');
      setIsFinished(editingEntry.isFinished || false);
    } else {
      resetForm();
    }
  }, [editingEntry]);

  const resetForm = () => {
    setTitle('');
    setWordCount('');
    setMonth(currentMonth);
    setChapters('');
    setIsFinished(false);
    setIsSerial(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !wordCount) return;

    const entryData = {
      id: editingEntry ? editingEntry.id : Math.random().toString(36).substr(2, 9),
      title,
      wordCount: parseInt(wordCount, 10),
      month,
      isSerial,
      chapters: isSerial ? chapters : undefined,
      isFinished: isSerial ? isFinished : undefined,
      timestamp: editingEntry ? editingEntry.timestamp : Date.now(),
    };

    if (editingEntry) {
      onUpdate(entryData);
    } else {
      onAdd(entryData);
    }

    resetForm();
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-xl border-t-4 transition-all ${editingEntry ? 'border-pink-500 ring-2 ring-pink-100' : 'border-sky-300 shadow-sky-100/50'}`}>
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${editingEntry ? 'bg-pink-100 text-pink-600' : 'bg-sky-100 text-sky-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
        {editingEntry ? '修改条目' : '添加篇目'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-sky-700 mb-1">作品标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-sky-100 bg-sky-50/30 focus:bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all placeholder:text-sky-200"
            placeholder="例如：《大秽》"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">创作月份</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-sky-100 bg-sky-50/30 focus:bg-white focus:ring-2 focus:ring-pink-300 outline-none"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">本次字数</label>
            <input
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-sky-100 bg-sky-50/30 focus:bg-white focus:ring-2 focus:ring-pink-300 outline-none"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2 py-1">
          <input
            id="serial-toggle"
            type="checkbox"
            checked={isSerial}
            onChange={(e) => setIsSerial(e.target.checked)}
            className="w-4 h-4 text-pink-500 border-sky-200 rounded focus:ring-pink-400"
          />
          <label htmlFor="serial-toggle" className="text-sm font-medium text-sky-700 cursor-pointer hover:text-pink-500 transition-colors">
            连载作品
          </label>
        </div>

        {isSerial && (
          <div className="space-y-4 p-4 bg-sky-50 rounded-xl border border-sky-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-sm font-medium text-sky-600 mb-1 font-bold">完成章节</label>
              <input
                type="text"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white focus:ring-2 focus:ring-pink-300 outline-none shadow-sm"
                placeholder="例如：1-3章，番外2，真相线等"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="finished-toggle"
                type="checkbox"
                checked={isFinished}
                onChange={(e) => setIsFinished(e.target.checked)}
                className="w-4 h-4 text-pink-500 border-white rounded focus:ring-pink-400"
              />
              <label htmlFor="finished-toggle" className="text-sm font-bold text-pink-600 cursor-pointer">
                宣告完结 ✨
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {editingEntry && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 bg-sky-100 text-sky-700 py-3 rounded-xl font-bold hover:bg-sky-200 transition-colors active:scale-95 duration-100"
            >
              取消
            </button>
          )}
          <button
            type="submit"
            className="flex-[2] bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 active:scale-95 duration-100"
          >
            {editingEntry ? '保存修改' : '加入账单'}
          </button>
        </div>
      </form>
    </div>
  );
};
