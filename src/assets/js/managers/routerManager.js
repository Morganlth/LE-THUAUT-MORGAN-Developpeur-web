// #ROUTER-MANAGER

class RouterManager
{
    // #VARIABLES

        // --ELEMENT-MAIN
        main

        // --CONTEXT-ROUTER
        router_LAST = +new Date()
        router_TIMEOUT = null
        router_PAGES = []

    // #FUNCTIONS

        // --SET
        router_set(main, id)
        {
            this.main = main
        
            this.router_setPage(id)

            this.router_setEvent()
        }

        router_setEvent() { event.add('scroll', this.router_scroll.bind(this) )}

        router_setPage(id)
        {
            const page = this.router_PAGES[id]
        
            this.main.scrollTo({ top: page.start, behavior: 'instant' })

            if (page.call) page.call()
        }

        router_setSubPath(id, subPath) { this.router_PAGES[id].subPath = subPath ? '/' + subPath : undefined }

        // --UPDATE
        router_update()
        {
            const
            pages = this.router_PAGES,
            scrollTop = this.main.scrollTop

            for (let i = pages.length - 1; i >= 0; i--)
                if (pages[i].start <= scrollTop) return history.pushState({}, '', location.origin + '/' + pages[i].name + (pages[i].subPath ?? ''))
        }

        // --DESTROY
        router_destroy() { event.remove('scroll', this.router_scroll.bind(this)) }

        // --EVENT
        async router_scroll()
        {
            const now = +new Date()

            clearTimeout(this.router_TIMEOUT)

            if (now > this.router_LAST + 1000)
            {
                this.router_LAST = now

                this.router_update.call(this)
            }
            else this.router_TIMEOUT = setTimeout(this.router_update.bind(this), 1000)
        }

        // --UTIL
        router_add(id, name, start, call) { this.router_PAGES[id] = { name: name, start: start, call: call } }
}

// #IMPORT

    // --CONTEXT
    import event from './eventManager'

// #EXPORT

    // --CONTEXT
    export default new RouterManager()