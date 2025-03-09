import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const increase = () => {
    setCount((counts) => counts + 1)
  }

  return (
    <div className="w-full">
      <div>
        <p className="">Giá trị: {count}</p>
        <button onClick={increase}>Tăng</button>
      </div>
    </div>
  )
}

export default App
