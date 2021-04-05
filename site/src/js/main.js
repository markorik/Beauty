import { TabsManager } from './tabs.js';
import { ExpandableText } from './spoiler.js';
import { BaseOrderForm, OrderForm } from './forms/order-form.js';
import Inputmask from "inputmask";

window.onload = () => { 
  // развернуть/свернуть текст
  const textElems = document.querySelectorAll('.expand');    
  for (const el of textElems) { 
    new ExpandableText(el); 
  } 

  // плавный скроллинг по секциям
  const smoothScrollLinks = document.querySelectorAll('.nav__smooth'); 
  for (let link of smoothScrollLinks) { 
    link.addEventListener('click', event => { 
      event.preventDefault();     
      const target = event.target; 
      const elementToScroll = document.querySelector(target.getAttribute('href')); 
      elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'end'}); 
    }); 
  } 

  // табы 
  const tabsElem = document.getElementById('tabs'); 
  new TabsManager(tabsElem); 

  // мобильное меню
  const openNav = document.getElementById('burger-open');
  openNav.addEventListener('click', event => {
    document.getElementById('burger').style.height = "100%";
  });

  const closeNav = document.querySelectorAll('.burger__link');
  const burger = document.getElementById('burger');
  for (let link of closeNav) {
    link.addEventListener('click', event => {
      burger.style.height = "0%";
    });
  }

  // сбор данных из формы в секции Контакты
  new BaseOrderForm('contact-form');
 
  // открытие модального окна с формой записи
  const showHidden = document.querySelectorAll('.show');
  for (let btn of showHidden) { 
    btn.addEventListener('click', event => {      
      new OrderForm('hidden-form');      
    }); 
  }
}
// слайдер с использованием slicker
$(document).ready(function(){
    $('.projects__container').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        appendArrows: $('.projects__scroll'),
        variableWidth: true,
        responsive: [ 
            {
              breakpoint: 1440,
              settings: {
                slidesToShow: 3
              }
            }, 
            {
              breakpoint: 1080,
              settings: {
                slidesToShow: 2
              }
            },
            {
              breakpoint: 720,
              settings: {
                slidesToShow: 1
              }
            }
        ]
      });     
      
      Inputmask().mask(document.querySelectorAll("input"));
  });

   
  

