
import React, { useRef } from 'react';
import { ReceiptProps, WritingEntry } from '../types';
import html2canvas from 'html2canvas';

const monthOrder = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export const Receipt: React.FC<ReceiptProps> = ({
  entries,
  onDelete,
  onEdit,
  onClear
}) => {
  const captureRef = useRef<HTMLDivElement>(null);

  // Sort entries chronologically by month
  const sortedEntries = [...entries].sort((a, b) => {
    const aIndex = monthOrder.indexOf(a.month);
    const bIndex = monthOrder.indexOf(b.month);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.timestamp - b.timestamp;
  });

  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
  const now = new Date();
  const dateStr = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const handleDownloadImage = async () => {
    if (!captureRef.current) return;
    
    const canvas = await html2canvas(captureRef.current, {
      backgroundColor: '#f0f9ff',
      scale: 3,
      logging: false,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.download = `writing-receipt-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="max-w-md mx-auto relative group">
      {/* Top Controls - Always Interactive */}
      <div 
        className="flex justify-between items-center mb-4 transition-opacity group-hover:opacity-100 opacity-60"
        data-html2canvas-ignore="true"
      >
        <button 
          onClick={handleDownloadImage}
          disabled={entries.length === 0}
          className="text-xs font-bold text-pink-500 hover:text-pink-700 disabled:opacity-30 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-pink-100 transition-all hover:scale-105 active:scale-95 z-50 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          保存图片
        </button>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-sky-500 hover:text-red-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-sky-100 transition-all hover:scale-105 active:scale-95 z-50 cursor-pointer"
        >
          清空全部
        </button>
      </div>

      {/* Capture Area */}
      <div ref={captureRef} className="bg-sky-50 p-6 sm:p-10 rounded-3xl">
        <div className="bg-white shadow-2xl pb-10 overflow-hidden relative border-t-8 border-sky-400 rounded-sm">
          <div className="p-8 receipt-font text-gray-800 relative">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-widest uppercase mb-1 text-sky-900">ANNUAL WRITING BILL</h1>
              <p className="text-[10px] text-pink-400 font-bold uppercase">ARCHIVE OF YOUR OWN</p>
              <div className="mt-4 border-y border-dashed border-sky-200 py-1 text-[10px] flex justify-between text-sky-400 font-bold">
                <span>INV #AnnualReport</span>
                <span>{dateStr}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 text-xs font-bold border-b border-sky-100 pb-2 mb-4 text-sky-700">
              <div className="col-span-2">MO.</div>
              <div className="col-span-7">TITLE</div>
              <div className="col-span-3 text-right">WORD COUNT</div>
            </div>

            <div className="space-y-6 mb-8">
              {sortedEntries.length === 0 ? (
                <div className="text-center py-10 text-sky-200 italic text-sm">
                  空空如也的行囊...
                </div>
              ) : (
                sortedEntries.map((entry) => (
                  <div key={entry.id} className="grid grid-cols-12 gap-2 text-sm group/item relative py-2 items-center">
                    <div className="col-span-2 text-xs text-sky-300 font-bold">{entry.month}</div>
                    <div className="col-span-7">
                      <div className="font-bold leading-tight text-gray-700">《{entry.title}》</div>
                      {entry.isSerial && entry.chapters && (
                        <div className="text-[10px] text-sky-400 mt-1 uppercase italic font-bold">
                          {entry.chapters}
                        </div>
                      )}
                      {entry.isFinished && (
                        <span className="inline-block mt-1 border border-pink-500 text-pink-500 text-[8px] px-1 font-black rounded uppercase">
                          Finished
                        </span>
                      )}
                    </div>

                    <div className="col-span-3 text-right tabular-nums font-bold text-sky-900 relative">
                      <span className="group-hover/item:opacity-0 transition-opacity duration-200">
                        {entry.wordCount.toLocaleString()}
                      </span>
                      
                      {/* Entry Actions */}
                      <div 
                        className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity z-50 pointer-events-auto"
                        data-html2canvas-ignore="true"
                      >
                        <button 
                          onClick={() => onEdit(entry)}
                          className="text-sky-500 hover:bg-sky-500 hover:text-white font-bold text-[10px] bg-white px-2 py-1 rounded border border-sky-200 shadow-sm cursor-pointer transition-colors"
                        >
                          改
                        </button>
                        <button 
                          onClick={() => onDelete(entry.id)}
                          className="text-pink-500 hover:bg-pink-500 hover:text-white font-bold text-[10px] bg-white px-2 py-1 rounded border border-pink-200 shadow-sm cursor-pointer transition-colors"
                        >
                          删
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t-2 border-dashed border-sky-100 pt-4 space-y-2">
              <div className="flex justify-between text-[10px] text-sky-400 font-bold">
                <span>COUNT OF WORKS</span>
                <span>{entries.length}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-sky-100 pt-2 text-pink-500">
                <span>GRAND TOTAL</span>
                <span className="tabular-nums">{totalWords.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-12 text-center text-[10px] text-sky-200 tracking-[0.2em] space-y-2">
              <p>THINK, WRITE, CREATE</p>
              <p className="text-pink-200 font-bold">HAPPY WRITING!</p>
              <div className="mt-6 flex justify-center opacity-10">
                 <div className="flex h-6 gap-[2px]">
                    {[2, 1, 4, 2, 3, 5, 2, 4, 1, 2, 3].map((w, i) => (
                      <div key={i} className="bg-black" style={{ width: `${w}px` }}></div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full flex overflow-hidden opacity-30 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-sky-50 rounded-full shrink-0" style={{ transform: 'translateY(50%)' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
