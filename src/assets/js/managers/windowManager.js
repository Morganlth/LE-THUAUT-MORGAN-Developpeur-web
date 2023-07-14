// #WINDOW-MANAGER

class WindowManager
{
    // #VARIABLES

        // --CONTEXT-WINDOW
        window_LAST = +new Date()
        window_TIMEOUT
        window_RESIZE

    // #CONSTRUCTOR

    constructor() { this.window_RESIZE = this.window_resize.bind(this) }

    // #FUNCTIONS

        // --SET
        window_set() { window.addEventListener('resize', this.window_RESIZE) }

        // --DESTROY
        window_destroy() { try { window.removeEventListener('resize', this.window_RESIZE) } catch {} }

        // --EVENT
        window_resize()
        {
            const now = +new Date()

            clearTimeout(this.window_TIMEOUT)

            now > this.window_LAST + 2000
            ? (event.resize(this.window_testMobile()), this.window_LAST = now)
            : this.window_TIMEOUT = setTimeout(() => event.resize(this.window_testMobile()), 100)
        }

        // --TEST
        window_testMobile() { return window.innerWidth < 768 }
}

// #IMPORT

    // --CONTEXT
    import event from './eventManager'

// #EXPORT

    // --CONTEXT
    export default new WindowManager()