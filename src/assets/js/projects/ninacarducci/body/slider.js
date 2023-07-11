/*
? slider.js permet d'eviter les "mauvaises dimensions des images du slider grace aux tailles prédéfinit"
*/

//IMPORTS

import { windowEvent } from '../land/window.js'
import { map } from '../land/map.js'

//EXPORT

export const slider = {
    set: () =>
    {
        map.add(NAME, Array.from(document.querySelectorAll('.after-slider')))
    
        setVar()
        setEvent()
        updateSlider()

        slide.style.opacity = '1'
    }
}

//CONSTANTE

const NAME = 'slider'

//VARIABLES

let
slide,
items,
nav,
prev,
next

//FUNCTIONS

function setVar()
{
    slide = document.querySelector('.slider>div')
    items = [...slide.querySelectorAll('div')]
    nav = document.querySelector('.slider>nav')
    prev = slide.querySelector('.prev')
    next = slide.querySelector('.next')
}

function setEvent() { windowEvent.add(updateSlider) }

function updateSlider()
{
    const img = items.find(i => i.classList.contains('active')).firstElementChild, height = img.naturalHeight, width = img.naturalWidth

    resize(width)
    transformY(height)
    map.write(NAME, height)
}

function resize(width)
{
    items.forEach(i =>
    {
        const img = i.firstElementChild

        img.style.width = width + 'px'
        img.style.transform = `translateX(${(slide.offsetWidth - width)/2}px)`
    })
}

function transformY(height)
{
    const reduce = -slide.offsetHeight + height, full = `translateY(${reduce}px)`, demi = `translateY(${reduce/2}px)`

    nav.style.transform = full
    prev.style.transform = demi
    next.style.transform = demi
}