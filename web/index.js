// js
const gamels = this.gameItem.querySelectorAll('li');

gamels[this.num].className = '';

this.num++;

if (this.num > gamels.length - 1) {
    this.num = 0;
}

gamels[this.num].className = 'cur';