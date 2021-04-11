import { useState } from 'react';
import { useEffect } from 'react';
import MastersForm from '../components/MastersForm';
import Masters from '../components/Masters/Masters';
import MastersContext from  '../contexts/mastersContext';
import ApiService from '../api/api_service'

export default function MastersPage() {
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
        <>
            <h3>Мастера</h3>
            <MastersForm onCreate={createMaster} />
            <br />
            
            <MastersContext.Provider value= {{ removeMaster }}>
                { masters.length === 0 ? 
                <p>Нет данных</p> : <Masters masters={masters} /> }
                
            </MastersContext.Provider>
            <br />
        </>
    );
}