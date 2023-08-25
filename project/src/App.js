import './style/index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//PAGES
import IndexPage from './pages/IndexPage';
import Cadastrar from './pages/SignUp';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<IndexPage />} />
          <Route path='/accounts/signup' element={<Cadastrar />} />
          <Route path='/accounts/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
