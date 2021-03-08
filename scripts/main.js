adjustPopoutsV2();

function calcColumns() {
    const cols = new Set();
    document.querySelectorAll('.project').forEach(project => {
        let left = project.getBoundingClientRect().left;
        cols.add(left);
    })
    return cols.size;
}

function adjustPopouts() {
    let columns = calcColumns();
    document.querySelectorAll('.project.right').forEach(elem => {
        elem.classList.toggle('right');
    })
    document.querySelectorAll(`.project:nth-child(${columns}n)`).forEach(elem => {
        elem.classList.toggle('right');
    })
}

function adjustPopoutsV2() {
    document.querySelectorAll('.project.right').forEach(elem => {
        elem.classList.toggle('right');
    })
    document.querySelectorAll('.project').forEach(project => {
        let right = project.getBoundingClientRect().right;
        if (right + 392 > window.innerWidth) {
            project.classList.toggle('right');
        }
    })
}

let resized;
window.addEventListener('resize', () => {
    clearTimeout(resized)
    resized = setTimeout(adjustPopoutsV2, 200)
});