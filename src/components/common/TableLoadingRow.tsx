import { Loader2 } from 'lucide-react';
import './TableLoadingRow.scss';

export interface TableLoadingRowProps {
  colSpan: number;
  message?: string;
  size?: number;
}

export default function TableLoadingRow({
  colSpan,
  message = '데이터를 불러오는 중입니다...',
  size = 32,
}: TableLoadingRowProps) {
  return (
    <tr className="table-loading-row">
      <td colSpan={colSpan} className="table-loading-cell">
        <div className="loading-content">
          <Loader2 size={size} className="loading-spinner-icon" />
          <p className="loading-message">{message}</p>
        </div>
      </td>
    </tr>
  );
}