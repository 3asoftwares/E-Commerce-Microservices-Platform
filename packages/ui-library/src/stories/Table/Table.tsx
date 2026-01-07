export interface Column<T> {
  
  header?: string;
  
  label?: string;
  
  accessor?: keyof T;
  
  key?: string;
  
  cell?: (row: T) => React.ReactNode;
  
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  
  columns: Column<T>[];
  
  data: T[];
  
  loading?: boolean;
  
  emptyMessage?: string;
  
  hoverable?: boolean;
  
  striped?: boolean;
  
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  hoverable = true,
  striped = false,
  onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full p-8 text-center bg-white rounded-lg shadow-sm">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-3 text-base font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-700 font-medium bg-gray-50 rounded-lg border-2 border-gray-200">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-md bg-white dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-3 py-3 md:px-6 md:py-4 text-left font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide whitespace-nowrap"
                scope="col"
              >
                {column.header || column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`
                ${hoverable ? 'hover:bg-blue-50 dark:hover:bg-gray-800' : ''}
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-900' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
                transition-colors duration-150
              `}
            >
              {columns.map((column, colIndex) => {
                const accessor = column.accessor || column.key;
                const renderer = column.cell || column.render;
                return (
                  <td
                    key={colIndex}
                    className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-gray-900 dark:text-gray-100"
                    style={{ minWidth: 120 }}
                  >
                    {renderer ? renderer(row) : accessor ? row[accessor as keyof T] : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
