//IMPORTS

import { map } from './map.js'

//EXPORT

export const windowEvent =
{
    set: () => { window.addEventListener('resize', debounce()) }
,
    add: callBack => STACK.push(callBack)
}

//CONSTANTES

const STACK = []

//FUNCTIONS

function debounce()
{
    let timer

    return () =>
    {
        clearTimeout(timer)
        timer = setTimeout(() =>
        {
            STACK.forEach(s => s())

            map.reader()
        }, 150)
    }
}