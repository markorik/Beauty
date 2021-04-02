import ApiService from '../services/api-service';

export class OrderForm {
    constructor() {
        this.pending = false;
        this.formEl = document.getElementById('hidden-form');                
        this.mastersSelect = this.formEl.elements.masterId;
        this.servicesSelect = this.formEl.elements.serviceId;      
        this._init();
        this._bindEvents();
    }

    _init () {
        this.formEl.elements.name.style.display = "inline-block";
        this.formEl.elements.phone.style.display = "inline-block";
        this.formEl.elements.masterId.style.display = "inline-block";
        this.formEl.elements.serviceId.style.display = "inline-block";
        this.formEl.elements.visitDate.style.display = "inline-block";
        
        // this._buildMastersSelect();
        // this._buildServicesSelect();

        this._buildSelect(this.mastersSelect, ApiService.getMasters(), (master) => `${master.surName} ${master.firstName}`);
        this._buildSelect(this.servicesSelect, ApiService.getSaloonServices(), (service) => `${service.name}`);
    }

    async _buildSelect(elem, loader, getValue) {
        try{
            elem.innerHTML = '';
            const data = await loader;

            data.forEach(val => {
                const option = document.createElement('option');
                option.value = val.id;
                option.textContent = getValue(val);
                elem.add(option);
            });
        } catch(error) {
            console.log(error);
        }
    }

    // async _buildMastersSelect() {
    //     try{
    //         this.mastersSelect.innerHTML = '';
    //         const masters = await ApiService.getMasters();

    //         masters.forEach(master => {
    //             const option = document.createElement('option');
    //             option.value = master.id;
    //             option.textContent = `${master.surName} ${master.firstName}`;
    //             this.mastersSelect.add(option);
    //         });
    //     } catch(error) {
    //         console.log(error);
    //     }
    // }

    // async _buildServicesSelect() {
    //     try{
    //         this.servicesSelect.innerHTML = '';
    //         const services = await ApiService.getSaloonServices();

    //         services.forEach(service => {
    //             const option = document.createElement('option');
    //             option.value = service.id;
    //             option.textContent = `${service.name}`;
    //             this.servicesSelect.add(option);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    _bindEvents() {
        this.formEl.addEventListener('submit', (event) => {
            event.preventDefault();
            this._handleForm();
        });
    }

    async _handleForm() {
        const orderData = {
            name: this.formEl.elements.name.value,
            phone: this.formEl.elements.phone.value,
            masterId: this.formEl.elements.masterId.value,
            serviceId: this.formEl.elements.serviceId.value,
            visitDate: this.formEl.elements.visitDate.value,
        };

       this._togglePendingState();

        setTimeout(async () => {
            try {
                await ApiService.createOrder(orderData);
                this.formEl.reset();                    
                //сообщить об успехе
                this.formEl.elements.name.style.display = "none";
                this.formEl.elements.phone.style.display = "none";
                this.formEl.elements.masterId.style.display = "none";
                this.formEl.elements.serviceId.style.display = "none";
                this.formEl.elements.visitDate.style.display = "none";
                    //закрыть модальное окно
                // $.fancybox.close();
            } catch (error) {
                console.error(error);  
            } finally {
                this._togglePendingState();
            } 
        }, 0);
    }

    _togglePendingState() {
        this.pending = !this.pending;
        this.formEl.classList.toggle('hidden-form_pending', this.pending); 
    }
}