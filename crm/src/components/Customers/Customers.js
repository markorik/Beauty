import React, { useRef } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Customers({customers}) {
    const dt = useRef(null);

    const fullNameBody = (rowData) => {
        return rowData.fullName;                
    }

    const phoneBody = (rowData) => {
        return rowData.phone;
    }

    return (        
        <div>
            <DataTable ref={dt} value={customers} className="p-datatable-customers" >                
                <Column field="fullName" header="Имя" body={fullNameBody} />
                <Column field="phone" header="Телефон" body={phoneBody} />                
            </DataTable>
        </div>
    );
}