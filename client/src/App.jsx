import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

function App() {

  return (
    <div className='bg-gray-300'>
      <header className='font-semibold text-lg capitalize bg-black text-white'>
        <div className="container mx-auto">
          <ul className='flex gap-4 h-16 items-center px-4'>
            <li>
              <NavLink to={'/'}>home</NavLink>
            </li>
            <li>
              <NavLink to={'/admin'} className=''>admin</NavLink>
            </li>
            <li>
              <NavLink to={'/login'}>login</NavLink>
            </li>
            <li>
              <NavLink to={'/register'}>register</NavLink>
            </li>
          </ul>
        </div>
      </header>
      <main className='min-h-[calc(100vh-64px)]'>
        <Routes>
          <Route >
            <Route path='admin' element={<AdminPage />} />
          </Route>
          <Route index element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  )
}


const HomePage = () => (<div className='p-12 h-full flex flex-col gap-4 items-center'>
  <h1>home page</h1>
  <img src="/1.jpg" alt="home" />
  <button className='px-8 py-2 rounded-md bg-orange-500'>create axios req</button>
</div>)

const AdminPage = () => {
  const onClick = async() => {
   apiReq({method: 'GET', url: 'protected' }).then(console.log)
}
  return (<div className='p-12 h-full flex flex-col gap-4 items-center'>
    <h1>admin page</h1>
    <img src="/2.jpg" alt="admin" />
    <button className='px-8 py-2 rounded-md bg-orange-500' onClick={onClick}>create axios req</button>
  </div>)
}

const LoginPage = () => {

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      const fd = new FormData(e.target)
      const body = Object.fromEntries(fd)
      const { user, token } = await apiReq({ method: 'POST', url: 'login', body })
      // TODO - setUser - context
      localStorage.token = token
    } catch (error) {

    }
  }

  return (<div onSubmit={handleSubmit} className='p-6 md:p-12 flex items-center justify-center h-full'>
    <form className='rounded-lg shadow-lg max-w-96 flex flex-col gap-4  p-6 w-full bg-black text-white'>
      <h1>Login</h1>
      <input type="email" name='email' placeholder='email...' />
      <input type="password" name='password' placeholder='password...' />
      <button className='px-8 py-2 rounded-md bg-orange-500'>send</button>
    </form>
  </div>)
}

const RegisterPage = () => {
  const navigate = useNavigate()

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      const fd = new FormData(e.target)
      const body = Object.fromEntries(fd)
      const result = await apiReq({ method: 'POST', body, url: 'register' })
      navigate('/login')
    } catch (error) {

    }
  }

  return (<div onSubmit={handleSubmit} className='p-6 md:p-12 flex items-center justify-center h-full'>
    <form className='rounded-lg shadow-lg max-w-96 flex flex-col gap-4 p-6 w-full bg-black text-white'>
      <h1>Register</h1>
      <input type="email" name='email' placeholder='email...' />
      <input type="text" name='name' placeholder='name...' />
      <input type="password" name='password' placeholder='password...' />
      <button className='px-8 py-2 rounded-md bg-orange-500'>send</button>
    </form>
  </div>)
}


async function apiReq({ method, url, body }) {
  try {

    const { data } = await axios({
      method,
      baseURL: 'http://localhost:5000/',
      url,
      data: body,
      headers: {
        Authorization: localStorage.token || ''
      }
    })

    return data

  } catch (error) {
    console.error({ error });
    throw error
  }
}

export default App
