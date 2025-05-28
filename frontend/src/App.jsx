import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UploadForm from './components/uploadForm'
import SearchBox from './components/SearchBox'
import AllUploads from './components/AllUploads'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <UploadForm />
      <SearchBox  />
      <AllUploads />
    </div>
  )
}

export default App
