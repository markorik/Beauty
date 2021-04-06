import { useState } from 'react';

export default function MastersForm({ onCreate }) {
    const [name, setName] = useState();
    const [photo, setPhoto] = useState();
    const [position, setPosition] = useState();
    
    function reset() {
        setName('');
        setPosition('');
        setPhoto('');
    }
    
    function handleForm(event) {
        event.preventDefault();
        const data = {
            name,
            position,
            photo
        };
        
        reset();
        onCreate(data);
    }
    
    return(
        <form onSubmit={handleForm}>
            <input value={name} onChange={event => setName(event.target.value)} placeholder="ФИО" required />
            <input value={position} onChange={event => setPosition(event.target.value)} placeholder="Позиция" required />
            <input value={photo} onChange={event => setPhoto(event.target.value)} placeholder="Ссылка на фотографию"/>
            <button>Добавить нового мастера</button>
        </form>
    );
}