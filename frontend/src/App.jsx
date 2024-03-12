import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from './components/firebase' 
import Todos from './components/Todos/Todos'
import Login from './components/Login'

/**
 * The main component of the application.
 * Renders the Todos component inside a div with the class name 'app'.
 *
 * @returns {JSX.Element} The rendered component.
 */
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='app'>
      <section className='todos'>
        <header>
          <h1>To-Do List</h1>
          
          {user && <button onClick={handleLogout}className="google-login-btn">Logout</button>}
        </header>
        <h5>{user ? `Welcome, ${user.displayName}` : ''}</h5>
        {user ? <Todos user={user} /> : <Login />}
      </section>
    </div>
  )
}

export default App
