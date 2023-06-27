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
        import Sky from '../elements/Sky.svelte'

    // #CONSTANTE

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
        let
        ratio = 1,
        translateY = 0

        // --ELEMENT-SATELLITE
        let
        r,
        y

        // --ELEMENT-LAND
        let
        land,
        landOffsetTop,
        landBreakPoint,
        zoom = 1

        // --ELEMENT-SKY
        let translate = 0

        // --EVENT
        let
        last = +new Date(),
        timeout

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
            setLand()
            setCommand()
            setEvent()
            setRouter()

            // console.log()
        }

        function setMain() { main = document.querySelector('main') }

        function setCompetence()
        {
            const innerHeight = window.innerHeight

            offsetTop = main.scrollTop + competence.getBoundingClientRect().top - innerHeight * .6
            height = competence.offsetHeight + innerHeight / 2
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

        function setLand()
        {
            landOffsetTop = land.offsetTop
            landBreakPoint = land.scrollHeight + landOffsetTop - window.innerHeight * .6
        }

        function setCommand() { app.add('spaceDimension', spaceDimension, true) }

        function setEvent() { event.add('scroll', competence_scroll) }

        function setRouter()
        {
            const start = competence.parentNode.offsetTop
    
            router.add(2, 'competence', start)
        }

        // --UPDATE
        function update()
        {
            const gap = main.scrollTop - offsetTop
            
            ;[ratio, translateY, zoom] = gap >= landOffsetTop ? [.3, -100, 1] : [1, 0, 1.5]
            y = gap > 0 ? gap < height ? gap / height : 1 : 0
            translate = gap > landBreakPoint ? gap - landBreakPoint : 0
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
            const now = +new Date()

            clearTimeout(timeout)

            if (now > last + 100) update(), last = now
            else timeout = setTimeout(update, 50)
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
        style:transform="scale({scale}) translateY({translateY}%)"
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
    class="land"
    bind:this={land}
    >
        <div
        style:transform="scale({zoom})"
        >
            <div
            class="background"
            >
                <div></div>
                <div></div>
            </div>

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

            <Sky
            _translate={translate}
            {_colors}
            />
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

        padding: 60vh 0 30vh;

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

                transition: transform .9s;
            }
        }

        .land
        {
            @include absolute;

            bottom: 0;
            left: 0;

            z-index: -1;

            height: 400vh;

            &
            >div
            {
                @include sticky(true);
                @include any-w;

                height: 130vh;

                transition: transform 1s;
            }
        }

        .background
        {
            @include absolute;
            @include any;

            z-index: -1;

            div:nth-child(1)
            {
                @include neon;
            }
    
            div:nth-child(2)
            {
                @include absolute;
                @include any-w;

                bottom: 0;
                left: 0;

                height: 50%;

                background-color: $s-dark;

                &::before,
                &::after
                {
                    @include absolute;

                    content: '';
                }

                &::before
                {
                    top: 0;
                    left: 50%;

                    transform: translate(-50%, -7%);
            
                    width: 200%;
                    height: 15vh;

                    background-color: $s-dark;

                    border: solid rgba($light, .1) 4px;
                    border-bottom: none;
                    border-radius: 50%;
                }

                &::after
                {
                    @include any-w;
    
                    bottom: -60vh;

                    height: 80vh;

                    background: linear-gradient(0deg, transparent 0%, $dark 20% 80%, transparent 100%);
                }
            }
        }

        .content
        {
            @include flex;
            @include f-column;
            @include f-a-center;

            justify-content: flex-end;

            height: 30vh;

            p
            {
                @include text-info;

                margin: 30px 0;
                padding: 15px 0;
            }
        }
    }
</style>