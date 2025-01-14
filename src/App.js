import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Content from './components/Content/Content.component';
import Navbar from './components/Navbar/Navbar.component';
import { Toaster } from 'react-hot-toast'
import { TokenWrapper } from './context/TokenContext';


const App = () => {


  return (
    <div>
      <BrowserRouter>
        <TokenWrapper>
          <Navbar />
          <Content />
          <Toaster />
        </TokenWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;
