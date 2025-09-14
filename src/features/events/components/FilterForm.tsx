import type { Importance, FilterFormProps } from "../types";

export default function FilterForm({ textFilter, setTextFilter, importanceFilter, setImportanceFilter }: FilterFormProps) {
  return (
    <div className="flex gap-2 mb-4 justify-center">
      <input
        type="text"
        placeholder="Search by title..."
        value={textFilter}
        onChange={(e) => setTextFilter(e.target.value)}
        className="border p-1 rounded"
      />

      <select
        value={importanceFilter}
        onChange={(e) => {
          const selectedImportance = e.target.value as Importance;
          if (selectedImportance) setImportanceFilter(selectedImportance);
        }}
        className="border p-1 rounded"
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
