// #ROUTER-MANAGER

class RouterManager
{
    // --VARIABLES
    main
    last = +new Date()
    timeout = null
    
    pages = []

    // --SET
    setPage(id)
    {
        const page = this.pages[id]
    
        this.main.scrollTo({ top: page.start, behavior: 'instant' })

        if (page.call) page.call()
    }

    // --UPDATE
    updatePage()
    {
        const
        pages = this.pages,
        scrollTop = this.main.scrollTop

        for (let i = pages.length - 1; i >= 0; i--)
            if (pages[i].start <= scrollTop) return history.pushState({}, '', location.origin + '/' + pages[i].name + (pages[i].subPath ?? ''))
    }

    // --EVENT
    async router_scroll()
    {
        const now = +new Date()

        clearTimeout(this.timeout)

        if (now > this.last + 1000)
        {
            this.last = now

            this.updatePage.call(this)
        }
        else this.timeout = setTimeout(this.updatePage.bind(this), 1000)
    }

    // --UTILS
    add(id, name, start, call) { this.pages[id] = { name: name, start: start, call: call } }

    setSubPath(id, subPath) { this.pages[id].subPath = subPath ? '/' + subPath : undefined }
}

// #EXPORT

export default new RouterManager()