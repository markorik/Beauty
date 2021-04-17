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


export default function CustomerDetailsForm({visible, order, masters, services, onCancel, onSave}) {
    const [submitted, setSubmitted] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(order);
    const [triStateStatus, setTriStateStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    
    useEffect(() => {
        setCurrentOrder(order);
        // Устанавливаем triStateStatus
        if (order.status === 'Opened') {
            setTriStateStatus(null);
        }
        else {
            setTriStateStatus(order.finishStatus === 'Success');
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
        if (newData.customer.fullName && newData.customer.phone && newData.visitDate) {
           try {
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
                    {currentOrder.id && (<React.Fragment>
                        <label htmlFor="status">Статус:&nbsp;</label>
                        <TriStateCheckbox value={triStateStatus} onChange={onStatusChange} name="status" />
                        <span className={`order-badge status-${currentOrder.status?.toLowerCase()}-${currentOrder.finishStatus?.toLowerCase()}`}>{currentOrder.status}</span>
                    </React.Fragment>)}
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
                    <label htmlFor="fullName">ФИО клиента</label>
                    <InputText
                        value={currentOrder.customer?.fullName} name="fullName"
                        onChange={onCustomerNameChange}
                        required className={classNames({ 'p-invalid': submitted && !currentOrder.customer?.fullName })}
                    />
                    {submitted && !currentOrder.customer?.fullName && <small className="p-invalid">ФИО клиента обязательно</small>}
                </div>
            </div>

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
                    <label htmlFor="visitDate">Дата визита</label>
                    <Calendar value={currentOrder.visitDate} onChange={onVisitDateChange}
                        dateFormat="dd/mm/y" mask="99/99/99" showIcon showButtonBar showOnFocus={false}
                        required className={classNames({ 'p-invalid': submitted && !currentOrder.visitDate })}
                    />
                    {submitted && !currentOrder.visitDate && <small className="p-invalid">Дата визита обязательна</small>}
                </div>
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
            
            {submitted && errorMessage && <Message severity="error" text={errorMessage} />}

        </Dialog>
    );
}
