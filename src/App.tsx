import { Routes, Route, Outlet } from 'react-router-dom'
import Tasks from './features/tasks/Tasks'
import CreateProject from './features/projects/CreateProject'
import MyTasks from './features/tasks/MyTasks'
import Prefectch from './features/auth/Prefectch'
import ProjectOverview from './features/projects/ProjectOverview'
import ProjectCalendar from './features/projects/ProjectCalendar'
import MyCalendar from './features/auth/MyCalendar'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import PersistLogin from './features/auth/PersistLogin'
import LoggedIn from './features/auth/LoggedIn'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route element={<PersistLogin />}>
          <Route element={<LoggedIn />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route element={<Prefectch />}>
            <Route index element={<MyTasks />} />

            <Route path="calendar" element={<MyCalendar />} />

            <Route path="project">
              <Route path=":projectId">
                <Route path="tasks" element={<Tasks />} />

                <Route path="overview" element={<ProjectOverview />} />

                <Route path="calendar" element={<ProjectCalendar />} />
              </Route>

              <Route path="create" element={<CreateProject />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
