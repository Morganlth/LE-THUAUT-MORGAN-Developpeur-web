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

        // #MODULES
        import Home from '../modules/Home.svelte'
        import Presentation from '../modules/Presentation.svelte'
        import Competence from '../modules/Competence.svelte'
        import Project from '../modules/project.svelte'

        // #COVER
        import Wrapper from '../covers/Wrapper.svelte'

    // #CONSTANTES

    const
    structures = [{ e1: 2, e2: 1, unit: 'vw' }, { e1: 6, e2: 1, unit: 'vh' }],
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

    let grabbing

    // #FUNCTIONS

    function set()
    {
        max = main.querySelector('div:nth-child(1)').offsetHeight - window.innerHeight * 1.4 // (140vh + 200vw) - 140vh = 200vw

        // console.clear()
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
                mouseMoveFunc.forEach(func => (async () => func(e))())

                mouseFrame = false
            })

            mouseFrame = true
        }
    }

    function mouseUp()
    {
        mouseUpFunc.forEach(func => func())
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
on:mouseup={mouseUp}
on:mouseleave={mouseUp}
>
    <div
    style:height="calc(140vh + {(structures[0].e1 + structures[0].e2 - 1) * 100 + structures[0].unit})"
    >
        <Wrapper
        _translateX={translateX}
        _zIndex={1}
        >
            <Home
            _width={structures[0].e1 * 100 + structures[0].unit}
            {_colors}
            />

            <Presentation
            _lock={grabbing}
            _width={structures[0].e2 * 100 + structures[0].unit}
            {_colors}
            bind:scroll={scrollFunc[0]}
            bind:mouseMove={mouseMoveFunc[0]}
            />
        </Wrapper>
    </div>

    <div
    style:height={(structures[1].e1 + structures[1].e2) * 100 + structures[1].unit}
    >
        <Wrapper
        _background={_colors.dark}
        >
            <Competence
            _height={structures[1].e1 * 100 + structures[1].unit}
            {_colors}
            bind:grabbing={grabbing}
            bind:scroll={scrollFunc[1]}
            bind:mouseMove={mouseMoveFunc[1]}
            bind:drop={mouseUpFunc[0]}
            />

            <Project
            _height={structures[1].e2 * 100 + structures[1].unit}
            {_colors}
            bind:wheel={wheelFunc[0]}
            />
        </Wrapper>
    </div>
</main>

<!-- #STYLE -->

<style
lang="scss"
>
    @import '../../assets/scss/styles/size.scss';

    main
    {
        @include any;

        overflow-x: clip;
        overflow-y: scroll;

        scrollbar-width: none !important;
        &::-webkit-scrollbar
        {
            display: none !important;

            width: 0 !important;
        }
    }
</style>