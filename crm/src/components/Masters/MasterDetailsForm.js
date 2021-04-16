import React, { useState, useEffect } from "react";
import classNames from 'classnames';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export default function MasterDetailsForm({visible, master, onCancel, onSave}) {
    const [submitted, setSubmitted] = useState(false);
    const [currentMaster, setCurrentMaster] = useState(master);

    useEffect(() => {
        setCurrentMaster(master);
    }, [master]);

    const cancel = () => {
        setSubmitted(false);
        onCancel();
    }

    const save = () => {
        setSubmitted(true);
        const newData = {
            firstName: currentMaster.firstName?.trim(),
            surName: currentMaster.surName?.trim(),
            patronymic: currentMaster.patronymic?.trim(),
            position: currentMaster.position?.trim(),
            photo: currentMaster.photo?.trim(),
        }
        if (newData.firstName && newData.surName && newData.patronymic && newData.position) {
            onSave(newData);
            setSubmitted(false);
        }
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _master = { ...currentMaster };
        _master[`${name}`] = val;

        setCurrentMaster(_master);
    }

    const footer = (
        <React.Fragment>
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={cancel} />
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={save} />
        </React.Fragment>
    );

    return (
        <Dialog visible={visible} style={{ width: '560px' }} header="Данные мастера" modal className="p-fluid" footer={footer} onHide={cancel} position="top">
            <div className="p-field">
                <label htmlFor="surName">Фамилия</label>
                <InputText value={currentMaster.surName} onChange={(e) => onInputChange(e, 'surName')} required autoFocus className={classNames({ 'p-invalid': submitted && !currentMaster.surName })} />
                {submitted && !currentMaster.surName && <small className="p-invalid">Указание фамилии обязательно.</small>}
            </div>

            <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="firstName">Имя</label>
                    <InputText value={currentMaster.firstName} onChange={(e) => onInputChange(e, 'firstName')} required className={classNames({ 'p-invalid': submitted && !currentMaster.firstName })} />
                    {submitted && !currentMaster.firstName && <small className="p-invalid">Указание имени обязательно.</small>}
                </div>
                <div className="p-field p-col">
                    <label htmlFor="patronymic">Отчество</label>
                    <InputText value={currentMaster.patronymic} onChange={(e) => onInputChange(e, 'patronymic')} required className={classNames({ 'p-invalid': submitted && !currentMaster.patronymic })} />
                    {submitted && !currentMaster.patronymic && <small className="p-invalid">Указание отчества обязательно.</small>}
                </div>
            </div>
            <div className="p-field">
                <label htmlFor="position">Позиция</label>
                <InputText value={currentMaster.position} onChange={(e) => onInputChange(e, 'position')} required className={classNames({ 'p-invalid': submitted && !currentMaster.position })} />
                {submitted && !currentMaster.position && <small className="p-invalid">Указание позиции обязательно.</small>}
            </div>                      
        </Dialog>
    );
}
