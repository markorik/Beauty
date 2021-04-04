import ApiService from '../services/api-service';

export class BaseOrderForm {
    constructor(id) {
        this.formEl = document.getElementById(id);
        this.pending = this.formEl.querySelector('.loader'); 
        this.pending.style.display = "none";  
        this._switch('.form__thanks', '.form__record');

        // валидатор
        let handler = this._handleForm.bind(this);

        $(`#${this.formEl.id}`).validate({
            rules: {
                name: "required",
                phone: "required"
            },
            messages: {
                name: "",
                phone: ""
            },
            submitHandler: (form, event) => {
                event.preventDefault();
                handler();
            }
        });
    }

    //Переключение видимости у содержимого формы
    _switch(tohide, toshow) {
        let viz = this.formEl.querySelectorAll(tohide);
        for (let i of viz) {        
            i.style.display = "none";
        }
        viz = this.formEl.querySelectorAll(toshow);
        for (let i of viz) {
            i.style.display = "inline-block";
        }
    } 
    
    _getOrderData() {
        return {
            name: this.formEl.elements.name.value,
            phone: this.formEl.elements.phone.value,
            masterId: "",
            serviceId: "",
            visitDate: "",
        };
    }

    // скрыть сообщение об отправке заявки
    _afterThanks() {
        this._switch('.form__thanks', '.form__record');    
    }

    async _handleForm() {   
        // включить лоадер
        this.pending.style.display = "inline-block";      
        setTimeout(async () => {
            try {
                await ApiService.createOrder(this._getOrderData());
                this.formEl.reset();                                                                  
                // спасибо
                this._switch('.form__record', '.form__thanks');
                setTimeout(this._afterThanks.bind(this), 2000);
                                  
            } catch (error) {
                console.error(error);  
            } finally {                
                // убрать лоадер
                this.pending.style.display = "none";     
            }
        }, 2000);        
    }
}
export class OrderForm extends BaseOrderForm {
        constructor(id) {        
            super(id);               
            this.mastersSelect = this.formEl.elements.masterId;
            this.servicesSelect = this.formEl.elements.serviceId;      
            this._init();
        }
    
        _init () {                    
            this._buildSelect(
                this.mastersSelect,
                ApiService.getMasters(),
                (master) => `${master.surName} ${master.firstName}`,
                '<option value="" disabled selected>Выберите мастера</option>'
            );
            this._buildSelect(
                this.servicesSelect,
                ApiService.getSaloonServices(),
                (service) => `${service.name}`,
                '<option value="" disabled selected>Выберите услугу</option>'
            );
        }                
    
        // Заполнение выпадающих списков данными с сервера
        async _buildSelect(elem, loader, getValue, defaultValue = '') {
            try{
                elem.innerHTML = defaultValue; // placeholder у выпадающего списка
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
    
        _getOrderData() {
            return {
                name: this.formEl.elements.name.value,
                phone: this.formEl.elements.phone.value,
                masterId: this.formEl.elements.masterId.value,
                serviceId: this.formEl.elements.serviceId.value,
                visitDate: this.formEl.elements.visitDate.value,
            };
        }

        // закрыть модальное окно
        _afterThanks() {
            $.fancybox.close();
        }
    }