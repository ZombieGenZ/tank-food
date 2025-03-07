import { useState } from 'react'
import { Button } from '@mui/material';
import { Skeleton } from '@mui/material';

function App() {
  const [count, setCount] = useState(0)
  const increase = () => {
    setCount((counts) => counts + 1)
  }

  return (
    <div className="w-full">
      <div>
        <p className="bg-red-500">Giá trị: {count}</p>
        <button onClick={increase}>Tăng</button>
        <Button variant="contained">Text</Button>
      </div>
      <Skeleton/>
    </div>
  )
}

export default App
