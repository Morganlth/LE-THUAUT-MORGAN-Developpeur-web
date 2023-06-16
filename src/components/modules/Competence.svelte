<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _height,
        _colors

        // #BINDS
        export let
        grabbing,
        mouseMove,
        drop

        export function scroll()
        {
            (async () => dieScroll())()

            const gap = main.scrollTop - offsetTop

            y = gap > 0 ? gap < height ? gap / height : 1 : 0
        }

    // #IMPORTS

        // #APP-CONTEXT
        import { app } from '../elements/Console.svelte'

        // #SVELTE
        import { onMount } from 'svelte'

        // #ELEMENTS
        import Die from '../elements/Die.svelte'
        import Satellite from '../elements/Satellite.svelte'

    // #CONSTANTES

    const
    colors = ['primary', 'secondary', 'light', 'indicator'],
    satellites =
    [
        {
            _color: _colors[colors[0]],
            _rotate: -50,
            _offset: 0
        }
,
        {
            _color: _colors[colors[1]],
            _rotate: 80,
            _offset: 4.71
        }
,
        {
            _color: _colors[colors[2]],
            _rotate: 40,
            _offset: 3.14
        }
,
        {
            _color: _colors[colors[3]],
            _rotate: -190,
            _offset: 1.57
        }
    ]

    // #VARIABLES

    let
    competence,
    main,
    offsetTop,
    height,
    pageY,
    maxX,
    maxY,
    initX,
    initY,
    number = 6,
    r,
    y

    let dieScroll

    // #REACTIVE

    $: scale = number / 6

    // #FUNCTIONS

    function set()
    {
        setCommand()

        main = document.querySelector('main')

        const
        die = competence.querySelector('.die'),
        scrollTop = main.scrollTop

        offsetTop = scrollTop + competence.getBoundingClientRect().top
        height = competence.offsetHeight

        maxX = window.innerWidth
        maxY = main.scrollHeight
        initX = maxX / 2
        initY = scrollTop + die.getBoundingClientRect().top + die.offsetHeight / 2

        r = maxX / 2
        y = 1 /* set satellites positions */
    }

    function setCommand()
    {
        const name = 'spaceDimension'
    
        app.add(name, (n) =>
        {
            n = app.testDefault(n) ? 6 : app.testNumber(n, 1, 6)

            number = n
            localStorage.setItem(name, n)
    
            app.success(name + ' ' + n)
        }, true)
    }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
id="competence"
style:height={_height}
bind:this={competence}
>
    <div>
        <p>CE DÉ NE SERT ABSOLUMENT A RIEN.</p>

        <Die
        _main={main}
        _pageY={pageY}
        _maxX={maxX}
        _maxY={maxY}
        _initX={initX}
        _initY={initY}
        _color={_colors.light}
        bind:grabbing={grabbing}
        bind:number={number}
        bind:scroll={dieScroll}
        bind:mouseMove={mouseMove}
        bind:drop={drop}
        />

        <div
        class="space"
        >
            <div
            style:transform="scale({scale})"
            >
                <div
                class="planet"
                >
                </div>

                {#each satellites as satellite}
                    <Satellite
                    {...satellite}
                    _r={r}
                    _y={y}
                    />
                {/each}
            </div>
        </div>
    </div>
</div>

<!-- #STYLE -->


<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/grid.scss',
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss';

    /* #GROUPS */

    #competence
    {
        @include flex;
        @include f-a-center;
        @include relative;

        z-index: 1;

        width: 100vw;

        &
        >div
        {
            @include f-center(true);
            @include f-column;
            @include any-w;
            @include glow;
        }

        p
        {
            @include text-info;

            background-color: $s-dark;

            margin-bottom: 50px;
            padding: 10px 20px;
        }

        .space
        {
            @include any-w;
    
            height: 400vh;
    
            &
            >div
            {
                @include f-center(true);
                @include sticky(true);
                @include any-w;
    
                transform-style: preserve-3d;
    
                height: 100vh;

                transition: transform 0.7s;
            }
        }

        .planet
        {
            @include glitch(true, (transparent 0%, $dark 70%));

            width: 100vh;
            height: 100vh;
    
            border-radius: 50%;

            box-shadow: 0 0 20px $s-light;
        }
    }
</style>