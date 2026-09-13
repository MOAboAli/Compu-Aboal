import { useMemo, useState } from 'react';

export default function DataTable({
  columns = [],
  rows = [],
  rowKey = '_id',
  emptyMessage = 'No records found.',
  searchable = true,
  searchPlaceholder = 'Search…',
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      columns.some((col) => {
        if (col.searchValue) {
          return String(col.searchValue(row) ?? '')
            .toLowerCase()
            .includes(q);
        }
        if (col.render) return false;
        return String(row[col.key] ?? '')
          .toLowerCase()
          .includes(q);
      })
    );
  }, [rows, columns, query]);

  return (
    <div className="data-table-wrap">
      {searchable ? (
        <div className="data-table-toolbar">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
          <span className="muted data-table-count">
            {filtered.length} / {rows.length}
          </span>
        </div>
      ) : null}
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className || undefined}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((row, index) => {
                const key = typeof rowKey === 'function' ? rowKey(row) : row[rowKey] || index;
                return (
                  <tr key={key}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.className || undefined}>
                        {col.render ? col.render(row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="data-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
