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

// svg path computer
function pathComputer(initialPath, target, divider, element) {
    let array = initialPath.split(" ");

    array.forEach((item, idx) => {
        if (!isNaN(item)) {
            array[idx] = (+item / divider) * target;
        }
    });

    array = array.join(" ");
    element.style.offsetPath = `path("${array}")`;
}

// два больших круга
const trajectory1_1 = "M 1500 650 C 900 620 400 550 -400 240";
const trajectory1_1_divider = 1734;

const trajectory2_1 = "M -300 0 C 500 620 400 550 300 1400";
const trajectory2_1_divider = 1326;

const circle1_1 = document.querySelector(".circle-1 .white-circle-1");
const circle2_1 = document.querySelector(".circle-2 .white-circle-1");

// два маленьких круга

const trajectory1_2 = "M 1600 -100 C 900 270 400 100 200 -100";
const trajectory1_2_divider = 1916;
const circle1_2 = document.querySelector(".circle-1 .white-circle-small");

const trajectory2_2 = "M -200 900 C 400 1000 300 1150 -100 2500";
const trajectory2_2_divider = 1326;
const circle2_2 = document.querySelector(".circle-2 .white-circle-small");

// два самых больших круга

const trajectory1_3 = "M 1800 800 C 900 820 200 550 -400 250";
const trajectory1_3_divider = 1916;
const circle1_3 = document.querySelector(".circle-1 .white-circle-2");

const trajectory2_3 = "M -200 150 C 300 420 300 550 600 2500";
const trajectory2_3_divider = 1326;
const circle2_3 = document.querySelector(".circle-2 .white-circle-2");

// четыре круга разного размера, двигающихся по одной траектории

const trajectory1_4 = "M 1800 600 C 900 620 400 650 -200 100";
const trajectory1_4_divider = 1916;
const circle1_4 = document.querySelector(".circle-1 .middle-circle-1");

const trajectory2_4 = "M -250 400 C 300 520 300 550 400 1500";
const trajectory2_4_divider = 1326;
const circle2_4 = document.querySelector(".circle-2 .middle-circle-1");

const trajectory1_5 = "M 1600 500 C 900 620 400 650 -200 100";
const trajectory1_5_divider = 1916;
const circle1_5 = document.querySelector(".circle-1 .middle-circle-2");

const trajectory2_5 = "M -250 400 C 300 520 300 550 400 1500";
const trajectory2_5_divider = 1326;
const circle2_5 = document.querySelector(".circle-2 .middle-circle-2");

const circleW_1 = document
    .querySelector(".circle-1")
    .getBoundingClientRect().width;

const circleW_2 = document
    .querySelector(".circle-2")
    .getBoundingClientRect().width;

pathComputer(trajectory1_1, circleW_1, trajectory1_1_divider, circle1_1);
pathComputer(trajectory2_1, circleW_2, trajectory2_1_divider, circle2_1);
pathComputer(trajectory1_2, circleW_1, trajectory1_2_divider, circle1_2);
pathComputer(trajectory2_2, circleW_2, trajectory2_2_divider, circle2_2);
pathComputer(trajectory1_3, circleW_1, trajectory1_3_divider, circle1_3);
pathComputer(trajectory2_3, circleW_2, trajectory2_3_divider, circle2_3);
pathComputer(trajectory1_4, circleW_1, trajectory1_4_divider, circle1_4);
pathComputer(trajectory2_4, circleW_2, trajectory2_4_divider, circle2_4);
pathComputer(trajectory1_5, circleW_1, trajectory1_5_divider, circle1_5);
pathComputer(trajectory2_5, circleW_2, trajectory2_5_divider, circle2_5);

// animation circles rotation
const circle = document.querySelector(".circles");
const circle1 = document.querySelector(".circle-1");
const circle2 = document.querySelector(".circle-2");

const windowWidth = document.querySelector("body").clientWidth;
const windowHeight = window.innerHeight

// Центр движения
let centerX = -100;
let centerY = 0;
let radius = 80;

const duration = 35.5 * 1000; // 35.5 секунд
const halfDuration = duration / 2;

let offsetX = 0;
let offsetY = 0;

if (windowWidth <= 992) {
    radius = 50;
    centerY = windowHeight * 0.12
    offsetX = windowWidth * 0.65
    offsetY = windowHeight * 0.15
}

if (windowWidth <= 768) {
    offsetX = windowWidth * 0.65
    offsetY = windowHeight * 0.2
}

if (windowWidth <= 700) {
    centerX = windowHeight * -0.27
    centerY = windowHeight * 0.06
    offsetX = windowHeight * 0.75
    offsetY = windowHeight * 0.3
}

if (windowWidth <= 650) {
    offsetY = windowHeight * 0.35
}

if (windowWidth <= 570) {
    centerX = windowHeight * -0.3
    centerY = windowHeight * 0.03
}

if (windowWidth <= 450) {
    offsetY = windowHeight * 0.45
    centerX = windowHeight * -0.33
    centerY = windowHeight * -0.01
}

let start = null;

