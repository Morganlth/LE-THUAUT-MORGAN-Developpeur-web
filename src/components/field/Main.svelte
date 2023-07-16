<!-- #SCRIPT -->

<script
context="module"
>
    // #EXPORTS

        // --MODULES
        export const
        app = a,
        event = e,
        wwindow = w,
        router = r,
        spring = s

    // #IMPORTS

        // --CONTEXTS
        import a from '../../assets/js/managers/appManager'
        import e from '../../assets/js/managers/eventManager'
        import w from '../../assets/js/managers/windowManager'
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

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

        // --COMPONENT-MODULES
        import Home from '../modules/Home.svelte'
        import Presentation from '../modules/Presentation.svelte'
        import Competence from '../modules/Competence.svelte'
        import Project from '../modules/project.svelte'

    // #VARIABLES

        // --ELEMENT-MAIN
        let
        main,
        main_FREEZE = app.app_FREEZE

        // --ELEMENT-WRAPPER-1
        let
        wrapper_MAX,
        wrapper_TRANSLATEX = 0
    
    // #FUNCTIONS

        // --SET
        function main_set()
        {
            wwindow.window_set()
            router.router_set(main, _page.id)
            spring.spring_set()

            main_setWrapper()
            main_setCommand()
            main_setEvent()
        }

        function main_setWrapper() { wrapper_MAX = main.querySelector('div:nth-child(1)').offsetHeight - window.innerHeight * 1.4 }
    
        function main_setCommand()
        {
            app.app_add('app', () => console.log(app))
            app.app_add('event', () => console.log(event))
            app.app_add('router', () => console.log(router))
        }

        function main_setEvent()
        {
            event.add('resize', main_resize)

            if (!wwindow.window_testMobile()) main_setEventDesktop()
        }

        function main_setEventDesktop() { event.add('scroll', main_scroll) }

        // --DESTROY
        function main_destroy()
        {
            main_destroyEvent()

            wwindow.window_destroy()
            router.router_destroy()
            spring.spring_destroy()
        }

        function main_destroyEvent()
        {
            event.remove('resize', main_resize)

            main_destroyEventDesktop()
        }

        function main_destroyEventDesktop() { event.remove('scroll', main_scroll) }

        // --EVENTS
        async function main_scroll()
        {
            const SCROLLTOP = main.scrollTop
        
            wrapper_TRANSLATEX = -(SCROLLTOP < wrapper_MAX ? SCROLLTOP : wrapper_MAX)
        }

        async function main_resize(mobile)
        {
            if (localStorage.getItem('spring') == 'true') spring.spring_update(!mobile)

            if (mobile) main_destroyEventDesktop(), wrapper_TRANSLATEX = 0
            else
            {
                if (event.contain('scroll', main_scroll.name) === -1) main_setEventDesktop()

                main_setWrapper()
            }
        }

    // #CYCLES

    onMount(main_set)
    onDestroy(main_destroy)
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
class:freeze={$main_FREEZE}
>
    <div>
        <div
        class="wrapper"
        style:transform="translateX({wrapper_TRANSLATEX}px)"
        >
            <Home
            {_colors}
            />

            <Presentation
            {_colors}
            />
        </div>
    </div>

    <div>
        <Competence
        {_colors}
        />

        <Project
        _subPath={_page.subPath}
        {_colors}
        />
    </div>
</main>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #MAIN */

    main
    {
        @include any;

        will-change: scroll-position;

        overflow: clip scroll;

        &.freeze { overflow-y: hidden; }

        scrollbar-width: none !important;
        &::-webkit-scrollbar
        {
            display: none !important;

            width: 0 !important;
        }

        &>div
        {
            @include any-w;

            &:nth-child(1)
            {
                height: 200vh;

                @include media-min(768px) { height: calc(140vh + 200vw); }
            }
            &:nth-child(2) { height: 1100vh; }
        }

        .wrapper
        {
            @include flex;
            @include any;

            flex-wrap: wrap;

            @include media-min(768px)
            {
                @include sticky;

                width: 300vw;
                height: 100vh;
            }
        }
    }
</style>