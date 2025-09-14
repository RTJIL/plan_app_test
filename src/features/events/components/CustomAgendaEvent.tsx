import type { CustomAgendaEventProps } from '../types'

export default function CustomAgendaEvent({ event }: CustomAgendaEventProps) {
  return (
    <div>

    <div className="padding-4px-0">
      <strong>Task: {event.title}</strong>
      {event.description && <div>Description: {event.description}</div>}
      <div> Priority: {event.importance || 'low'}</div>
    </div>

    <div>
      <button></button>
      
      <button></button>

    </div>
    </div>
  )
}
