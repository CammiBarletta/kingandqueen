import { useState } from 'react';
import Nav from './components/Nav';
import Main from './components/Main'; 
import './index.css'

function App() {
  const [vista, setVista] = useState ("Home");

  return (
    <>
      <Nav setVista={setVista} />
      <Main vista={vista} />
  
    </>
  );
}

export default App;
