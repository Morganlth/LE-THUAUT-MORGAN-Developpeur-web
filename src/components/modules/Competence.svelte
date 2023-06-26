<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _height,
        _colors

    // #IMPORTS

        // --CONTEXTS
        import { app, router } from '../field/Main.svelte'
        import { event } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

        // --COMPONENT-ELEMENTS
        import Die from '../elements/Die.svelte'
        import Moon from '../elements/Moon.svelte'
        import Satellite from '../elements/Satellite.svelte'
        import Montain from '../elements/Montain.svelte'
        import Forest from '../elements/Forest.svelte'

    // #CONSTANTES

        // --TO-ITERATE
        const satellites =
        [
            {
                _rotate: -50,
                _offset: 1.57
            }
        ,
            {
                _rotate: 80,
                _offset: 4.71
            }
        ,
            {
                _rotate: 40,
                _offset: 3.14
            }
        ,
            {
                _rotate: 10,
                _offset: 0
            }
        ]

    // #VARIABLES

        // --ELEMENT-MAIN
        let main

        // --ELEMENT-COMPETENCE
        let
        competence,
        offsetTop,
        height

        // --ELEMENT-DIE
        let
        pageY,
        maxX,
        maxY,
        initX,
        initY,
        number = 6

        // --ELEMENT-SPACE
        let ratio = 1

        // --ELEMENT-SATELLITE
        let
        r,
        y

        // --ELEMENT-CONTAINER
        let
        container,
        containerOffsetTop

    // #REACTIVE

    $: scale = number / 6 * ratio

    // #FUNCTIONS

        // --SET
        function set()
        {
            setMain()
            setCompetence()
            setDie()
            setSatellite()
            setContainer()
            setCommand()
            setEvent()
            setRouter()
        }

        function setMain() { main = document.querySelector('main') }

        function setCompetence()
        {
            const innerHeight = window.innerHeight

            offsetTop = main.scrollTop + competence.getBoundingClientRect().top - innerHeight
            height = competence.offsetHeight + innerHeight
        }

        function setDie()
        {
            const die = competence.querySelector('.die')

            maxX = window.innerWidth
            maxY = main.scrollHeight
            initX = maxX / 2
            initY = main.scrollTop + die.getBoundingClientRect().top + die.offsetHeight / 2
        }

        function setSatellite()
        {
            r = maxX / 2
            y = 1 /* set satellites positions */
        }

        function setContainer() { containerOffsetTop = container.offsetTop }

        function setCommand() { app.add('spaceDimension', spaceDimension, true) }

        function setEvent() { event.add('scroll', competence_scroll) }

        function setRouter()
        {
            const start = competence.parentNode.offsetTop
    
            router.add(2, 'competence', start)
        }

        // --DESTROY
        function destroy() { event.remove('scroll', competence_scroll) }

        // --COMMAND
        function spaceDimension(n)
        {
            n = app.testDefault(n) ? 6 : app.testNumber(n, 1, 6)

            number = n
            localStorage.setItem('spaceDimension', n)
    
            app.success('spaceDimension ' + n)
        }

        // --EVENT
        async function competence_scroll()
        {
            const gap = main.scrollTop - offsetTop

            ratio = gap >= containerOffsetTop ? .3 : 1
            y = gap > 0 ? gap < height ? gap / height : 1 : 0
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<div
id="competence"
style:height={_height}
bind:this={competence}
>
    <div
    class="space"
    >
        <div
        style:transform="scale({scale})"
        >
            <Moon
            {_colors}
            />

            {#each satellites as satellite}
                <Satellite
                {...satellite}
                _r={r}
                _y={y}
                />
            {/each}
        </div>
    </div>

    <div
    class="container"
    bind:this={container}
    >
        <Montain
        {_colors}
        />

        <Forest
        {_colors}
        />

        <div
        class="content"
        >
            <Die
            _main={main}
            _pageY={pageY}
            _maxX={maxX}
            _maxY={maxY}
            _initX={initX}
            _initY={initY}
            _color={_colors.light}
            bind:number={number}
            />

            <p>CE DÉ NE SERT ABSOLUMENT A RIEN.</p>
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
        @include relative;

        z-index: 1;

        width: 100vw;

        padding: 50vh 0 30vh;

        box-sizing: border-box;

        .space
        {
            @include any;
    
            &
            >div
            {
                @include f-center(true);
                @include sticky(true);
                @include any-w;
    
                transform-style: preserve-3d;
    
                height: 100vh;

                transition: transform 1s;
            }
        }

        .container
        {
            @include absolute;

            bottom: 0;
            left: 0;

            height: 100vh;
        }

        .content
        {
            @include flex;
            @include f-column;
            @include f-a-center;

            justify-content: flex-end;

            height: 30%;

            p
            {
                @include text-info;

                background-color: $s-dark;

                margin-top: 30px;
                padding: 15px 30px;
            }
        }
    }
</style>