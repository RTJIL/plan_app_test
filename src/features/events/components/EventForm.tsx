import React, { useState } from 'react'

import type { EventFormProps } from '../types'

export default function EventForm({
  initial = {},
  onSave,
  onClose,
  onDelete,
}: EventFormProps) {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [importance, setImportance] = useState(initial.importance || 'low')
  const [start, setStart] = useState(initial.start || new Date())
  const [end, setEnd] = useState(
    initial.end || new Date(new Date().getTime() + 60 * 60 * 1000)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initial.id) {
      onSave({ id: initial.id, title, description, importance, start, end })
    } else {
      onSave({ title, description, importance, start, end })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-80"
      >
        <h3 className="font-bold mb-4">
          {initial.id ? 'Edit Event' : 'New Event'}
        </h3>
        <input
          className="border p-1 mb-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-1 mb-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border p-1 mb-2 w-full"
          value={importance}
          onChange={(e) => {
            const newValue = e.target.value
            if (
              newValue === 'low' ||
              newValue === 'medium' ||
              newValue === 'high'
            ) {
              setImportance(newValue)
            }
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label>Start:</label>
        <input
          type="datetime-local"
          className="border p-1 mb-2 w-full"
          value={start.toISOString().slice(0, 16)}
          onChange={(e) => setStart(new Date(e.target.value))}
        />
        <label>End:</label>
        <input
          type="datetime-local"
          className="border p-1 mb-2 w-full"
          value={end.toISOString().slice(0, 16)}
          onChange={(e) => setEnd(new Date(e.target.value))}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            className="px-3 py-1 border rounded text-red-600 cursor-pointer"
            onClick={() => {
              if (initial?.id && onDelete) {
                onDelete(initial.id)
                onClose()
              }
            }}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}