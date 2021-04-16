import React, { useState, useEffect } from "react";
import classNames from 'classnames';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Message } from 'primereact/message';

const toTimeString = (hours, minutes) => `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

const dateToTimeString = (dt) => dt && toTimeString(dt.getHours(), dt.getMinutes());

const clampTime = (time) => {
    if (time?.includes(':')) {
        const [hours, minutes] = time.split(':');
        return toTimeString(Math.min(hours, 23), Math.min(minutes, 59)); 
    }
    return time;
}


export default function CustomerDetailsForm({visible, order, customers, masters, services, onCancel, onSave}) {
    const [submitted, setSubmitted] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(order);
    const [existingCustomer, setExistingCustomer] = useState(false);
    const [triStateStatus, setTriStateStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    
    useEffect(() => {
        // При установке даты в visitDate время в visitDate всегда устанавливается в 00:00, обрабатываем время отдельно.
        order.visitTime = dateToTimeString(order.visitDate);
        setCurrentOrder(order);
        // Если мы открываем на редактирование, где Customer известен,
        // то поле Customer fullname делаем нередактируемым, пока не сменится телефон
        setExistingCustomer(order.customer.id);
        // Устанавливаем triStateStatus
        if (order.status === 'Opened') {
            setTriStateStatus(null);
        }
        else {
            setTriStateStatus(order.status === 'Closed' && order.finishStatus === 'Success');
        }
    }, [order]);

    
    const cancel = () => {
        setSubmitted(false);
        setErrorMessage(null);
        onCancel();
    }

    const save = async () => {
        setSubmitted(true);
        let newData = {...currentOrder}
        if (!newData.customer.id) {
            newData.customer.fullName.trim();
        }
        if (newData.customer.fullName && newData.customer.phone && newData.visitDate && newData.visitTime) {
            // Устанавливаем в newData.visitDate время из newData.visitTime
            let [hours, minutes] = newData.visitTime.split(':');
            try {
                newData.visitDate.setHours(hours, minutes);
                onSave(newData);
                setSubmitted(false);
            }
            catch (err) {
                setErrorMessage(err?.message || 'Unknown server response');
            }
        }
    }
    
    const onCustomerPhoneChange = (e) => {
        const _newPhone = e.target?.value || '';
        let _order = {...currentOrder}
        _order.customer.phone = _newPhone;

        let _existingCustomer = undefined;
        if (!_newPhone.includes('_')) {
            _existingCustomer = customers.find(v => v.phone === _newPhone);
            if (_existingCustomer) {
                _order.customer = {..._existingCustomer};
            }
        }
        if (!_existingCustomer) {
            _order.customer.fullName = '';
        }
        setExistingCustomer(_existingCustomer);
        setCurrentOrder(_order);
    }

    const onCustomerNameChange = (e) => {
        const val = e.target?.value || '';
        let _order = {...currentOrder}
        _order.customer.fullName = val;
        setCurrentOrder(_order);
    }

    const onVisitDateChange = (e) => {
        const val = e.target?.value;
        if (val) {
            let _order = {...currentOrder}
            _order.visitDate = val;
            setCurrentOrder(_order);
        }
    }

    const onVisitTimeChange = (e) => {
        const val = e.target?.value;
        console.log(val);
        if (val && !val.includes('_')) {
            console.log(`clamped: ${clampTime(val)}`);
            let _order = { ...currentOrder };
            _order.visitTime = clampTime(val);
            setCurrentOrder(_order);
        }
    }

    const onMasterChange = (e) => {
        const val = e.target?.value || '';
        let _master = masters.find((elem) => elem.id === val);
        let _order = { ...currentOrder };
        _order.master = _master;
        setCurrentOrder(_order);
    }
    
    const onServiceChange = (e) => {
        const val = e.target?.value || '';
        let _service = services.find((elem) => elem.id === val);
        let _order = { ...currentOrder };
        _order.service = _service;
        setCurrentOrder(_order);
    }

    const onStatusChange = (e) => {
        const val = e.target.value;
        let _order = {...currentOrder}
        switch (val) {
            case true:
                _order.status = 'Closed';
                _order.finishStatus = 'Success';
                break
            case false:
                _order.status = 'Closed';
                _order.finishStatus = 'Failed';
                break
            default:
                _order.status = 'Opened';
                _order.finishStatus = undefined;
        }
        setCurrentOrder(_order);
        setTriStateStatus(val);
    }

    const selectedMasterTemplate = (option, props) => {
        if (option) {
            return (
                <div>{option.fullName}</div>
            );
        }
        return (
            <div>{props.placeholder}</div>
        );
    }

    const masterOptionTemplate = (option) => {
        return (
            <div>
                <div>{option.fullName}</div>
                <div className="p-text-light">{option.position}</div>
            </div>
        );
    }

    const selectedServiceTemplate = (option, props) => {
        if (option) {
            return (
                <div>{option.name}</div>
            );
        }
        return (
            <div>{props.placeholder}</div>
        );
    }

    const serviceOptionTemplate = (option) => {
        return (
            <div>
                <div>{option.name}</div>
                <div className="p-text-light">{option.price} ₽</div>
            </div>
        );
    }

    const footer = (
        <React.Fragment>
            <div className="p-d-flex p-jc-between p-ai-center">
                <div>
                    {/* Статус нужен только для редактируемых заявок */}
                    {currentOrder.id && (<>
                        <label htmlFor="status">Статус:&nbsp;</label>
                        <TriStateCheckbox value={triStateStatus} onChange={onStatusChange} name="status" />
                        <span className={`order-badge status-${currentOrder.status?.toLowerCase()}-${currentOrder.finishStatus?.toLowerCase()}`}>{currentOrder.status}</span>
                    </>)}
                </div>
                <div>
                    <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={cancel} />
                    <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={save} />
                </div>
            </div>
        </React.Fragment>
    );

    return (
        <Dialog visible={visible} style={{ width: '560px' }} header="Данные заявки" modal className="p-fluid"
            footer={footer} onHide={cancel} position="top"
        >
            <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="phone">Номер телефона клиента</label>
                    <InputMask mask="+7 (999) 999-99-99" value={currentOrder.customer?.phone} name="phone"
                        onChange={onCustomerPhoneChange}
                        required className={classNames({ 'p-invalid': submitted && !currentOrder.customer?.phone })}
                    />
                    {submitted && !currentOrder.customer?.phone && <small className="p-invalid">Номер телефона обязателен</small>}
                </div>
                <div className="p-field p-col">
                    <label htmlFor="fullName">ФИО клиента</label>
                    <InputText
                        value={currentOrder.customer?.fullName} name="fullName"
                        onChange={onCustomerNameChange} disabled={existingCustomer}
                        required className={classNames({ 'p-invalid': submitted && !currentOrder.customer?.fullName })}
                    />
                    {submitted && !currentOrder.customer?.fullName && <small className="p-invalid">ФИО клиента обязательно</small>}
                </div>
            </div>

            <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="visitDate">Дата визита</label>
                    <Calendar value={currentOrder.visitDate} onChange={onVisitDateChange}
                        dateFormat="dd/mm/y" mask="99/99/99" showIcon showButtonBar showOnFocus={false}
                        required className={classNames({ 'p-invalid': submitted && !currentOrder.visitDate })}
                    />
                    {submitted && !currentOrder.visitDate && <small className="p-invalid">Дата визита обязательна</small>}
                </div>
                <div className="p-field p-col">
                    <label htmlFor="visitTime">Время визита</label>
                    <InputMask mask="99:99" value={currentOrder.visitTime} name="visitTime"
                        onChange={onVisitTimeChange}
                        required className={classNames({ 'p-invalid': submitted && !currentOrder.visitDate })}
                    />
                    {submitted && !currentOrder.visitTime && <small className="p-invalid">Время визита обязательно</small>}
                </div>

                {submitted && errorMessage && <Message severity="error" text={errorMessage} />}
            </div>

            <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="master">Мастер</label>
                    <Dropdown
                        value={currentOrder.master?.id}
                        options={masters}
                        optionLabel="fullName"
                        optionValue="id"
                        onChange={onMasterChange} placeholder="Выберите мастера"
                        valueTemplate={selectedMasterTemplate} itemTemplate={masterOptionTemplate}
                        showClear
                    />
                </div>
                <div className="p-field p-col">
                    <label htmlFor="service">Услуга</label>
                    <Dropdown
                        value={currentOrder.service?.id}
                        options={services}
                        optionLabel="name"
                        optionValue="id"
                        onChange={onServiceChange} placeholder="Выберите услугу"
                        valueTemplate={selectedServiceTemplate} itemTemplate={serviceOptionTemplate}
                        showClear
                    />
                </div>
            </div>
        </Dialog>
    );
}
