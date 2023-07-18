// #WINDOW-MANAGER

class WindowManager
{
    // #VARIABLES

        // --CONTEXT-WINDOW
        window_LAST = +new Date()
        window_TIMEOUT
        window_RESIZE
        window_MOBILE

    // #CONSTRUCTOR

    constructor() { this.window_RESIZE = this.window_resize.bind(this) }

    // #FUNCTIONS

        // --SET
        window_set()
        {
            this.window_MOBILE = navigator.maxTouchPoints > 0

            window.addEventListener('resize', this.window_RESIZE)
        }

        // --DESTROY
        window_destroy() { try { window.removeEventListener('resize', this.window_RESIZE) } catch {} }

        // --EVENT
        window_resize()
        {
            const now = +new Date()

            clearTimeout(this.window_TIMEOUT)

            now > this.window_LAST + 2000
            ? (event.resize(this.window_testSmallScreen()), this.window_LAST = now)
            : this.window_TIMEOUT = setTimeout(event.resize.bind(null, this.window_testSmallScreen()), 100)
        }

        // --TEST
        window_testSmallScreen() { return window.innerWidth < 768 }
}

// #IMPORT

    // --CONTEXT
    import event from './eventManager'

// #EXPORT

    // --CONTEXT
    export default new WindowManager()