import './styles/globals.scss'

import {useState, useEffect} from 'react'
import {BsTrash, BsBookmarkCheck, BsBookmarkFill} from 'react-icons/bs'

const API = "http://localhost:5000"

function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    
    const loaddata = async() => {
      setLoading(true)

      const resp = await fetch(API + "/todos")
      .then((resp) => resp.json())
      .then((data) => data)
      .catch((err) => console.log(err))

      setLoading(false)
      setTodos(resp)
    };

    loaddata()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);

    setTitle('');
    setTime('');
    
  }

  const handleCheck = async (todo) => {
    
    todo.done = !todo.done;

    const data = await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))
  }

  const handleDelete = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  if(loading) {
    return <p className='load'>Carregando...</p>
  }

  return (
   <div className="app">
      <div className="header">
        <h1>Agenda</h1>
      </div>

      <div className="form">
        <h2>Insira sua próxima tarefa</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input type="text" name="title" id="title" placeholder='Título da tafefa' onChange={(e) => setTitle(e.target.value)} value={title || ""} required/>
          </div>

          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input type="text" name="time" id="time" placeholder='Tempo estimado (horas)' onChange={(e) => setTime(e.target.value)} value={time || ""}
            required/>
            <input type="submit" value="Criar tarefa" />
          </div>
        </form>
      </div>

      <div className="list">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleCheck(todo)}>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkFill/>}
              </span>
              <span>
                <BsTrash onClick={() => handleDelete(todo.id)}/>
              </span>
            </div>
          </div>
        ))}
      </div>
   </div>
  )
}

export default App
