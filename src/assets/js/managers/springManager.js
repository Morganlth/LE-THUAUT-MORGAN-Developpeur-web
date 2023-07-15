// #SPRING-MANAGER

class SpringManager
{
    // --VARIABLES

        // --SPRING-CONTEXT
        spring_ON = false
        spring_LOCK = false
        spring_HOVER = false
        spring_TIMEOUT = null
        spring_COORDS
        spring_SIZE

    // --CONSTRUCTOR
    constructor()
    {
        this.spring_COORDS = spring({ x: -7, y: -7 }, { stiffness: 0.1, damping: 0.4 })
        this.spring_SIZE = spring(7)
    }

    // --SET
    spring_set() { app.app_add('spring', this.spring_command.bind(this), true) }

    spring_setPosition(x, y) { this.spring_COORDS.set({ x: x, y: y }) }

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
        if (this.spring_ON !== on)
        {
            on ? (this.spring_setEvent(), app.app_updateMode(false)) : this.spring_destroy()

            this.spring_ON = on
            this.spring_SIZE.set(on ? 7 : 0)
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

        on = app.app_testDefault(on) ? true : app.app_testBoolean(on)

        this.spring_update(on)

        localStorage.setItem('spring', on)

        app.app_success('Spring ' + on)
    }

    // --EVENTS
    async spring_mouseMove(x, y) { if (!this.spring_HOVER) this.spring_COORDS.set({ x: x, y: y }) }

    async spring_mouseDown() { if (!this.spring_LOCK) this.spring_TIMEOUT = setTimeout(() => { this.spring_SIZE.set(150) }, 200) }

    async spring_mouseUp()
    {
        if (this.spring_LOCK) return

        clearTimeout(this.spring_TIMEOUT)

        this.spring_SIZE.set(7)
    }

    async spring_mouseEnter()
    {
        if (this.spring_ON)
        {
            this.spring_LOCK = true
            this.spring_SIZE.set(0)
        }
    }

    async spring_mouseLeave()
    {
        if (this.spring_ON)
        {
            this.spring_LOCK = false
            this.spring_SIZE.set(7)
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