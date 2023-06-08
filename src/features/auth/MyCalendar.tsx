import React from 'react'
import DefaultLayout from '~/components/Layouts/DefaultLayout'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import useBoardStore from '~/stores/BoardStore'

const MyCalendar = () => {
  const [board, isSideBarOpen] = useBoardStore(state => [state.board, state.isSideBarOpen])

  const columns = Array.from(board.columns.entries()).map(([id, column]) =>
    column.tasks
      .filter(each => each.assignedUser.includes('Bui Dung'))
      .map(task => ({
        title: task.title,
        date: task.dueDate // Extracting the date part from the dueDate
      }))
  )

  return (
    <DefaultLayout>
      {columns.length !== 0 && (
        <FullCalendar
          viewClassNames={[`${isSideBarOpen ? 'h-[74%]' : 'h-[65%]'} p-3`]}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          headerToolbar={false}
          events={[...columns[0], ...columns[1], ...columns[2]]}
        />
      )}
    </DefaultLayout>
  )
}

export default MyCalendar
