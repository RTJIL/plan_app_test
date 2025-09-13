import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
} from 'react-big-calendar'
import type { View } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { useEffect, useState } from 'react'

import { format, parse, startOfWeek, getDay } from 'date-fns'

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { auth, db } from '../../../lib/firebase'

import type { Event } from '../types'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: {},
})

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Test',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
  ])
  const [loading, setLoading] = useState(true)

  const [view, setView] = useState<View>(Views.MONTH)

  const [currentDate, setCurrentDate] = useState(new Date())

  console.log(events)

  useEffect(() => {
    const fetch = async () => {
      const store = await getDocs(collection(db, 'events'))

      const data = store.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || 'Noname',
        start: new Date(doc.data().start.seconds * 1000),
        end: new Date(doc.data().end.seconds * 1000),
      }))

      setEvents(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const addEvent = async (title: string, start: Date, end: Date) => {
    const user = auth.currentUser
    if(!user) return

    const createdDoc = await addDoc(collection(db, 'events'), {
      title,
      start,
      end,
      userId: user.uid
    })

    setEvents([...events, { id: createdDoc.id, title, start, end }])
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
        view={view}
        onView={(newView) => setView(newView)}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        step={30}
        timeslots={2}
        showMultiDayTimes
        onSelectEvent={(e) => {
          if (!e.title) return

          const action = prompt('Edit event, or type delete to delete', e.title)

          if (action?.toLowerCase() === 'delete' && e.id) deleteEvent(e.id)
          else if (e.id) editEvent(e.id, { title: action })
        }}
        onSelectSlot={(info) => {
          const multipleEvents = prompt('Add another one ( use comma )')

          if (multipleEvents) {
            multipleEvents.split(',').forEach((t) => {
              if (t.trim()) addEvent(t.trim(), info.start, info.end)
            })
          }
        }}
      />
    </div>
  )
}
