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
            this.window_MOBILE = this.window_testMobile()

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
            ? this.window_call(now)
            : this.window_TIMEOUT = setTimeout(this.window_call.bind(this), 100)
        }

        // --TESTS
        window_testMobile() { return navigator.maxTouchPoints > 0 }

        window_testSmallScreen() { return window.innerWidth < 768 }

        // --UTIL
        window_call(now)
        {
            this.window_LAST = now ?? +new Date()
            this.window_MOBILE = this.window_testMobile()

            const SMALLSCREEN = this.window_testSmallScreen()

            event.event_resize(SMALLSCREEN)
        }
}

// #IMPORT

    // --CONTEXT
    import event from './eventManager'

// #EXPORT

    // --CONTEXT
    export default new WindowManager()