
export interface WritingEntry {
  id: string;
  title: string;
  wordCount: number;
  month: string;
  isSerial: boolean;
  chapters?: string;
  isFinished?: boolean;
  timestamp: number;
}

export interface ReceiptProps {
  entries: WritingEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: WritingEntry) => void;
  onClear: () => void;
}
