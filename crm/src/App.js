import './App.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import MastersForm from './components/MastersForm';
import Masters from './components/Masters/Masters';
import MastersContext from  './contexts/mastersContext';
import ApiService from './api/api_service'

const mockData = [
  {
      id: 1,
      name: 'Краснова Ирина',
      position: 'Мастер ногтевого сервиса',
      photo: 'https://i.pinimg.com/736x/71/09/ea/7109ea4c10a24205ab9f1b35cd287e9d.jpg'
  },
  {
      id: 2,
      name: 'Калилова Жанна',
      position: 'Визажист-стилист',
      photo: 'https://i.pinimg.com/originals/06/ec/6f/06ec6f98344874a46234a345f7baa9c8.png'
  },
  {
      id: 3,
      name: 'Иванова Елена',
      position: 'Мастер ногтевого сервиса',
      photo: 'https://i.pinimg.com/originals/58/c3/ac/58c3ac41fade50b5332caa2239f82501.jpg'
  }
];

function App() {
  // const [masters, setMasters] = useState(mockData);
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const masters = await ApiService.getMasters();
      setMasters(masters);       
    }

    fetchData();
  }, []);
  
  function createMaster(master) {
    const { id } = masters[masters.length - 1];        
    setMasters(masters.concat([{
      ...master, 
      id: id + 1
    }]));
  }

  function removeMaster(id) {
    setMasters(masters.filter(m => m.id !== id));
  }
  
  return (
    <div className="container">
      <div className="App">
        <header>
          <h1>Beauty salon</h1>  
        </header>
          <MastersForm onCreate={createMaster} />
          <br />
          
          <MastersContext.Provider value= {{ removeMaster }}>
            { masters.length === 0 ? 
              <p>Нет данных</p> : <Masters masters={masters} /> }
            
          </MastersContext.Provider>
          <br />
      </div>     
    </div>
  );
}

export default App;