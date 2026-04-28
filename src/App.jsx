import { useState, useEffect } from 'react'

function Confetti({ active }) {
  if (!active) return null
  const pieces = Array.from({ length: 40 }, (_, i) => i)
  const colors = ['bg-indigo-400', 'bg-pink-400', 'bg-yellow-400', 'bg-green-400', 'bg-orange-400']
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.8
        const duration = 1.5 + Math.random() * 1.5
        const color = colors[i % colors.length]
        const size = Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-1'
        return (
          <div
            key={i}
            className={`absolute ${size} ${color} rounded-sm opacity-0`}
            style={{
              left: `${left}%`,
              top: '-10px',
              animation: `fall ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false },
    { id: 2, text: 'Go for a walk', done: true },
    { id: 3, text: 'Write some code', done: false },
  ])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [celebrate, setCelebrate] = useState(false)

  const allDone = todos.length > 0 && todos.every((t) => t.done)

  useEffect(() => {
    if (allDone) {
      setCelebrate(true)
      const timer = setTimeout(() => setCelebrate(false), 3500)
      return () => clearTimeout(timer)
    }
  }, [allDone])

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false }])
    setInput('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  const clearAll = () => setTodos([])

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  const remaining = todos.filter((t) => !t.done).length

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <>
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <Confetti active={celebrate} />

      <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs doing?"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setFilter('all')} className={tabClass('all')}>All</button>
            <button onClick={() => setFilter('active')} className={tabClass('active')}>Active</button>
            <button onClick={() => setFilter('completed')} className={tabClass('completed')}>Completed</button>
          </div>

          <ul className="space-y-2">
            {visible.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-1 text-left ${
                    todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {todo.text}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                  aria-label="Delete todo"
                >
                  ×
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="text-center text-slate-400 py-4 text-sm">Nothing here.</li>
            )}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <span>{remaining} {remaining === 1 ? 'item' : 'items'} left</span>
              {allDone && todos.length > 0 && (
                <span className="text-green-500 font-medium animate-pulse">🎉 All done!</span>
              )}
            </div>
            {todos.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-slate-400 hover:text-red-500 font-medium transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
