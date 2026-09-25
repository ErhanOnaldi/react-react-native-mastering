import { useState } from 'react'
export function TicketCounter() {
  const [count, setCount] = useState(0)
  function addThree() {
    setCount((n) => n + 1)
    setCount((n) => n + 1)
    setCount((n) => n + 1)
  }
  return <button onClick={addThree}>Bilet: {count}</button>
}
