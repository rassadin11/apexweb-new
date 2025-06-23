import './components/slider.js'
import IMask from 'imask';

const swiffySlider = document.querySelector('.swiffy-slider.slider-item-show4')

if (swiffySlider) {
    if (document.body.clientWidth < 1500 && document.body.clientWidth > 1200) {
        swiffySlider.classList.remove('slider-item-show4')
        swiffySlider.classList.remove('slider-item-show3')
        swiffySlider.classList.remove('slider-item-show2')

        swiffySlider.classList.add('slider-item-show3')

        const buttons = Math.ceil(swiffySlider.querySelectorAll('.review-block').length / 3);
        const sliderIndicators = swiffySlider.querySelector('.slider-indicators');
        sliderIndicators.innerHTML = '';

        for (let i = 0; i < buttons; i++) {
            if (i === 0) {
                sliderIndicators.insertAdjacentHTML('beforeend', `<button class="active"></button>`)
            } else {
                sliderIndicators.insertAdjacentHTML('beforeend', `<button></button>`)
            }
        }
    } else if (document.body.clientWidth <= 1200 && document.body.clientWidth > 992) {
        swiffySlider.classList.remove('slider-item-show4')
        swiffySlider.classList.remove('slider-item-show3')
        swiffySlider.classList.remove('slider-item-show2')

        swiffySlider.classList.add('slider-item-show2')

        const buttons = Math.ceil(swiffySlider.querySelectorAll('.review-block').length / 2);
        const sliderIndicators = swiffySlider.querySelector('.slider-indicators');
        sliderIndicators.innerHTML = '';

        for (let i = 0; i < buttons; i++) {
            if (i === 0) {
                sliderIndicators.insertAdjacentHTML('beforeend', `<button class="active"></button>`)
            } else {
                sliderIndicators.insertAdjacentHTML('beforeend', `<button></button>`)
            }
        }
    }
}

// dropdown menu pc

const dropdowns = document.querySelectorAll('.menu__dropdown');
const slidesIndexes = document.querySelectorAll('[data-slide]')
const slider = document.querySelector('.header-slider')
let index = 0;

function dropdownMenu() {
    if (document.body.clientWidth > 992) {
        const headerWrapper = document.querySelector('.header__wrapper')

        // показываем выпадающее меню
        dropdowns.forEach((item) => {
            const navLink = item.querySelector('.nav-link');
            const dropdownMenu = item.querySelector('.dropdown-menu');

            item.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    dropdownMenu.classList.add('active');
                    navLink.querySelector('.arrow').classList.add('active');
                    headerWrapper.classList.add('active');
                }
            })

            item.addEventListener('mouseleave', () => {
                // закрываем меню
                item.querySelector('.dropdown-menu').classList.remove('active');
                navLink.querySelector('.arrow').classList.remove('active');
                headerWrapper.classList.remove('active');

                setTimeout(() => {
                    // сбрасываем выпадающее меню
                    slidesIndexes.forEach(elem => elem.classList.remove('active'))
                    slidesIndexes[0].classList.add('active')
                    index = 0;
                    slider.style.transform = `translateX(-${index * 100}%)`;
                }, 300)
            })
        })

        // реализуем переход внутри меню
        slidesIndexes.forEach(item => {
            item.addEventListener('click', () => {
                slidesIndexes.forEach(elem => elem.classList.remove('active'))
                item.classList.add('active')

                index = +item.dataset.slide
                slider.style.transform = `translateX(-${index * 100}%)`;
            })
        })
    }
}

dropdownMenu();

window.onresize = () => {
    dropdownMenu();
};

// mobile menu generator

const mobileTitle = document.querySelector('.mobile-menu__title')
const attrLayouts = document.querySelectorAll("[data-layout]")
const initialMenu = document.querySelectorAll('[data-initial-layout]')
const mobileMenu = {}

// добавляем в массив главное меню
mobileMenu[0] = [mobileTitle.innerHTML]

initialMenu.forEach(item => {
    const title = item.querySelector('span').innerHTML.replace(/\s+/g, ' ').replace('&nbsp;', " ").trim()
    if (+item.dataset.layout) {
        mobileMenu[0] = [...mobileMenu[0], [title, +item.dataset.layout]]
    } else {
        mobileMenu[0] = [...mobileMenu[0], [title]]
    }
})

// на первой итерации собираем все заголовки
attrLayouts.forEach(item => {
    if (item.dataset.position.includes('header')) {
        const headerPosition = item.dataset.position.replace(" ", "").split(",").indexOf('header');
        const layouts = item.dataset.layout.split(",")
        const itemTitle = item.querySelector("span").innerHTML.replace(/\s+/g, ' ').replace('&nbsp;', " ").trim();

        mobileMenu[`${+layouts[headerPosition]}`] = [itemTitle]
    }
})


// на второй итерации составляем меню
attrLayouts.forEach(item => {
    if (item.dataset.position.includes('element')) {
        const layouts = item.dataset.layout.split(",")
        let itemTitle;

        if (item.querySelector("a")) {
            itemTitle = item.querySelector("a").innerHTML.replace(/\s+/g, ' ').replace('&nbsp;', " ").trim()
        } else {
            itemTitle = item.querySelector("span").innerHTML.replace(/\s+/g, ' ').replace('&nbsp;', " ").trim();
        }

        if (layouts.length === 1) {
            if (mobileMenu[+layouts[0]]) {
                mobileMenu[+layouts[0]] = [...mobileMenu[+layouts[0]], [itemTitle]]
            } else {
                mobileMenu[+layouts[0]] = [[itemTitle]]
            }
        } else {
            if (mobileMenu[+layouts[0]]) {
                mobileMenu[+layouts[0]] = [...mobileMenu[+layouts[0]], [itemTitle, +layouts[1]]]
            } else {
                mobileMenu[+layouts[0]] = [[itemTitle, +layouts[1]]]
            }
        }
    }
})

