import bem from 'easy-bem';
import Master from '../Master/Master';
import './Masters.scss'

const b = bem('Masters');

export default function Masters ({ masters }) {   
        
    return (
        <div className={b()}>
            {masters.map(item => <Master className={b('item')} key={item.id} master={item} />)}
        </div>
    );
}