function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = (timestamp - start) % duration;

    let angle;
    if (elapsed <= halfDuration) {
        angle = (elapsed / halfDuration) * (Math.PI / 2);
    } else {
        angle = (1 - (elapsed - halfDuration) / halfDuration) * (Math.PI / 2);
    }

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const x1 = centerX + radius * cos;
    const y1 = centerY + radius * sin;

    const x2 = x1 + offsetX;
    const y2 = y1 + offsetY;

    circle1.style.left = `${x1}px`;
    circle1.style.top = `${y1}px`;

    console.log(x2, y2)

    if (windowWidth > 992) {
        circle2.style.left = `${(windowWidth / 100) * 65.9 + x2}px`;
        circle2.style.top = `${windowWidth / 10 + y2}px`;
    } else {
        circle2.style.left = `${x2}px`;
        circle2.style.top = `${y2}px`;
    }

    const x = centerX + radius * cos;
    const y = centerY + radius * sin;

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// animation 25s
let timeouts = [];

function clearAllTimers() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
}

function setSafeTimeout(callback, delay) {
    const t = setTimeout(callback, delay);
    timeouts.push(t);
    return t;
}

function startFirstCircles() {
    circle1_1.style.animation = "circle1 13s cubic-bezier(0.4, 0, 0.2, 1)";

    setSafeTimeout(() => {
        circle1_1.style.animation = "none";
        void circle1_1.offsetWidth;
    }, 13000);

    setSafeTimeout(() => {
        circle2_1.style.animation = "circle2_1 13s cubic-bezier(0.4, 0, 0.2, 1)";
        setSafeTimeout(() => {
            circle2_1.style.animation = "none";
            void circle2_1.offsetWidth;
        }, 13000);
    }, 5800);

    setSafeTimeout(() => {
        startFirstCircles();
    }, 35500);
}

function startSecondCircles() {
    circle1_5.style.animation = "middle_circle3 10s cubic-bezier(0.4, 0, 0.2, 1)";

    setSafeTimeout(() => {
        circle1_5.style.animation = "none";
        void circle1_5.offsetWidth;
    }, 10000);

    setSafeTimeout(() => {
        circle2_5.style.animation = "middle_circle4 8s cubic-bezier(0.4, 0, 0.2, 1)";
        setSafeTimeout(() => {
            circle2_5.style.animation = "none";
            void circle2_5.offsetWidth;
        }, 8000);
    }, 4400);

    setSafeTimeout(() => {
        startSecondCircles();
    }, 35500);
}

function startThirdCircles() {
    circle1_3.style.animation = "circle2 13s cubic-bezier(0.4, 0, 0.2, 1)";
    setSafeTimeout(() => {
        circle1_3.style.animation = "none";
        void circle1_3.offsetWidth;
    }, 13000);

    setSafeTimeout(() => {
        circle2_3.style.animation = "circle2_2 13s cubic-bezier(0.4, 0, 0.2, 1)";
        setSafeTimeout(() => {
            circle2_3.style.animation = "none";
            void circle2_3.offsetWidth;
        }, 13000);
    }, 6700);

    setSafeTimeout(() => {
        startThirdCircles();
    }, 35500);
}

function startFourthCircles() {
    circle1_2.style.animation = "small_circle1 10s cubic-bezier(0.4, 0, 0.2, 1)";
    setSafeTimeout(() => {
        circle1_2.style.animation = "none";
        void circle1_2.offsetWidth;
    }, 10000);

    setSafeTimeout(() => {
        circle2_2.style.animation = "small_circle2 10s linear";
        setSafeTimeout(() => {
            circle2_2.style.animation = "none";
            void circle2_2.offsetWidth;
        }, 10000);
    }, 5000);

    setSafeTimeout(() => {
        startFourthCircles();
    }, 35500);
}

function startFifthCircles() {
    circle1_4.style.animation = "middle_circle1 10s cubic-bezier(0.4, 0, 0.2, 1)";
    setSafeTimeout(() => {
        circle1_4.style.animation = "none";
        void circle1_4.offsetWidth;
    }, 10000);

    setSafeTimeout(() => {
        circle2_4.style.animation = "middle_circle2 10s cubic-bezier(0.4, 0, 0.2, 1)";
        setSafeTimeout(() => {
            circle2_4.style.animation = "none";
            void circle2_4.offsetWidth;
        }, 10000);
    }, 4700);

    setSafeTimeout(() => {
        startFifthCircles();
    }, 35500);
}

function restartAllCircles() {
    clearAllTimers(); // остановим предыдущие циклы

    // сброс всех анимаций
    const allCircles = document.querySelectorAll(".circle");
    allCircles.forEach(circle => {
        circle.style.animation = "none";
        void circle.offsetWidth;
    });

    // перезапускаем
    startFirstCircles();
    setSafeTimeout(() => startSecondCircles(), 13000);
    setSafeTimeout(() => startThirdCircles(), 18000);
    setSafeTimeout(() => startFourthCircles(), 20000);
    setSafeTimeout(() => startFifthCircles(), 28000);
}

// 🔰 Запуск при первом открытии
restartAllCircles();

// 👀 Перезапуск при возврате на вкладку
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        restartAllCircles();
    }
});
