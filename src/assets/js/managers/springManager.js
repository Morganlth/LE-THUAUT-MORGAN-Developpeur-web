// #SPRING-MANAGER

class SpringManager
{
    // --VARIABLES
    on = false
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
    spring_set() { app.add('spring', this.spring_command.bind(this), true) }

    spring_setPosition(x, y) { this.coords.set({ x: x, y: y }) }

    spring_setEvent()
    {
        for (const EVENT_NAME of ['mouseMove', 'mouseDown', 'mouseUp'])
        {
            const
            FUNC = this['spring_' + EVENT_NAME].bind(this),
            INDEX = event.contain(EVENT_NAME, FUNC.name)

            if (INDEX === -1) event.add(EVENT_NAME, FUNC)
        }
    }

    // --UPDATES
    spring_update(on)
    {
        if (this.on !== on)
        {
            on ? (this.spring_setEvent(), app.eco(false)) : this.spring_destroy()

            this.on = on
            this.size.set(on ? 7 : 0)
        }
    }

    // --DESTROY
    spring_destroy()
    {
        event.remove('mouseMove', this.spring_mouseMove.bind(this))
        event.remove('mouseDown', this.spring_mouseDown.bind(this))
        event.remove('mouseUp', this.spring_mouseUp.bind(this))
    }

    // --COMMAND
    spring_command(on)
    {
        if (wwindow.window_testMobile()) return

        on = app.testDefault(on) ? true : app.testBoolean(on)

        this.spring_update(on)

        localStorage.setItem('spring', on)

        app.success('Spring ' + on)
    }

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

    // --CONTEXTS
    import app from './appManager'
    import event from './eventManager'
    import wwindow from './windowManager'

    // --SVELTE
    import { spring } from 'svelte/motion'

// #EXPORT

export default new SpringManager()

// desactiver spring par command
// verifier les performances de l'appareil et desactiver spring et d'autres paramètres inutiles si performances faibles
// gros lag lors de mousedown dans la partie presentation