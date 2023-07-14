// #EVENT-MANAGER

class EventManager
{
    // --VARIABLES
    scrollTop = 0

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

    grabbing = false

    // --EVENTS
    scroll({target})
    {
        if (this.scrollFrame) return

        this.scrollFrame = requestAnimationFrame(() =>
        {
            this.scrollTop = target.scrollTop

            this.run.call(this.manager.scroll)

            this.scrollFrame = false
        })
    }

    wheel({deltaY, currentTarget}) { this.run.call(this.manager.wheel, deltaY, currentTarget) }

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

    resize(mobile) { this.run.call(this.manager.resize, mobile) }

    // --UTILS
    add(category, func) { this.manager[category].push(func) }

    remove(category, func)
    {
        const index = this.contain(category, func.name)

        if (index !== -1) this.manager[category].splice(index, 1)
    }

    contain(category, name)
    {
        const array = this.manager[category]

        for (let i = 0; i < array.length; i++)
            if (name === array[i].name) return i

        return -1
    }

    run() { for (const func of this) func(...arguments) }
}

// #EXPORT

export default new EventManager()
