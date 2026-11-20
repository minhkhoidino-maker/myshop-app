import logo from './logo.svg';
import './App.css';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

// The API runs on the same Codespace address, but on port 8080 instead of 3000
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : window.location.origin.replace('-3000.', '-8080.');

function Room(props) {
  return <li>Room {props.info.room_id}: {props.info.name}, price: {props.info.price}</li>;
}

function App() {
  const { data, error, isLoading } = useSWR(API_BASE + '/room', fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>The quick brown fox jumps over the lazy dog</h3>
        <ul>
          {data.rooms.map((item) => <Room key={item.room_id} info={item} />)}
        </ul>
      </header>
    </div>
  );
}

export default App;
