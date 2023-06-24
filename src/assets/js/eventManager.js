// #EVENT-MANAGER

class EventManager
{
    // --VARIABLES
    manager =
    {
        scroll: [],
        wheel: [],
        mouseMove: [],
        mouseDown: [],
        mouseUp: []
    }

    scrollFrame = false
    mouseFrame = false

    grabbing = false

    // --EVENTS
    scroll()
    {
        if (this.scrollFrame) return

        this.scrollFrame = requestAnimationFrame(() =>
        {
            this.run.call(this.manager.scroll)

            this.scrollFrame = false
        })
    }

    wheel(e) { this.run.call(this.manager.wheel, e.currentTarget, e.deltaY) }

    mouseMove(e)
    {
        if (this.mouseFrame) return

        this.mouseFrame = requestAnimationFrame(() =>
        {
            this.run.call(this.manager.mouseMove, e.clientX, e.clientY)

            this.mouseFrame = false
        })
    }

    mouseDown(e) { this.run.call(this.manager.mouseDown, e) }

    mouseUp() { this.run.call(this.manager.mouseUp) }

    // --CODE
    add(category, func)
    {
        this.manager[category].push(func)
    }

    remove(category, func)
    {
        const
        name = func.name,
        array = this.manager[category]

        for (let i = 0; i < array.length; i++)
            if (name === array[i].name) { array.splice(i, 1); break }
    }

    run() { for (const func of this) func(...arguments) }
}

// #EXPORT

export default new EventManager()
