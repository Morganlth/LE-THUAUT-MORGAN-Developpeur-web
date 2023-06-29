// #SPRING-MANAGER

class SpringManager
{
    // --VARIABLES
    on = true
    lock = false
    hover = false
    timeout = null

    coords
    size

    // --CONSTRUCTOR
    constructor()
    {
        this.coords = spring({ x: -7, y: -7 }, { stiffness: 0.1, damping: 0.4 })
        this.size = spring(7)
    }

    // --SET
    setPosition(x, y) { this.coords.set({ x: x, y: y }) }

    // --EVENTS
    async spring_mouseMove(x, y) { if (!this.hover) this.coords.set({ x: x, y: y }) }

    async spring_mouseDown() { if (!this.lock) this.timeout = setTimeout(() => { this.size.set(150) }, 200) }

    async spring_mouseUp()
    {
        if (this.lock) return

        clearTimeout(this.timeout)

        this.size.set(7)
    }

    async spring_mouseEnter()
    {
        if (this.on)
        {
            this.lock = true
            this.size.set(0)
    
            // console.log('enter')
        }
    }

    async spring_mouseLeave()
    {
        if (this.on)
        {
            this.lock = false
            this.size.set(7)

            // console.log('leave')
        }
    }
}

// #IMPORT

import { spring } from 'svelte/motion'

// #EXPORT

export default new SpringManager()

// desactiver spring par command
// verifier les performances de l'appareil et desactiver spring et d'autres paramètres inutiles si performances faibles
// gros lag lors de mousedown dans la partie presentation