import { Routes, Route, Outlet } from 'react-router-dom'
import Tasks from './features/tasks/Tasks'
import CreateProject from './features/projects/CreateProject'
import MyTasks from './features/tasks/MyTasks'
import Prefetch from './features/auth/Prefetch'
import ProjectOverview from './features/projects/ProjectOverview'
import ProjectCalendar from './features/projects/ProjectCalendar'
import MyCalendar from './features/auth/MyCalendar'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import PersistLogin from './features/auth/PersistLogin'
import LoggedIn from './features/auth/LoggedIn'
import ProjectList from './features/projects/ProjectList'
import Trash from './features/tasks/Trash'
import Account from './features/auth/Account'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route element={<PersistLogin />}>
          <Route element={<LoggedIn />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route element={<Prefetch />}>
            <Route index element={<MyTasks />} />

            <Route path="calendar" element={<MyCalendar />} />

            <Route path="account" element={<Account />} />

            <Route path="project">
              <Route index element={<ProjectList />} />

              <Route path=":projectId">
                <Route path="tasks" element={<Tasks />} />

                <Route path="overview" element={<ProjectOverview />} />

                <Route path="calendar" element={<ProjectCalendar />} />
              </Route>

              <Route path="create" element={<CreateProject />} />
            </Route>

            <Route path="trash" element={<Trash />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
