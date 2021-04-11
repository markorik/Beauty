import { useContext } from 'react';
import bem from 'easy-bem';
import classNames from 'classnames';
import '../../scss/components/Master.scss'
import mastersContext from '../../contexts/mastersContext';

const b = bem('Master');

export default function Master({ master, className }) {
    const {id, photo, fullName, position } = master;
    const _className = classNames(b(), className);
    console.log(_className);
    const _photo = photo || 'https://terraideas.ru/assets/no-photo-d74b569e8aa86ef4c4ca9a5daff41a16131fa9b7860568755387b734993f46dc.jpg';
    const { removeMaster } = useContext(mastersContext);

    return(
        <div className={_className}>
            <div className={b('photo')}>
                <img src={_photo} alt=""/>
            </div>
            <div className={b('name')}>{fullName}</div>
            <div className={b('position')}>{position}</div>

            <button onClick={() => removeMaster(id)}>X</button>
        </div>
    );
}

 