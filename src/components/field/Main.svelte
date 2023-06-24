<!-- #SCRIPT -->

<script
context="module"
>
    // #EXPORTS

        // #MODULES
        export const
        app = a,
        event = e,
        spring = s

    // --IMPORTS

        // #CONTEXTS
        import a from '../../assets/js/appManager'
        import e from '../../assets/js/eventManager'
        import s from '../../assets/js/springManager'
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

    const structures =
    [
        {
            e1: 200,
            e2: 100,
            unit: 'vw'
        },
        {
            e1: 600,
            e2: 200,
            unit: 'vh'
        }
    ]

    // #VARIABLES

        // --THIS
        let main

        // --ELEMENT-WRAPPER-1
        let
        max,
        translateX = 0

        // --ELEMENT-SPRING
        let
        coords = spring.coords,
        size = spring.size
    
    // #FUNCTIONS

        // --SET
        function set()
        {
            max = main.querySelector('div:nth-child(1)').offsetHeight - window.innerHeight * 1.4 // (140vh + 200vw) - 140vh = 200vw

            setCommand()
            setEvent()
            setPage()
        }

        function setCommand()
        {
            app.add('app', () => console.log(app))
            app.add('event', () => console.log(event))

            app.add('spring', updateSpring, true)
        }

        function setEvent()
        {
            event.add('scroll', scroll)
    
            setSpringEvent()
        }

        function setSpringEvent()
        {
            event.add('mouseMove', spring.spring_mouseMove.bind(spring))
            event.add('mouseDown', spring.spring_mouseDown.bind(spring))
            event.add('mouseUp', spring.spring_mouseUp.bind(spring))
        }

        function setPage()
        {
            if (_page !== -1)
            {
                const 
                element = document.getElementById(['presentation', 'competence', 'project'][_page]),
                parent = element.parentNode,
                offsetTop = parent.offsetTop + element.offsetTop + (_page ? window.innerHeight : 0), /* competence & projet demande un peux plus de profondeur */
                offsetLeft = parent.offsetLeft + element.offsetLeft

                main.scrollTo({ top: offsetTop + offsetLeft, behavior: 'instant' })

                sideEffects()
            }
        }

        // --UPDATE
        function updateSpring(on)
        {
            on = app.testDefault(on) ? true : app.testBoolean(on)
    
            destroySpringEvent()
    
            if (on) { setSpringEvent() }

            spring.on = on
            spring.size.set(on ? 7 : 0) 
            localStorage.setItem('spring', on)

            app.success('Spring ' + on)
        }

        // --DESTROY
        function destroy()
        {
            event.remove('scroll', scroll)
    
            destroySpringEvent()
        }

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

        // --CODE-PAGE
        function sideEffects()
        {
            switch (_page)
            {
                case 0:
                    setTimeout(event.scroll.bind(event), 100) /* appel de scroll pour set les positions dans le snake */
                    break
                case 2:
                    event.wheel({ deltaY: true, currentTarget: main }) /* event artificiel */
                    break
                default:
                    break
            }
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<main
bind:this={main}
on:scroll={event.scroll.bind(event)}
on:wheel={event.wheel.bind(event)}
on:mousemove={event.mouseMove.bind(event)}
on:mousedown={event.mouseDown.bind(event)}
on:mouseup={event.mouseUp.bind(event)}
on:mouseleave={event.mouseUp.bind(event)}
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

    <svg
    class="spring"
    >
	    <circle
        cx={$coords.x}
        cy={$coords.y}
        r={$size < 0 ? 0 : $size}
        />
    </svg>
</main>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #GROUPS */

    main
    {
        @include any;

        overflow-x: clip;
        overflow-y: scroll;

        .spring
        {
            @include xy-start(true);
            @include any;
            @include no-event;

            mix-blend-mode: difference;

            circle { fill: $light; }
	    }

        scrollbar-width: none !important;
        &::-webkit-scrollbar
        {
            display: none !important;

            width: 0 !important;
        }
    }
</style>