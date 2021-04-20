import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";

import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import Masters from '../components/Masters/Masters';
import MasterDetailsForm from '../components/Masters/MasterDetailsForm';
import ApiService from '../api/api_service'

function MastersPage() {

    const emptyMaster = {
        id: null,
        firstName: '',
        patronymic: '',
        surName: '',
        fullName: '',
        position: ''
    };

    const [masters, setMasters] = useState(null);
    const [currentMaster, setCurrentMaster] = useState(emptyMaster);
    const [editMasterDialog, setEditMasterDialog] = useState(false);
    const [deleteMasterDialog, setDeleteMasterDialog] = useState(false);
    
    const toast = useRef(null);

    const fetchData = async () => {
        try {
            const _masters = await ApiService.readMasters();
            setMasters(_masters);
        }
        catch (err) {
            const msg = err?.message || 'Unknown server response';
            toast.current?.show({
                severity: 'error', summary: 'Ошибка', detail: `Невозможно загрузить список мастеров: ${msg}`, life: 5000
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const saveMaster = async (newData) => {
        try {
            let _createMaster = await ApiService.createMaster(newData);
            toast.current.show({
                severity: 'success', summary: 'Успешно', life: 3000,
                detail: `Мастер '${_createMaster.fullName}' создан`
            });
            await fetchData();
        }
        catch(err) {
            const msg = err?.message || 'Unknown server response';
            toast.current?.show({
                severity: 'error', summary: 'Ошибка', detail: `Невозможно создать мастера: ${msg}`, life: 5000
            });
        }
        setEditMasterDialog(false);
        setCurrentMaster(emptyMaster);
    }

    const deleteCurrentMaster = async () => {
        try {
            await ApiService.deleteMaster(currentMaster.id);
            toast.current.show({
                severity: 'success', summary: 'Успешно', detail: 'Мастер удалён', life: 3000
            });
            await fetchData();
        }
        catch(err) {
            const msg = err?.message || 'Unknown server response';
            toast.current.show({
                severity: 'error', summary: 'Ошибка', detail: `Невозможно удалить мастера: ${msg}`, life: 5000
            });
        }
        setDeleteMasterDialog(false);
        setCurrentMaster(emptyMaster);
    }

    const askNewMaster = () => {
        setCurrentMaster(emptyMaster);
        setEditMasterDialog(true);
    }

    const askDeleteMaster = (master) => {
        setCurrentMaster(master);
        setDeleteMasterDialog(true);
    }

    const deleteMasterDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={e => setDeleteMasterDialog(false)} />
            <Button label="Да" icon="pi pi-check" className="p-button-text p-button-danger" onClick={deleteCurrentMaster} />
        </React.Fragment>
    );
    
    return (
        <React.Fragment>
            <Toast ref={toast} />

            <Masters
                masters={masters}
                onNew={askNewMaster}
                onUpdate={fetchData}                
                onDelete={askDeleteMaster}
            />

            <MasterDetailsForm
                visible={editMasterDialog}
                master={currentMaster}
                onCancel={() => setEditMasterDialog(false)}
                onSave={saveMaster}
            />

            <Dialog visible={deleteMasterDialog} style={{ width: '450px' }}
                header="Подтверждение" modal footer={deleteMasterDialogFooter}
                onHide={e => setDeleteMasterDialog(false)} position="top"
            >
                <div className="p-d-flex p-ai-center">
                    <div className="p-mr-2">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    </div>
                    <div>
                        {currentMaster &&
                            <span>Вы уверены, что хотите удалить <b className="p-text-nowrap">{currentMaster.fullName}</b>?</span>
                        }
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
}

export default withRouter(MastersPage);