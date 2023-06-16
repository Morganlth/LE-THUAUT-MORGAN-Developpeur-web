<!-- #SCRIPT -->

<script>
    // #EXPORT

        // #PROP
        export let _colors

    // #IMPORTS

        // #SCSS
        import '../../assets/scss/components/main.scss'

        // #SVELTE
        import { onMount } from 'svelte'
        import { spring } from 'svelte/motion'

        // #MODULES
        import Home from '../modules/Home.svelte'
        import Presentation from '../modules/Presentation.svelte'
        import Competence from '../modules/Competence.svelte'
        import Project from '../modules/project.svelte'

        // #COVER
        import Wrapper from '../covers/Wrapper.svelte'

    // #CONSTANTES

    const
    structures =
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
    ],
    scrollFunc = [],
    wheelFunc = [],
    mouseMoveFunc = [],
    mouseUpFunc = []

    // #VARIABLES

    let
    main,
    scrollFrame = false,
    mouseFrame = false

    let
    max,
    translateX = 0

    let
    coords = spring({ x: -7, y: -7 }, { stiffness: 0.1, damping: 0.4 }),
    size = spring(7),
    up = false

    let grabbing

    // #FUNCTIONS

    function set()
    {
        max = main.querySelector('div:nth-child(1)').offsetHeight - window.innerHeight * 1.4 // (140vh + 200vw) - 140vh = 200vw
    }

    function scroll()
    {
        if (!scrollFrame)
        {
            requestAnimationFrame(() =>
            {
                const scrollTop = main.scrollTop
    
                translateX = - (scrollTop < max ? scrollTop : max)

                scrollFunc.forEach(func => (async () => func())())

                scrollFrame = false
            })

            scrollFrame = true
        }
    }

    function wheel(e)
    {
        wheelFunc.forEach(func => (async () => func(e))())
    }

    function mouseMove(e)
    {
        if (!mouseFrame)
        {
            requestAnimationFrame(() =>
            {
                const
                x = e.clientX,
                y = e.clientY
        
                mouseMoveFunc.forEach(func => (async () => func(x, y))())

                coords.set({ x: x, y: y })

                mouseFrame = false
            })

            mouseFrame = true
        }
    }

    function mouseDown()
    {
        up = false

        setTimeout(() => { if (!up) size.set(150)}, 200)
    }

    function mouseUp()
    {
        up = true

        mouseUpFunc.forEach(func => func())

        size.set(7)
    }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<main
bind:this={main}
on:scroll={scroll}
on:wheel={wheel}
on:mousemove={mouseMove}
on:mousedown={mouseDown}
on:mouseup={mouseUp}
on:mouseleave={mouseUp}
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
            _lock={grabbing}
            _width={structures[0].e2 + structures[0].unit}
            _springSize={size}
            {_colors}
            bind:scroll={scrollFunc[0]}
            bind:mouseMove={mouseMoveFunc[0]}
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
            bind:grabbing={grabbing}
            bind:scroll={scrollFunc[1]}
            bind:mouseMove={mouseMoveFunc[1]}
            bind:drop={mouseUpFunc[0]}
            />

            <Project
            _height={structures[1].e2 + structures[1].unit}
            {_colors}
            bind:wheel={wheelFunc[0]}
            />
        </Wrapper>
    </div>

    <svg>
	    <circle
        cx={$coords.x}
        cy={$coords.y}
        r={$size}
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

        svg
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