// добавляем в массив изначальное меню

function menuGenerator(elements, mainMenuField) {
    mobileTitle.innerHTML = elements[0]

    for (let i = 1; i < elements.length; i++) {
        if (elements[i].length === 2) {
            mainMenuField.insertAdjacentHTML(`beforeend`, `
                <li class="nav-item d-flex align-items-center gap-2" data-layout="${elements[i][1]}">
                    <span class="nav-link p-0 p-lg-2">${elements[i][0]}</span>
                    <svg class="arrow">
                        <use href="./img/svg/sprite.svg#arrow"></use>
                    </svg>
                </li>
            `)
        } else {
            mainMenuField.insertAdjacentHTML(`beforeend`, `
                <li class="nav-item">
                    <a href="#" class="nav-link p-0 p-lg-2">${elements[i][0]}</a>
                </li>
            `)
        }
    }
}

// составляем само меню при нажатии на кнопки

let m_history = [];
const mainMenuField = document.querySelector('.header__nav ul')
const mobileArrow = document.querySelector('.mobile-burger-arrow')
mobileArrow.classList.add('disabled')

function computeMobileMenu() {
    const mainLayouts = mainMenuField.querySelectorAll("[data-layout]")

    mainLayouts.forEach(item => {
        item.addEventListener('click', () => {
            const layout = +item.dataset.layout
            m_history.push(layout)
            mainMenuField.innerHTML = ''

            // создаём новый список

            let elements;

            if (!m_history.length) {
                mobileArrow.classList.add('disabled')
            } else {
                mobileArrow.classList.remove('disabled')
                elements = mobileMenu[m_history.at(-1)];
            }

            menuGenerator(elements, mainMenuField)
            computeMobileMenu();
        })
    })
}

// делаем возврат в меню при нажатии на стрелочку

mobileArrow.addEventListener('click', () => {
    if (m_history.length) {
        m_history.pop();

        let elements;

        if (!m_history.length) {
            mobileArrow.classList.add('disabled')
            elements = mobileMenu[0]
        } else {
            elements = mobileMenu[m_history.at(-1)];
        }

        mainMenuField.innerHTML = ''
        menuGenerator(elements, mainMenuField)
        computeMobileMenu()
    }
})

if (document.body.clientWidth <= 992) {
    computeMobileMenu();
}

// open and close burger

const burger = document.querySelector('.header__burger');
const h_wrapper = document.querySelector('.header__wrapper')
const navbar = document.querySelector('.header-wrap');
const cross = navbar.querySelector('.mobile-burger-cross')

burger.addEventListener('click', () => {
    h_wrapper.classList.toggle('active');
    burger.classList.toggle('active');
    navbar.classList.toggle('active');
    document.body.classList.toggle('hidden')
});

cross.addEventListener('click', () => {
    burger.classList.toggle('active');
    navbar.classList.toggle('active');
    document.body.classList.toggle('hidden')

    setTimeout(() => {
        h_wrapper.classList.toggle('active');
        mobileArrow.classList.add('disabled')
        m_history = []

        let elements = mobileMenu[0]
        mainMenuField.innerHTML = ''

        menuGenerator(elements, mainMenuField)
        computeMobileMenu()
    }, 300)
});

// imask
let elements = document.querySelectorAll("input[type='tel']")
console.log(elements)

let maskOptions = {
    mask: '+7 (000) 000 - 00 - 00',
    lazy: false
}

let telephoneMasks = []

elements.forEach(element => {
    let mask = new IMask(element, maskOptions);
    telephoneMasks.push(mask);
})

// mail
let elements2 = document.querySelectorAll('#email');

let maskOptions2 = {
    mask: function (value) {
        if (/^[a-z0-9_\.-]+$/.test(value))
            return true;
        if (/^[a-z0-9_\.-]+@$/.test(value))
            return true;
        if (/^[a-z0-9_\.-]+@[a-z0-9-]+$/.test(value))
            return true;
        if (/^[a-z0-9_\.-]+@[a-z0-9-]+\.$/.test(value))
            return true;
        if (/^[a-z0-9_\.-]+@[a-z0-9-]+\.[a-z]{1,4}$/.test(value))
            return true;
        if (/^[a-z0-9_\.-]+@[a-z0-9-]+\.[a-z]{1,4}\.$/.test(value))
            return true;
        if (/^[a-z0-9_\.-]+@[a-z0-9-]+\.[a-z]{1,4}\.[a-z]{1,4}$/.test(value))
            return true;
        return false;
    },
    lazy: false
}

let emailMasks = []

elements2.forEach(element2 => {
    let mask2 = new IMask(element2, maskOptions2);
    emailMasks.push(mask2);
})


// Получаем все якорные ссылки из блока навигации
const navLinks = document.querySelectorAll('.table_of_context a[href^="#"]');

console.log(navLinks)

// Получаем все секции, на которые ссылаются якоря
const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href').substring(1);
    return document.getElementById(id);
}).filter(Boolean);

function activateCurrentLink() {
    const scrollPosition = window.scrollY + 150; // +100 для небольшого запаса

    sections.forEach((target, idx) => {
        const { top } = target.getBoundingClientRect();
        const targetTop = top + window.scrollY;
        const targetHeight = target.offsetHeight;

        // Проверяем, виден ли элемент
        if (scrollPosition >= targetTop && scrollPosition < targetTop + targetHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            navLinks[idx].classList.add('active');
        }
    });
}

// Вызываем функцию при загрузке и при прокрутке
window.addEventListener('load', activateCurrentLink);
activateCurrentLink();
window.addEventListener('scroll', activateCurrentLink);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});