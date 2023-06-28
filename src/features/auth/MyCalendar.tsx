import React, { useCallback } from 'react'
import DefaultLayout from '~/components/Layouts/DefaultLayout'
import useBoardStore from '~/stores/BoardStore'
import useCredentialStore from '~/stores/CredentialStore'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import HomeLayout from '~/components/Layouts/HomeLayout'

const localizer = momentLocalizer(moment)

const DnDCalendar = withDragAndDrop(Calendar)

const MyCalendar = () => {
  const [board, isSideBarOpen] = useBoardStore(state => [state.board, state.isSideBarOpen])
  const [credential] = useCredentialStore(state => [state.credential])

  const columns = Array.from(board.columns.entries()).map(([id, column]) =>
    column.tasks
      .filter(each => each.assignedUser.includes(credential.uid))
      .map(task => ({
        title: task.title,
        start: moment(task.createdAt).toDate(),
        end: moment(task.dueDate).toDate()
      }))
  )

  const [draggedEvent, setDraggedEvent] = React.useState<any>()

  const [events, setEvents] = React.useState([
    {
      id: 0,
      title: 'Event 1'
    },
    {
      id: 1,
      title: 'Event 2'
    },
    {
      id: 2,
      title: 'Event 3'
    }
  ])

  const [inCalendarEvent, setInCalendarEvent] = React.useState<any>([])

  const onChangeEventTime = useCallback((start: Date, end: Date, event: any) => {
    inCalendarEvent(
      ...[
        inCalendarEvent.map((item: any) => {
          if (item.title === event.title) {
            return {
              ...item,
              start,
              end
            }
          }

          return item
        })
      ]
    )
  }, [])

  const onDropFromOutside = useCallback((start: Date, end: Date) => {
    setInCalendarEvent([...inCalendarEvent, { ...draggedEvent, start, end }])
    setDraggedEvent(null)
  }, [])

  const onDragStart = useCallback((event: any) => setDraggedEvent(event), [])

  return (
    <HomeLayout>
      <div className="flex justify-between gap-4 relative">
        <div className="grid gap-y-2 w-1/5 sticky top-0">
          {events.map(event => (
            <div draggable="true" onDragStart={() => onDragStart(event)}>
              {event.title}
            </div>
          ))}
        </div>
        <DnDCalendar
          className="p-4 w-4/5 overflow-y-auto"
          localizer={localizer}
          events={inCalendarEvent}
          timeslots={1}
          step={60}
          defaultView="day"
          min={moment(`${moment().format('YYYY-MM-DD')} 8:00 AM`).toDate()}
          max={moment(`${moment().format('YYYY-MM-DD')} 8:00 PM`).toDate()}
          onEventDrop={({ start, end, event }) =>
            onChangeEventTime(new Date(start.toString()), new Date(end.toString()), event)
          }
          onEventResize={({ start, end, event }) =>
            onChangeEventTime(new Date(start.toString()), new Date(end.toString()), event)
          }
          onDropFromOutside={({ start, end }) =>
            onDropFromOutside(new Date(start.toString()), new Date(end.toString()))
          }
          resizable
        />
      </div>
    </HomeLayout>
  )
}

export default MyCalendar
