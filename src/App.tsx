import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Tasks from './features/tasks/Tasks'
import { getFirestore } from 'firebase/firestore'
import { FirestoreProvider, useFirebaseApp } from 'reactfire'
import CreateProject from './features/projects/CreateProject'
import MyTasks from './features/tasks/MyTasks'
import Prefectch from './features/auth/Prefectch'
import ProjectOverview from './features/projects/ProjectOverview'
import ProjectCalendar from './features/projects/ProjectCalendar'
import MyCalendar from './features/auth/MyCalendar'

function App() {
  const firestoreInstance = getFirestore(useFirebaseApp())

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route element={<Prefectch />}>
          <Route index element={<MyTasks />} />

          <Route path="calendar" element={<MyCalendar />} />

          <Route path="project">
            <Route path=":projectId">
              <Route
                path="tasks"
                element={
                  <FirestoreProvider sdk={firestoreInstance}>
                    <Tasks />
                  </FirestoreProvider>
                }
              />

              <Route path="overview" element={<ProjectOverview />} />

              <Route path="calendar" element={<ProjectCalendar />} />
            </Route>

            <Route path="create" element={<CreateProject />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
