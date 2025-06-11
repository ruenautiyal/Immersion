const addbutton = document.getElementById('addbutton');
const progresscontainer = document.getElementById('progresscontainer');

addbutton.addEventListener('click',()=>{
    const wrapper = document.createElement('div');
    wrapper.className = 'progress-wrapper';
    
    const bar = document.createElement('div');
    bar.className = 'progress-bar';

    wrapper.appendChild(bar);
    progresscontainer.appendChild(wrapper);

    requestAnimationFrame(()=>{
        bar.style.width = '100%';
    }
    );
});