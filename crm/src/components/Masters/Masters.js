import React, { useRef } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import '../../scss/components/DataTable.scss'

export default function Masters({masters, onNew, onUpdate, onDelete}) {
    const dt = useRef(null);
    
    const fullNameBody = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">ФИО:</span>
                {rowData.fullName}
            </React.Fragment>
        );                       
    }

    const positionBody = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Позиция:</span>
                {rowData.position}
            </React.Fragment>
        );
    }

    const photoBody = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Фото:</span>
                <img src={rowData.photo} onError={(e) => e.target.src='/no-photo.jpg'} alt=""  className="photo" />
            </React.Fragment>
        );        
    }

    const actionBody = (rowData) => {
        return (
            <div className="actions">                
                <Button icon="pi pi-trash" className="p-button-warning" tooltip="Удалить" onClick={() => onDelete(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="table-header">            
            <span className="p-d-none p-d-sm-inline-flex">Мастера</span>
            <div className="p-d-flex">
                <Button label="Добавить мастера" icon="pi pi-plus" className="p-button-success p-m-1" onClick={onNew} />
                <Button label="Обновить данные" icon="pi pi-cloud-download" className="p-button-help p-m-1" onClick={onUpdate} />                
            </div>
        </div>
    );

    return (                
        <div className="datatable">               
            <DataTable ref={dt} value={masters} header={header} className="p-datatable-orders p-datatable-gridlines p-datatable-striped">                
                <Column field="photo" header="Фото" body={photoBody}/>  
                <Column field="fullName" header="ФИО" body={fullNameBody} filter filterPlaceholder="Поиск по ФИО" filterMatchMode="contains"/>
                <Column field="position" header="Позиция" body={positionBody} filter filterPlaceholder="Поиск по позиции" filterMatchMode="contains" />  
                <Column body={actionBody}></Column>            
            </DataTable>
        </div>       
    );
}