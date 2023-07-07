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
        import a from '../../assets/js/appManager'
        import e from '../../assets/js/eventManager'
        import r from '../../assets/js/routerManager'
        import s from '../../assets/js/springManager'
</script>

<script>
    // #EXPORTS

        // --PROPS
        export let
        _colors,
        _pageId

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

    const structures =
    [
        {
            e1: 200,
            e2: 100,
            unit: 'vw'
        },
        {
            e1: 900,
            e2: 200,
            unit: 'vh'
        }
    ]

    // #VARIABLES

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
            max = main.querySelector('div:nth-child(1)').offsetHeight - window.innerHeight * 1.4 // (140vh + 200vw) - 140vh = 200vw

            setRouter()
            setCommand()
            setEvent()
        }

        function setRouter()
        {
            router.main = main
        
            router.setPage(_pageId)
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
            setMainEvent()
            setRouterEvent()
            setSpringEvent()
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
            destroyMainEvent()
            destroyRouterEvent()
            destroySpringEvent()
        }

        function destroyMainEvent() { event.remove('scroll', scroll) }

        function destroyRouterEvent() { event.remove('scroll', router.router_scroll.bind(router)) }

        function destroySpringEvent()
        {
            event.remove('mouseMove', spring.spring_mouseMove.bind(spring))
            event.remove('mouseDown', spring.spring_mouseDown.bind(spring))
            event.remove('mouseUp', spring.spring_mouseUp.bind(spring))
        }

        // --EVENT
        async function scroll()
        {
            const scrollTop = main.scrollTop
            
            translateX = - (scrollTop < max ? scrollTop : max)
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
    style:height="calc(140vh + {structures[0].e1 + structures[0].e2 - 100 + structures[0].unit})"
    >
        <Wrapper
        _translateX={translateX}
        >
            <Home
            _width={structures[0].e1 + structures[0].unit}
            {_colors}
            />

            <Presentation
            _width={structures[0].e2 + structures[0].unit}
            {_colors}
            />
        </Wrapper>
    </div>

    <div
    style:height={structures[1].e1 + structures[1].e2 + structures[1].unit}
    >
        <Wrapper
        _background={_colors.dark}
        >
            <Competence
            _height={structures[1].e1 + structures[1].unit}
            {_colors}
            />

            <Project
            _height={structures[1].e2 + structures[1].unit}
            {_colors}
            />
        </Wrapper>
    </div>
</main>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    @use '../../assets/scss/styles/size.scss' as *;

    /* #GROUPS */

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
    }
</style>