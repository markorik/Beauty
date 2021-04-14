import { useRef } from "react";
import bem from 'easy-bem';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import '../../scss/components/Masters.scss'


const b = bem('Masters');

export default function Masters({masters, onNew, onUpdate, onEdit, onDelete}) {
    const dt = useRef(null);
    
    const fullNameBody = (rowData) => {
        return rowData.fullName;                
    }

    const positionBody = (rowData) => {
        return rowData.position;
    }

    const photoBody = (rowData) => {
        return <img src={rowData.photo} onError={(e) => e.target.src='https://terraideas.ru/assets/no-photo-d74b569e8aa86ef4c4ca9a5daff41a16131fa9b7860568755387b734993f46dc.jpg'} alt=""  className={b('photo')} />;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-success p-mr-2" tooltip="Изменить" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-warning" tooltip="Удалить" onClick={() => onDelete(rowData)} />
            </div>
        );
    }

    const header = (
        <div className={b('table-header')}>            
            <h5 className="p-m-0">Мастера</h5>

            <div className="p-d-flex">
                <Button label="Добавить мастера" icon="pi pi-plus" className="p-button-success p-m-1" onClick={onNew} />
                <Button label="Обновить данные" icon="pi pi-cloud-download" className="p-button-help p-m-1" onClick={onUpdate} />                
            </div>
        </div>
    );

    return (        
        <div className="Master">
            <div className="card">               
                <DataTable ref={dt} value={masters} header={header}>                
                    <Column field="photo" header="Фото" body={photoBody}/>  
                    <Column field="fullName" header="ФИО" body={fullNameBody} filter filterPlaceholder="Поиск по ФИО" filterMatchMode="contains"/>
                    <Column field="position" header="Позиция" body={positionBody} filter filterPlaceholder="Поиск по позиции" filterMatchMode="contains" />  
                    <Column body={actionBodyTemplate}></Column>            
                </DataTable>
            </div>
        </div>
    );
}