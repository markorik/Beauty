import React, { useState, useRef } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Avatar } from 'primereact/avatar';

import '../../scss/components/DataTable.scss';

export default function Customers({ orders, onNew, onUpdate, onEdit, onDelete }) {

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const dt = useRef(null);

    const customerBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Клиент:</span>
                <div className="p-d-flex p-ai-center">
                    <div className="p-ml-1">
                        <div className="">{rowData.customer?.fullName}</div>
                        <div className="p-text-light">{rowData.customer?.phone}</div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    const masterBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Мастер:</span>
                <div className="p-d-flex p-ai-center">
                    <div className=""><Avatar size="large" shape="circle" image={rowData.master?.photo} /></div>
                    <div className="p-ml-1">
                        <div className="">{rowData.master?.fullName}</div>
                        <div className="p-text-light">{rowData.master?.position}</div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    const serviceBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Service:</span>
                {rowData.service && <div className="p-d-flex p-ai-center">
                    <div className="p-ml-1">
                        <div className="">{rowData.service?.name}</div>
                        <div className="p-text-light">{rowData.service?.price} ₽</div>
                    </div>
                </div>}
            </React.Fragment>
        )
    }

    const visitDateBodyTemplate = (rowData) => {
        const optionsForDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const intlDate = new Intl.DateTimeFormat('ru-RU', optionsForDate);

        return (
            <React.Fragment>
                <span className="p-column-title">Visit date:</span>
                <div>{intlDate.format(rowData.visitDate)}</div>
            </React.Fragment>
        )
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Status:</span>
                <div>
                    <span className={`order-badge status-${rowData.status.toLowerCase()}-${rowData.finishStatus?.toLowerCase()}`}>
                        {rowData.status}
                    </span>
                </div>
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" tooltip="Изменить" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" tooltip="Удалить" onClick={() => onDelete(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="table-header">
            <span className="p-d-none p-d-sm-inline-flex">Заявки</span>
            <div className="p-d-flex">
                <Button label="Добавить заявку" icon="pi pi-plus" className="p-button-success p-m-1" onClick={onNew} />
                <Button label="Обновить данные" icon="pi pi-cloud-download" className="p-button-help p-m-1" onClick={onUpdate} />
            </div>
        </div>
    );

    // Дата

    const filterDate = (value, filter) => {
        if (filter.from && filter.to) {
            return filter.from <= value && value <= filter.to;
        }
        else if (filter.from) {
            return filter.from <= value;
        }
        else if (filter.to) {
            return value <= filter.to;
        }
        // Both values are null, allowing.
        return true;
    }

    const onFromDateChange = (e) => {
        dt.current.filter({ from: e.value, to: toDate }, 'visitDate', 'custom');
        setFromDate(e.value);
    }

    const onToDateChange = (e) => {
        let to = e.value;
        if (to) {
            // устанавливаем время 23:59:59
            to.setHours(23, 59, 59);
        }
        dt.current.filter({ from: fromDate, to: to }, 'visitDate', 'custom');
        setToDate(e.value);
    }

    const dateFilter = (
        <div className="p-d-flex p-flex-column p-flex-sm-row">
            <Calendar value={fromDate} onChange={onFromDateChange}
                dateFormat="dd/mm/y" mask="99/99/99" className="p-mr-1 p-inputtext-sm"
                placeholder="От" showButtonBar
            />
            <Calendar value={toDate} onChange={onToDateChange}
                dateFormat="dd/mm/y" mask="99/99/99" className="p-mr-1 p-inputtext-sm"
                placeholder="До" showButtonBar
            />
        </div>
    );


    // Статус

    const statuses = ['opened', 'closed'];

    const onStatusChange = (e) => {
        dt.current.filter(e.value, 'status', 'equals');
        setSelectedStatus(e.value);
    }

    const statusItemTemplate = (option) => {
        return <span className={`order-badge status-${option}`}>{option}</span>;
    }

    const selectedStatusTemplate = (option, props) => {
        if (option) {
            return (
                <span className={`order-badge status-${option}`}>{option}</span>
            );
        }
        return (
            <div>{props.placeholder}</div>
        );
    }

    const statusFilter = (
        <Dropdown
            value={selectedStatus} options={statuses} onChange={onStatusChange}
            itemTemplate={statusItemTemplate} valueTemplate={selectedStatusTemplate}
            placeholder="Выберите статус" className="p-column-filter" showClear
        />
    );

    return (
        <div className="datatable">
            <DataTable ref={dt} value={orders} header={header} className="p-datatable-orders p-datatable-gridlines p-datatable-striped">
                <Column field="customer.fullName" header="ФИО клиента" body={customerBodyTemplate} filter filterPlaceholder="Поиск по клиенту" filterMatchMode="contains" />
                <Column field="visitDate" header="Дата визита" body={visitDateBodyTemplate} filter filterElement={dateFilter} filterFunction={filterDate} />
                <Column field="master.fullName" header="Мастер" body={masterBodyTemplate} filter filterPlaceholder="Поиск по мастеру" filterMatchMode="contains" />
                <Column field="service.name" header="Услуга" body={serviceBodyTemplate} filter filterPlaceholder="Поиск по услуге" filterMatchMode="contains" />
                <Column field="status" header="Статус" body={statusBodyTemplate} filter filterElement={statusFilter} />
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
    );
}
