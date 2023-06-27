import { Routes, Route, Outlet } from 'react-router-dom'
import { getFirestore } from 'firebase/firestore'
import { FirestoreProvider, useFirebaseApp } from 'reactfire'
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
  const firestoreInstance = getFirestore(useFirebaseApp())

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route element={<PersistLogin />}>
          <Route element={<LoggedIn />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route element={<Prefetch />}>
            <Route
              index
              element={
                <FirestoreProvider sdk={firestoreInstance}>
                  <MyTasks />
                </FirestoreProvider>
              }
            />

            <Route
              path="calendar"
              element={
                <FirestoreProvider sdk={firestoreInstance}>
                  <MyCalendar />
                </FirestoreProvider>
              }
            />

            <Route
              path="account"
              element={
                <FirestoreProvider sdk={firestoreInstance}>
                  <Account />
                </FirestoreProvider>
              }
            />

            <Route path="project">
              <Route
                index
                element={
                  <FirestoreProvider sdk={firestoreInstance}>
                    <ProjectList />
                  </FirestoreProvider>
                }
              />

              <Route path=":projectId">
                <Route
                  path="tasks"
                  element={
                    <FirestoreProvider sdk={firestoreInstance}>
                      <Tasks />
                    </FirestoreProvider>
                  }
                />

                <Route
                  path="overview"
                  element={
                    <FirestoreProvider sdk={firestoreInstance}>
                      <ProjectOverview />
                    </FirestoreProvider>
                  }
                />

                <Route
                  path="calendar"
                  element={
                    <FirestoreProvider sdk={firestoreInstance}>
                      <ProjectCalendar />
                    </FirestoreProvider>
                  }
                />
              </Route>

              <Route path="create" element={<CreateProject />} />
            </Route>

            <Route
              path="trash"
              element={
                <FirestoreProvider sdk={firestoreInstance}>
                  <Trash />
                </FirestoreProvider>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
