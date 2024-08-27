import { useState } from "preact/hooks"


export default function App() {
    const [count, setCount] = useState(0)
    return (
        <div className=' text-green-600 font-bold cursor-pointer hover:text-green-700'
        onClick={() => setCount(count + 1)}
        >
            You have clicked this {count} times
        </div>
    )
}