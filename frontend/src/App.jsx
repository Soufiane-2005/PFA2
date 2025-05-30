
import { Register } from '../pages/Register'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from '../pages/Login'
import {Adminregister} from '../pages/Adminregister'
import { Dashboard } from '../pages/Dashboard'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AuthContext } from '../context/AuthContext'
import { Enseignant } from '../pages/Admin/Enseignant'
import { Notifications } from '../pages/Admin/Notifications'
import { Alerts } from '../pages/Admin/Alerts'
import { Modifierinfo } from '../pages/Admin/Modifierinfo'
import { Modules } from '../pages/Admin/Modules'
import { UserAlerts } from '../pages/Users/UserAlerts'
import {UserNotifications} from '../pages/Users/UserNotifications'
import { Enseignement } from '../pages/Admin/Enseignement'


function App() {

  

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Register/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/Admin' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Adminregister/>
            </ProtectedRoute>}></Route>

            <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['etudiant','enseignant']}>
                <Dashboard/>
              </ProtectedRoute>}> </Route>
              <Route path='/unauthorized' element={<h2>Accès refusé</h2>} />

                



            <Route path='/Admin/Enseignant' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Enseignant/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/Notifications' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Notifications/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/Alerts' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Alerts/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/modifier-info' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Modifierinfo/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/Modules' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Modules/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/Enseignement' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Enseignement/>
            </ProtectedRoute>}></Route>


            <Route path='/dashboard/modifier-info' element={<ProtectedRoute allowedRoles={['enseignant', 'etudiant']}>
            <Modifierinfo/>
            </ProtectedRoute>}></Route>

            <Route path='/dashboard/User-alerts' element={<ProtectedRoute allowedRoles={['enseignant', 'etudiant']}>
            <UserAlerts/>
            </ProtectedRoute>}></Route>

            <Route path='/dashboard/User-notifications' element={<ProtectedRoute allowedRoles={['enseignant', 'etudiant']}>
            <UserNotifications/>
            </ProtectedRoute>}></Route>


          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
