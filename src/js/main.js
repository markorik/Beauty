
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

//развернуть/свернуть текст
const TogglePhrases = { 
    Collapse: 'Свернуть', 
    Expand: 'Развернуть' 
}; 

class ExpandableText { 
  constructor(elem, maxLength = 500) { 
    this.maxLength = maxLength; 
    this.elem = elem;     
    this.originalText = elem.textContent; 
     
    this.isToggle = false; 
     
    // this.toggleBtn = document.createElement('button'); 
    this.toggleBtn = document.createElement('a');
    this.toggleBtn.className = "about__link";
    this.toggleBtn.textContent = TogglePhrases.Expand; 
    this.toggleBtn.addEventListener('click', () => this.toggle()); 
     
    this.elem.textContent = this._getShortText(); 
    this.elem.append(this.toggleBtn); 
  } 
   
  toggle() { 
    this.isToggle = !this.isToggle; 
     
    this.toggleBtn.textContent = this.isToggle 
      ? TogglePhrases.Collapse 
      : TogglePhrases.Expand; 
     
    this.elem.textContent = this.isToggle 
      ? this.originalText 
      : this._getShortText(); 
     
    this.elem.append(this.toggleBtn); 
  } 
   
  _getShortText() { 
    return (this.originalText.slice(0, this.maxLength)) + '...'; 
  } 
} 

window.onload = () => { 
  const textElems = document.querySelectorAll('.expandable-text'); 
   
  for (const el of textElems) { 
    new ExpandableText(el, 485); 
  } 
}
