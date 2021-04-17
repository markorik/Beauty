import { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

import ApiService from '../api/api_service';
import Customers from '../components/Customers/Customers';

function CustomersPage() {

    const [customers, setCustomers] = useState(null);
    const toast = useRef(null);

    const fetchData = async () => {
        try {
            const _customers = await ApiService.readCustomers();
            setCustomers(_customers);
        }
        catch (err) {
            const msg = err?.message || 'Unknown server response';
            toast.current?.show({
                severity: 'error', summary: 'Error', detail: `Невозможно загрузить список клиентов: ${msg}`, life: 5000
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <Customers
            customers={customers}
        />
    );
}

export default withRouter(CustomersPage);