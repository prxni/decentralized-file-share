import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UploadFile from './UploadFile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <UploadFile/>
  )
}

export default App
