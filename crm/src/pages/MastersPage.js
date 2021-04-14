import { useState, useEffect, useRef } from 'react';
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
        position: '',
        photo: ''
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
                severity: 'error', summary: 'Error', detail: `Невозможно загрузить список мастеров: ${msg}`, life: 5000
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const saveMaster = async (newData) => {
        if (currentMaster.id) {
            // сохраняем текущего
            try {
                let _updateMaster = await ApiService.updateMaster(currentMaster.id, newData);
                toast.current.show({
                    severity: 'success', summary: 'Success', life: 3000,
                    detail: `Данные мастера '${_updateMaster.fullName}' изменены`
                });
                await fetchData();
            }
            catch(err) {
                const msg = err?.message || 'Unknown server response';
                toast.current.show({
                    severity: 'error', summary: 'Error', detail: `Невозможно изменить данные: ${msg}`, life: 5000
                });
            }
        }
        else {
            // создаём нового
            try {
                let _createMaster = await ApiService.createMaster(newData);
                toast.current.show({
                    severity: 'success', summary: 'Success', life: 3000,
                    detail: `Мастер '${_createMaster.fullName}' создан`
                });
                await fetchData();
            }
            catch(err) {
                const msg = err?.message || 'Unknown server response';
                toast.current.show({
                    severity: 'error', summary: 'Error', detail: `Невозможно создать мастера: ${msg}`, life: 5000
                });
            }
        }
        setEditMasterDialog(false);
        setCurrentMaster(emptyMaster);
    }

     const deleteCurrentMaster = async () => {
        try {
            await ApiService.deleteMaster(currentMaster.id);
            toast.current.show({
                severity: 'success', summary: 'Success', detail: 'Мастер удалён', life: 3000
            });
            await fetchData();
        }
        catch(err) {
            const msg = err?.message || 'Unknown server response';
            toast.current.show({
                severity: 'error', summary: 'Error', detail: `Невозможно удалить мастера: ${msg}`, life: 5000
            });
        }
        setDeleteMasterDialog(false);
        setCurrentMaster(emptyMaster);
    }


    const askNewMaster = () => {
        setCurrentMaster(emptyMaster);
        setEditMasterDialog(true);
    }

    const askUpdateMaster = (master) => {
        setCurrentMaster({ ...master });
        setEditMasterDialog(true);
    }

    const askDeleteMaster = (master) => {
        setCurrentMaster(master);
        setDeleteMasterDialog(true);
    }


    const deleteMasterDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={e => setDeleteMasterDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text p-button-danger" onClick={deleteCurrentMaster} />
        </>
    );

    
    return (
        <>
            <Toast ref={toast} />

            <Masters
                masters={masters}
                onNew={askNewMaster}
                onUpdate={fetchData}
                onEdit={askUpdateMaster}
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
        </>
    );
}

export default withRouter(MastersPage);