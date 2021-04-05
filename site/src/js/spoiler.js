const TogglePhrases = { 
    Collapse: 'Свернуть', 
    Expand: 'Развернуть' 
}; 

export class ExpandableText { 
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