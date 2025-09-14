import { useEffect, useState } from 'react'
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
} from 'react-big-calendar'
import type { View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'

import type { Event, Importance } from './types'

import EventForm from './components/EventForm'
import CustomAgendaEvent from './components/CustomAgendaEvent'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: {},
})

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date
    end: Date
  } | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [view, setView] = useState<View>(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())

  console.log(events)

  useEffect(() => {
    const fetch = async () => {
      const user = auth.currentUser
      if (!user) return

      const q = query(collection(db, 'events'), where('userId', '==', user.uid))
      const store = await getDocs(q)

      const data = store.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || 'Noname',
        description: doc.data().description || '',
        importance: doc.data().importance || '',
        start: new Date(doc.data().start.seconds * 1000),
        end: new Date(doc.data().end.seconds * 1000),
      }))

      setEvents(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const addEvent = async (
    title: string,
    description: string = '',
    importance: Importance,
    start: Date,
    end: Date
  ) => {
    const user = auth.currentUser
    if (!user) return

    const createdDoc = await addDoc(collection(db, 'events'), {
      title,
      start,
      end,
      userId: user.uid,
    })

    setEvents([
      ...events,
      { id: createdDoc.id, title, description, start, end, importance },
    ])
  }

  const editEvent = async (id: string, update: Partial<Event>) => {
    const editedDoc = doc(db, 'events', id)

    await updateDoc(editedDoc, update)
    setEvents(events.map((e) => (e.id === id ? { ...e, ...update } : e)))
  }

  const deleteEvent = async (id: string) => {
    const toDeleteDoc = doc(db, 'events', id)

    await deleteDoc(toDeleteDoc)
    setEvents(events.filter((e) => e.id !== id))
  }

  if (loading) return <div>""" Loading """</div>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Almost google calendar</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '90vh' }}
        selectable
        toolbar={true}
        defaultView={Views.MONTH}
        components={{
          agenda: {
            event: CustomAgendaEvent,
          },
        }}
        view={view}
        onView={(newView) => setView(newView)}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        step={30}
        timeslots={2}
        showMultiDayTimes
        onSelectEvent={(e) => {
          setEditingEvent(e)
          setFormOpen(true)
        }}
        onSelectSlot={(info) => {
          setSelectedSlot({ start: info.start, end: info.end })
          setEditingEvent(null)
          setFormOpen(true)
        }}
      />
      {formOpen && (
        <EventForm
          initial={
            editingEvent || {
              start: selectedSlot?.start,
              end: selectedSlot?.end,
            }
          }
          onSave={(event) => {
            if (event.id) editEvent(event.id, event)
            else
              addEvent(
                event.title,
                event.description,
                event.importance,
                event.start,
                event.end
              )
            setFormOpen(false)
          }}
          onClose={() => setFormOpen(false)}
          onDelete={(id) => deleteEvent(id)}
        />
      )}
    </div>
  )
}
