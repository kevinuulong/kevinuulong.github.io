
loadCards();
// adjustPopouts();

function adjustPopouts() {
    document.querySelectorAll('.project.right').forEach(elem => {
        elem.classList.toggle('right');
    })
    document.querySelectorAll('.project').forEach(project => {
        let right = project.getBoundingClientRect().right;
        // 392px is approx size of a grid item with padding and gutters
        if (right + 392 > window.innerWidth) {
            project.classList.toggle('right');
        }
    })
}

let resized;
window.addEventListener('resize', () => {
    clearTimeout(resized)
    resized = setTimeout(adjustPopouts, 200)
});

function linkInNewTab(href) {
    Object.assign(document.createElement('a'), {
        href: href
    }).click();
}

// This mostly works but I should look into Mutation Observers (I did now, & I cannot find a way to observe external css style changes using them!)
// NOTE: I'm not a fan of this solution, it mostly works and I will use it for the time being;
//       I am leaving some of the code I was testing though so that I can come back to some of those ideas at a later date.
//       Current thoughts though are: I may want to show the 'gist' using JS instead of CSS to make other interactions easier
let focused = false;
function mobileTapHandler() {
    document.querySelectorAll('.project:not([class*="highlighted"])').forEach(project => {
        project.addEventListener('click', e => {
            // If in a mobile view
            if (window.innerWidth <= 1064) {
                // console.log(getComputedStyle(project.querySelector('.gist')).display);
                e.preventDefault();
                e.stopImmediatePropagation();
                focused = true;
                // Create a one-time event listener
                project.querySelector('.gist').addEventListener('click', (e) => {
                    linkInNewTab(project.href);
                    focused = false;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }, { once: true })
            }
        })
    })
}

document.body.addEventListener('click', handleFocus);
document.body.addEventListener('scroll', handleFocus);

function handleFocus() {
    if (focused) {
        document.querySelectorAll('.project > .gist').forEach(gist => {
            let elem = gist.cloneNode(true);
            gist.parentNode.replaceChild(elem, gist);
            focused = false;
        })
    }
}

async function loadCards() {
    const content = await fetch('/content/projects.json')
        .then(res => res.json())
        .then(res => {
            let projects = document.querySelector('#projects');
            res.forEach(project => {
                let title = project.title,
                    blurb = project.blurb,
                    highlight = project.highlight || false,
                    color = project.color || 'white',
                    gistColor = project.gistColor,
                    gist = project.gist,
                    href = project.href,
                    bkgImg = project.bkgImg || false,
                    card = document.createElement('a'),
                    icon = document.createElement('span'),
                    div = document.createElement('div'),
                    titleElement = document.createElement('h2'),
                    blurbElement = document.createElement('p'),
                    gistElement = document.createElement('div'),
                    gistTitle = document.createElement('h2'),
                    gistBlurb = document.createElement('p');
                card.classList.add('card', 'bkg', 'project', color, `gist-${gistColor}`);
                icon.classList.add('material-icons-round');
                gistElement.classList.add('gist');

                if (highlight) {
                    card.classList.add(highlight);
                }

                card.href = href;

                if (bkgImg) {
                    card.style.backgroundImage = `url(${bkgImg})`;
                }

                icon.textContent = 'launch';
                titleElement.textContent = title;
                blurbElement.textContent = blurb;
                gistTitle.textContent = 'The Gist';
                gistBlurb.textContent = gist;

                div.appendChild(titleElement);
                div.appendChild(blurbElement);

                gistElement.appendChild(gistTitle);
                gistElement.append(gistBlurb);

                card.appendChild(icon);
                card.appendChild(div);
                card.appendChild(gistElement);

                projects.appendChild(card);
            })
        })
    cardsLoaded();
}

function cardsLoaded() {
    adjustPopouts();
    mobileTapHandler();
}

// SEE NOTE ABOVE:

// document.querySelectorAll('.project > div.gist').forEach(gist => {
//     gist.addEventListener('click', e => {
//         // If in a mobile view
//         if (window.innerWidth <= 1064) {
//             // linkInNewTab(gist.parentNode.href, e)
//             console.log("Hi");
//         }
//     })
// })

// var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutationRecord) {
//         console.log('style changed!');
//     });    
// });

// var target = document.querySelector('.gist');
// observer.observe(target, { attributes : true, attributeFilter : ['style'] });

// document.querySelectorAll('.project:hover:not([class*="highlighted"]) > .gist').forEach(gist => {
//     let options = {
//         attributes: true
//     };
//     let observer = new MutationObserver(callback);
//     console.log("Hi, there");
//     observer.observe(gist, options);
// })

// let gist = document.querySelector('.gist')

// function callback(mutations) {
//     console.log("Hello");
//     console.log(mutations);
// }