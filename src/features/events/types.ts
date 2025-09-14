export interface Event {
  id: string
  title: string
  description?: string
  importance: 'low' | 'medium' | 'high'
  start: Date
  end: Date
}

export type EventFormSave = Partial<Event> & {
  title: string
  description: string
  importance: 'low' | 'medium' | 'high'
  start: Date
  end: Date
}

export type EventFormProps = {
  initial?: Partial<Event>
  onSave: (event: EventFormSave) => void
  onClose: () => void
  onDelete?: (id: string) => void
}

export interface CustomAgendaEventProps {
  event: Event
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
}

export type Importance = 'low' | 'medium' | 'high'
