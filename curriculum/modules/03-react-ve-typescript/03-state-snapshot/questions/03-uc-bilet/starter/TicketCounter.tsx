import { useState } from 'react'
export function TicketCounter() {
  const [count, setCount] = useState(0)
  function addThree() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }
  return <button onClick={addThree}>Bilet: {count}</button>
}
