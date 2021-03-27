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
  });

// развернуть/свернуть текст
const TogglePhrases = { 
    Collapse: 'Свернуть', 
    Expand: 'Развернуть' 
}; 
class ExpandableText { 
  constructor(elem) { 
    this.elem = elem;
    this.isCollapsed = true;   
    this.toggleLink = document.querySelector('a.expand__link');
    this.toggleLink.addEventListener('click', () => this.toggle()); 
    this.elem.append(this.toggleLink);
  } 
   
  toggle() { 
    this.isCollapsed = !this.isCollapsed;    
    this.toggleLink.textContent = this.isCollapsed
      ? TogglePhrases.Expand
      : TogglePhrases.Collapse;

    for (let e of this.elem.querySelectorAll('p.expand__text')) {
      e.style.display = this.isCollapsed ? 'none' : 'block';
    }
  } 
} 

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
}
   
  

