// js
import _ from 'lodash';
import printMe from './print';

const box = document.getElementsByClassName('box')[0];

console.log(box);

box.innerHTML = 'demojs';

function component() {
    const element = document.createElement('div');

    const btn = document.createElement('button');

    // lodash _
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';

    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
}

box.appendChild(component());