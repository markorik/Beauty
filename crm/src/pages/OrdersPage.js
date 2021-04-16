import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import ApiService from '../api/api_service';

import Orders from '../components/Orders/Orders';
import OrderDetailsForm from '../components/Orders/OrderDetailsForm';


function OrdersPage() {
    const emptyOrder = {
        id: null,
        customer: {
            fullName: '',
            phone: '',
        },
        status: 'Opened',
        visitDate: null,
        master: null,
        service: null,
    };

    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [masters, setMasters] = useState([]);
    const [services, setServices] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(emptyOrder);
    const [editOrderDialog, setEditOrderDialog] = useState(false);
    const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);

    const toast = useRef(null);

    const fetchData = async () => {
        try {
            const [_orders, _customers, _masters, _services] = await Promise.all([ApiService.readOrders(), ApiService.readCustomers(), ApiService.readMasters(), ApiService.readServices()]);
        
            // преобразование date strings в Date objects
            _orders.forEach((v) => {
                v.visitDate = v.visitDate ? new Date(v.visitDate) : null;
                v.createdDate = v.createdDate ? new Date(v.createdDate) : null;
            });
    
            setOrders(_orders);
            setCustomers(_customers);
            setMasters(_masters);
            setServices(_services);
        }
        catch (err) {
            const msg = err?.message || 'Unknown server response';
            toast.current?.show({
                severity: 'error', summary: 'Ошибка', detail: `Невозможно загрузить заявки: ${msg}`, life: 5000
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    const saveOrder = async (newData) => {
        if (currentOrder.id) {
            // сохранение существующей заявки
            
            /*  ATTENTION!
                При попытке сохранения нормальных данных на сервер (PATCH /api/orders/3):
                {
                    "customerId":2,
                    "visitDate":"2020-05-25T10:27:33.153Z",
                    "masterId":4,
                    "serviceId":5,
                    "status":"Closed",
                    "finishStatus":"Success"
                }
                прилетает ошибка {
                    "statusCode": 500,
                    "message": "Internal server error"
                }
                после чего ломается даже GET /api/orders с такой же ошибкой.
                               
                Это проявляется и при работе с сервером напрямую через swagger:
                http://localhost:3001/api/swagger/#/Orders/OrdersController_updateOrder

                Когда сервер будет работать нормально, строчку с ApiService.updateOrder можно расскоментировать.

            */
           
            let request = {
                customerId: newData.customer.id,
                visitDate: newData.visitDate,
                masterId: newData.master?.id,
                serviceId: newData.service?.id,
                status: newData.status
            };
            if (newData.status === 'Closed') {
                request.finishStatus = newData.finishStatus
            }
            // let _updatedOrder = await ApiService.updateOrder(currentOrder.id, request);
            let _updatedOrder = currentOrder;
            toast.current.show({
                severity: 'success', summary: 'Успешно', life: 3000,
                detail: `Заявка для '${_updatedOrder.customer.fullName}' at '${_updatedOrder.visitDate}' изменена`
            });            
            await fetchData();
        }
        else {
            // создание новой заявки
            let request = {
                name: newData.customer.fullName,
                phone: newData.customer.phone,
                visitDate: newData.visitDate,
                masterId: newData.master?.id,
                serviceId: newData.service?.id
            };

            let _createdOrder = await ApiService.createOrder(request);
            toast.current.show({
                severity: 'success', summary: 'Успешно', life: 3000,
                detail: `Заявка для '${_createdOrder.customer.fullName}' at '${_createdOrder.visitDate}' создана`
            });
            await fetchData();
        }
        setEditOrderDialog(false);
        setCurrentOrder(emptyOrder);
    }

    const deleteCurrentOrder = async () => {
        try {
            await ApiService.deleteOrder(currentOrder.id);
            toast.current.show({
                severity: 'success', summary: 'Успешно', life: 3000, detail: 'Заявка удалена'
            });
            await fetchData();
        }
        catch(err) {
            const msg = err.message || 'Unknown server response';
            toast.current.show({
                severity: 'error', summary: 'Ошибка', life: 5000, detail: `Невозможно удалить заявку: ${msg}`
            });
        }
        setDeleteOrderDialog(false);
        setCurrentOrder(emptyOrder);
    }


    const askNewOrder = () => {
        setCurrentOrder(emptyOrder);
        setEditOrderDialog(true);
    }

    const askEditOrder = (order) => {
        setCurrentOrder({ ...order });
        setEditOrderDialog(true);
    }

    const askDeleteOrder = (order) => {
        setCurrentOrder(order);
        setDeleteOrderDialog(true);
    }


    const deleteOrderDialogFooter = (
        <React.Fragment>
            <Button label="Нет" icon="pi pi-times" className="p-button-text" onClick={e => setDeleteOrderDialog(false)} />
            <Button label="Да" icon="pi pi-check" className="p-button-text p-button-danger" onClick={deleteCurrentOrder} />
        </React.Fragment>
    );


    return (
        <div>
            <Toast ref={toast} />

            <Orders
                orders={orders}
                onNew={askNewOrder}
                onUpdate={fetchData}
                onEdit={askEditOrder}
                onDelete={askDeleteOrder}
            />

            <OrderDetailsForm
                visible={editOrderDialog}
                order={currentOrder}
                customers={customers}
                masters={masters}
                services={services}
                onCancel={() => setEditOrderDialog(false)}
                onSave={saveOrder}
            />

            <Dialog visible={deleteOrderDialog} style={{ width: '450px' }} header="Подтверждение" modal footer={deleteOrderDialogFooter} onHide={e => setDeleteOrderDialog(false)} position="top">
                <div className="confirmation-content">
                    <div className="p-d-flex p-ai-center">
                        <div className="p-mr-2">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        </div>
                        <div>
                            {currentOrder && <span>Вы уверены, что хотите удалить заявку для <b className="p-text-nowrap">{currentOrder?.customer?.fullName}</b>?</span>}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default withRouter(OrdersPage);
