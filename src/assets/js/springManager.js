// #SPRING-MANAGER

export default class SpringManager
{
    // --VARIABLES
    lock = false
    timeout = null

    coords
    size

    // --CONSTRUCTOR
    constructor()
    {
        this.coords = spring({ x: -7, y: -7 }, { stiffness: 0.1, damping: 0.4 })
        this.size = spring(7)
    }

    // --EVENTS
    async spring_mouseMove(x, y) { this.coords.set({ x: x, y: y }) }

    async spring_mouseDown() { if (!this.lock) this.timeout = setTimeout(() => { this.size.set(150) }, 200) }

    async spring_mouseUp()
    {
        if (this.lock) return

        clearTimeout(this.timeout)

        this.size.set(7)
    }

    async spring_mouseEnter()
    {
        this.lock = true
        this.size.set(0)
    }

    async spring_mouseLeave()
    {
        this.lock = false
        this.size.set(7)
    }
}

// #IMPORT

import { spring } from 'svelte/motion'

// desactiver spring par command
// verifier les performances de l'appareil et desactiver spring et d'autres paramètres inutiles si performances faibles
// gros lag lors de mousedown dans la partie presentation