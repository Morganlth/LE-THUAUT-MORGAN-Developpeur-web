// #EVENT-MANAGER

class EventManager
{
    // #VARIABLES

        // --EVENT-CONTEXT
        event_MANAGER =
        {
            scroll: [],
            wheel: [],
            mouseMove: [],
            mouseDown: [],
            mouseUp: [],
            resize: [],
            touchMove: []
        }
        event_SCROLLFRAME
        event_MOUSEFRAME
        event_TOUCHFRAME
        event_GRABBING

        // --ELEMENT-MAIN
        main
        main_scrollTop

    // #CONSTRUCTOR

    constructor() { this.event_GRABBING = writable(false) }

    // #FUNCTIONS

        // --SET
        event_set(main) { this.main = main }

        // --EVENTS
        event_scroll({target})
        {
            if (this.event_SCROLLFRAME) return

            this.event_SCROLLFRAME = requestAnimationFrame(() =>
            {
                this.main_scrollTop = target.scrollTop

                this.event_run.call(this.event_MANAGER.scroll)

                this.event_SCROLLFRAME = false
            })
        }

        event_wheel({deltaY}) { this.event_run.call(this.event_MANAGER.wheel, deltaY) }

        event_mouseMove({clientX, clientY})
        {
            if (this.event_MOUSEFRAME) return

            this.event_MOUSEFRAME = requestAnimationFrame(() =>
            {
                this.event_run.call(this.event_MANAGER.mouseMove, clientX, clientY)

                this.event_MOUSEFRAME = false
            })
        }

        event_mouseDown(e) { this.event_run.call(this.event_MANAGER.mouseDown, e) }

        event_mouseUp() { this.event_run.call(this.event_MANAGER.mouseUp) }

        event_resize(smallScreen) { this.event_run.call(this.event_MANAGER.resize, smallScreen) }

        event_touchMove(e)
        {
            if (this.event_TOUCHFRAME) return

            this.event_TOUCHFRAME = requestAnimationFrame(() =>
            {
                const TOUCH = e.changedTouches[0]
    
                this.event_run.call(this.event_MANAGER.touchMove, ...[TOUCH.clientX, TOUCH.clientY])

                this.event_TOUCHFRAME = false
            })
        }

        // --UTILS
        event_add(category, func) { this.event_MANAGER[category].push(func) }

        event_addSeveral(events)
        {
            for (const KEY in events)
                if (this.event_contain(KEY, events[KEY].name) === -1) this.event_add(KEY, events[KEY])
        }

        event_remove(category, func)
        {
            const INDEX = this.event_contain(category, func.name)

            if (INDEX !== -1) this.event_MANAGER[category].splice(INDEX, 1)
        }

        event_contain(category, name)
        {
            const EVENT_CONTAINER = this.event_MANAGER[category]

            for (let i = 0; i < EVENT_CONTAINER.length; i++)
                if (name === EVENT_CONTAINER[i].name) return i

            return -1
        }

        event_run() { for (const func of this) func(...arguments) }

        event_scrollTo(top) { this.main.scrollTo({ top: top, behavior: 'instant' }) }
}

// #IMPORT

    // --SVELTE
    import { writable } from "svelte/store"

// #EXPORT

    // --CONTEXT
    export default new EventManager()
