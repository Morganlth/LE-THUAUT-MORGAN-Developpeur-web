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
        import Moon from '../elements/Moon.svelte'
        import Orbit from '../elements/Orbit.svelte'
        import Scene from '../elements/Scene.svelte'
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
        let number = 6

        // --ELEMENT-SPACE
        let
        ratio = 1,
        translateY = 0

        // --ELEMENT-ORBIT
        let
        r,
        y

        // --ELEMENT-LAND
        let
        land,
        start,
        end

        // --ELEMENT-SKY
        let translate = 0

        // --EVENT
        let
        last = +new Date(),
        timeout

    // #REACTIVE

    $: scale = number / 6 * ratio // modifier cette partie pour que le dé retourne directement le calcul dans une variable scale sans réactivité

    // #FUNCTIONS

        // --SET
        function set()
        {
            setMain()
            setCompetence()
            setSatellite()
            setLand()
            setCommand()
            setEvent()
            setRouter()
        }

        function setMain() { main = document.querySelector('main') }

        function setCompetence()
        {
            const innerHeight = window.innerHeight

            offsetTop = main.scrollTop + competence.getBoundingClientRect().top
            // - innerHeight * .6
            height = competence.offsetHeight + innerHeight / 2
        }

        function setDie()
        {
            // maxX = window.innerWidth
            // maxY = main.scrollHeight
            // initX = maxX / 2
            // initY = scrollTop + die.getBoundingClientRect().top + die.offsetHeight / 2
        }

        function setSatellite()
        {
            r = window.innerWidth / 2
            y = 1 /* set satellites positions */
        }

        function setLand()
        {
            start = land.offsetTop - window.innerHeight * .7
            end = land.scrollHeight + start - window.innerHeight
            // - window.innerHeight * .6
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
            
            ;[ratio, translateY, zoom] = gap >= start ? [.3, -100, 1] : [1, 0, 1.5]
            y = (gap > 0 ? gap < height ? gap / height : 1 : 0) * 5
            translate = gap > end ? gap - end : 0
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
                <Orbit
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
        <Scene
        {_colors}
        />

        <Sky
        _translate={translate}
        {_colors}
        />
    </div>
</div>

<!-- #STYLE -->


<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;

    /* #GROUPS */

    #competence
    {
        @include relative;

        z-index: 1;

        width: 100vw;

        padding: 60vh 0 0;

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

            height: 400vh;
        }
    }
</style>