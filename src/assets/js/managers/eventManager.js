// #EVENT-MANAGER

class EventManager
{
    // #VARIABLES

        // --EVENT-CONTEXT
        manager =
        {
            scroll: [],
            wheel: [],
            mouseMove: [],
            mouseDown: [],
            mouseUp: [],
            resize: []
        }
        scrollFrame = false
        mouseFrame = false
        grabbing

        // --ELEMENT-MAIN
        main_scrollTop

    // #CONSTRUCTOR

    constructor() { this.grabbing = writable(false) }

    // #FUNCTIONS

        // --EVENTS
        scroll({target})
        {
            if (this.scrollFrame) return

            this.scrollFrame = requestAnimationFrame(() =>
            {
                this.main_scrollTop = target.scrollTop

                this.run.call(this.manager.scroll)

                this.scrollFrame = false
            })
        }

        wheel({deltaY}) { this.run.call(this.manager.wheel, deltaY) }

        mouseMove({clientX, clientY})
        {
            if (this.mouseFrame) return

            this.mouseFrame = requestAnimationFrame(() =>
            {
                this.run.call(this.manager.mouseMove, clientX, clientY)

                this.mouseFrame = false
            })
        }

        mouseDown(e) { this.run.call(this.manager.mouseDown, e) }

        mouseUp() { this.run.call(this.manager.mouseUp) }

        resize(smallScreen) { this.run.call(this.manager.resize, smallScreen) }

        // --UTILS
        add(category, func) { this.manager[category].push(func) }

        addSeveral(events)
        {
            for (const KEY in events)
                if (this.contain(KEY, events[KEY].name) === -1) this.add(KEY, events[KEY])
        }

        remove(category, func)
        {
            const INDEX = this.contain(category, func.name)

            if (INDEX !== -1) this.manager[category].splice(INDEX, 1)
        }

        contain(category, name)
        {
            const EVENT_CONTAINER = this.manager[category]

            for (let i = 0; i < EVENT_CONTAINER.length; i++)
                if (name === EVENT_CONTAINER[i].name) return i

            return -1
        }

        run() { for (const func of this) func(...arguments) }
}

// #IMPORT

    // --SVELTE
    import { writable } from "svelte/store"

// #EXPORT

    // --CONTEXT
    export default new EventManager()
