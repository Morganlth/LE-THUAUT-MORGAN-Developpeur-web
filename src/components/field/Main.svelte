<!-- #SCRIPT -->

<script
context="module"
>
    // #EXPORTS

        // --MODULES
        export const
        app = a,
        event = e,
        router = r,
        spring = s

    // #IMPORTS

        // --CONTEXTS
        import a from '../../assets/js/managers/appManager'
        import e from '../../assets/js/managers/eventManager'
        import r from '../../assets/js/managers/routerManager'
        import s from '../../assets/js/managers/springManager'
</script>

<script>
    // #EXPORTS

        // --PROPS
        export let
        _colors,
        _page

    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/main.scss'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

        // --COMPONENT-MODULES
        import Home from '../modules/Home.svelte'
        import Presentation from '../modules/Presentation.svelte'
        import Competence from '../modules/Competence.svelte'
        import Project from '../modules/project.svelte'

        // --COMPONENT-COVER
        import Wrapper from '../covers/Wrapper.svelte'

    // #CONSTANTE

    const structures = ['300vw', '1100vh']

    // #VARIABLES

        // --ELEMENT-WINDOW
        let
        window_LAST = +new Date(),
        window_TIMEOUT

        // --ELEMENT-MAIN
        let
        main,
        freeze = app.freeze

        // --ELEMENT-WRAPPER-1
        let
        max,
        translateX = 0
    
    // #FUNCTIONS

        // --SET
        function set()
        {
            setWrapper()
            setRouter()
            setCommand()
            setEvent()
        }

        function setWrapper() { max = main.querySelector('div:nth-child(1)').offsetHeight - window.innerHeight * 1.4 } // (140vh + 200vw) - 140vh = 200vw | => height of main>div:nth-child(1)

        function setRouter()
        {
            router.main = main
        
            router.setPage(_page.id)
        }

        function setCommand()
        {
            app.add('app', () => console.log(app))
            app.add('event', () => console.log(event))
            app.add('router', () => console.log(router))

            app.add('spring', updateSpring, true)
        }

        function setEvent()
        {
            setWindowEvent()
            setMainEvent()
            setRouterEvent()
            setSpringEvent()
        }

        function setWindowEvent()
        {
            window.addEventListener('resize', resize)

            event.add('resize', setWrapper)
        }

        function setMainEvent() { event.add('scroll', scroll) }

        function setRouterEvent() { event.add('scroll', router.router_scroll.bind(router) )}

        function setSpringEvent()
        {
            event.add('mouseMove', spring.spring_mouseMove.bind(spring))
            event.add('mouseDown', spring.spring_mouseDown.bind(spring))
            event.add('mouseUp', spring.spring_mouseUp.bind(spring))
        }

        // --UPDATE
        function updateSpring(on)
        {
            on = app.testDefault(on) ? true : app.testBoolean(on)
    
            destroySpringEvent()
    
            if (on)
            {
                setSpringEvent()
    
                app.eco(false)
            }

            spring.on = on
            spring.size.set(on ? 7 : 0) 
            localStorage.setItem('spring', on)

            app.success('Spring ' + on)
        }

        // --DESTROY
        function destroy()
        {
            destroyWindowEvent()
            destroyMainEvent()
            destroyRouterEvent()
            destroySpringEvent()
        }

        function destroyWindowEvent()
        {
            event.remove('resize', setWrapper)
    
            try { window.removeEventListener('resize', resize) } catch {}
        }

        function destroyMainEvent() { event.remove('scroll', scroll) }

        function destroyRouterEvent() { event.remove('scroll', router.router_scroll.bind(router)) }

        function destroySpringEvent()
        {
            event.remove('mouseMove', spring.spring_mouseMove.bind(spring))
            event.remove('mouseDown', spring.spring_mouseDown.bind(spring))
            event.remove('mouseUp', spring.spring_mouseUp.bind(spring))
        }

        // --EVENTS
        async function scroll()
        {
            if (window.innerWidth >= 768)
            {
                const scrollTop = main.scrollTop
            
                translateX = - (scrollTop < max ? scrollTop : max)
            }
            else translateX = 0
        }

        async function resize()
        {
            const now = +new Date()

            clearTimeout(window_TIMEOUT)

            now > window_LAST + 2000
            ? (event.resize(), window_LAST = now)
            : window_TIMEOUT = setTimeout(event.resize.bind(event), 100)
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main
bind:this={main}
on:scroll={event.scroll.bind(event)}
on:wheel={event.wheel.bind(event)}
on:mousemove={event.mouseMove.bind(event)}
on:mousedown={event.mouseDown.bind(event)}
on:mouseup={event.mouseUp.bind(event)}
on:mouseleave={event.mouseUp.bind(event)}
class:freeze={$freeze}
>
    <div
    style:--desktop-version="calc(140vh - 100vw + {structures[0]})"
    >
        <Wrapper
        _translateX={translateX}
        >
            <Home
            {_colors}
            />

            <Presentation
            {_colors}
            />
        </Wrapper>
    </div>

    <div
    style:height={structures[1]}
    >
        <Wrapper
        _background={_colors.dark}
        >
            <Competence
            {_colors}
            />

            <Project
            _subPath={_page.subPath}
            {_colors}
            />
        </Wrapper>
    </div>
</main>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #MAIN */

    main
    {
        @include any;

        overflow: clip scroll;

        &.freeze { overflow-y: hidden; }

        scrollbar-width: none !important;
        &::-webkit-scrollbar
        {
            display: none !important;

            width: 0 !important;
        }

        &>div { @include any-w; }
        &>div:nth-child(1)
        {
            height: calc(200vh + 280px);

            @include media-min(768px) { height: var(--desktop-version); }
        }
    }
</style>