import React, { useRef } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import '../../scss/components/DataTable.scss'

export default function Customers({customers}) {
    const dt = useRef(null);

    const fullNameBody = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">ФИО:</span>
                {rowData.fullName}
            </React.Fragment>
        );         
    }

    const phoneBody = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Телефон:</span>
                {rowData.phone}
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">            
            <span className="p-d-none p-d-sm-inline-flex">Клиенты</span>            
        </div>
    );

    return (        
        <div className="datatable">
            <DataTable ref={dt} value={customers} header={header} className="p-datatable-orders p-datatable-gridlines p-datatable-striped">                
                <Column field="fullName" header="Имя" body={fullNameBody} />
                <Column field="phone" header="Телефон" body={phoneBody} />                
            </DataTable>
        </div>
    );
}