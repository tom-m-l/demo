console.log('-------------------------------js----------------------------');

{/* <div class="main">
    <div class="loop">
        <ul>
            <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxsssssss</li>
            <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxsssssss</li>
            <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxsssssss</li>
            <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxsssssss</li>
            <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxsssssss</li>
        </ul>
    </div>
</div> */}

const mainw = document.querySelector('.main');

const loopw = mainw.querySelector('.loop');

const uls = loopw.querySelector('ul');

const lopper = setInterval(() => {

    loopw.scrollLeft++;

    console.log(loopw.scrollLeft);

    if (loopw.scrollLeft >= (uls.scrollWidth - uls.offsetWidth)) {

        loopw.scrollLeft = 0;

    }

}, 17);