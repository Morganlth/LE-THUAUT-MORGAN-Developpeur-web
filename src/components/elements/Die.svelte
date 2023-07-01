<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _offsetTop,
        _color

        // --BIND
        export let number = 0

    // #IMPORTS

        // --CONTEXT
        import { event } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'    
    
        // --COMPONENT-COVER
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICON
        import Circle from '../icons/Circle.svelte'

    // #CONSTANTES

    const
    gravity = 7,
    modelX = [1, 4, 6, 2],
    modelY = [1, 3, 6, 5],
    modelZ = [2, 3, 4, 5],
    sides =
    [
        [
            null, null, null,
            null, true, null,
            null, null, null
        ],
        [
            true, null, null,
            null, null, null,
            null, null, true
        ],
        [
            true, null, null,
            null, true, null,
            null, null, true
        ],
        [
            true, null, true,
            null, null, null,
            true, null, true
        ],
        [
            true, null, true,
            null, true, null,
            true, null, true
        ],
        [
            true, true, true,
            null, null, null,
            true, true, true
        ]
    ]

    // #VARIABLES

        // --GLOBALS
        let
        delay = 50,
        rotateDelay = 0,
        last = +new Date(),
        cursor = 'grab',
        timeout,
        launchedInterval = null,
        rotateInterval = null
    
        // --MEMORIES
        let
        lastScrollTop = 0,
        lastOffsetTop = 0
        // let main
        // scrollTop

        // --ELEMENT-DIE
        let
        die,
        x = 0,
        y = 0,
        r = 0,
        vX = 0,
        vY = 0,
        maxX,
        maxY,
        initX,
        initY,
        translateX = 0,
        translateY = 0

        // --ELEMENT-DIE-3D
        let
        rotateX = 0,
        rotateY = -20,
        rotateZ = 0

    // #FUNCTIONS

        // --SET
        function set()
        {
            // setMain()
            setVar()
            setEvent()
        }

        // function setMain()
        // {
        //     main = document.querySelector('main')
        // }

        function setVar()
        {
            const
            main = document.querySelector('main'),
            boundingClientRect = die.getBoundingClientRect()
    
            r = die.offsetWidth / 2
    
            maxX = window.innerWidth
            maxY = main.scrollHeight

            initX = boundingClientRect.left + r
            initY = boundingClientRect.top + r + main.scrollTop
        }

        function setEvent()
        {
            event.add('scroll', die_scroll)
            event.add('mouseMove', die_mouseMove)
            event.add('mouseUp', die_mouseUp)
        }

        // --GET
        // function getCoords(x, y)
        // {
        //     let
        //     xNow = Math.floor(x),
        //     yNow = _main.scrollTop + Math.floor(y)

        //     return (xNow < 0 || xNow > _maxX || yNow < 0 || yNow > _maxY) ? null : [xNow, yNow]
        // }

        // --RESET
        function reset(xNow, yNow)
        {
            rotateDelay = delay
            x = xNow
            y = yNow
            vX = 0
            vY = 0
            rotateX %= 360
            rotateY %= 360
            rotateZ %= 360
        }

        // --UPDATE
        function update(c, g, u)
        {
            cursor = c
            event.grabbing = g
            document.body.style.userSelect = u
        }

        function updatePosition(xNow, yNow)
        {
            vX = Math.floor(xNow - x) / gravity
            vY = Math.floor(yNow - y) / gravity
            x = xNow
            y = yNow
        }

        function updateTranslate(xNow, yNow)
        {
            translateX = xNow ?? x
            translateY = yNow ?? y
        }

        function updateRotate(s)
        {
            rotateX = Math.floor(s * 360 / initX) % 360
            rotateY = Math.floor(x * 360 / initX) % 360
        }

        // --DESTROY
        function destroy()
        {
            event.remove('scroll', die_scroll)
            event.remove('mouseMove', die_mouseMove)
            event.remove('mouseUp', die_mouseUp)
        }

        // --EVENTS
        function die_mouseDown()
        {
            // clear()

            update('grabbing', true, 'none')
        }

        async function die_mouseUp()
        {
            update('grab', false, 'auto')

            if (!launchedInterval && (Math.abs(vX) > gravity || Math.abs(vY) > gravity)) launched()
        }

        async function die_scroll()
        {
            const scrollTop = event.scrollTop

            if (event.grabbing)
            {
                if (lastOffsetTop === _offsetTop) y += scrollTop - lastScrollTop

                delay = 0
        
                updateTranslate()
                updateRotate(scrollTop)
            }
        
            lastScrollTop = scrollTop
            lastOffsetTop = _offsetTop
        }

        async function die_mouseMove(xNow, yNow)
        {
            if (event.grabbing)
            {
                const now = +new Date()

                clearTimeout(timeout)
        
                now > last + delay ? move(xNow, yNow, now) : timeout = setTimeout(() => move(xNow, yNow, now), delay)
            }
        }

        // --UTIL
        function move(xNow, yNow, now)
        {
            const scrollTop = event.scrollTop
    
            delay = 50

            xNow -= initX
            yNow += scrollTop - (initY + _offsetTop)
            
            updatePosition(xNow, yNow)
            updateTranslate()
            updateRotate(scrollTop)

            last = now
        }

        function launched()
        {
            const smaller = y < 0

            let
            t = 0,
            xNow = x,
            yNow = y,
            g = gravity * (smaller ? -1 : 1)

            launchedInterval = setInterval(() =>
            {
                xNow += vX
                yNow = Math.floor(y + vY * t - 0.5 * g * t * t)
        
                if (xNow < -initX || xNow > initX)
                {
                    xNow = (xNow < 0 ? -initX : initX)
                    vX = -vX / 2
                }
                if (smaller ? yNow >= 0 : yNow <= 0)
                {
                    if (yNow < 0) yNow = 0
                    else if (yNow > maxY) yNow = maxY
        
                    clear()
                    reset(xNow, yNow)
                    getNumber()
                }

                updateTranslate(xNow, yNow)

                t++
            }, delay)

            rotateRandom()
        }

        function clear()
        {
            clearInterval(rotateInterval)
            clearInterval(launchedInterval)
            launchedInterval = null
        }

        function rotateRandom()
        {
            rotateDelay = 180 - vX - vY
            rotateX = Math.floor(Math.random() * 4) * 90
            rotateY = Math.floor(Math.random() * 4) * 90
            rotateZ = Math.floor(Math.random() * 4) * 90

            rotateInterval = setInterval(() =>
            Math.round(Math.random()) ? rotateX += 90 : Math.round(Math.random()) ? rotateY += 90 : rotateZ += 90,
            rotateDelay)
        }

        function getNumber()
        {
            const // position du dé en x, y, z
            posX = rotateX / 90,
            posY = rotateY / 90,
            posZ = rotateZ / 90

            let n = modelX[posX] // recupère le premier nombre parmis les possibilité en x

            // verifie si le nombre existe sur les models y et z, puis effectue les rotations suivante en modifiant le nombre
            if (posY && modelY.includes(n)) n = modelY[(modelY.indexOf(n) + posY) % 4]
            if (posZ && modelZ.includes(n)) n = modelZ[(modelZ.indexOf(n) + posZ) % 4]

            number = n
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="die"
style:transform="translateX({translateX}px) translateY({translateY}px)"
style:transition="transform {delay}ms"
style:cursor={cursor}
bind:this={die}
on:mousedown={die_mouseDown}
on:mouseenter={spring.spring_mouseEnter.bind(spring)}
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
>
    <div
    class="die-3d"
    style:transform="rotateX({rotateX}deg) rotateY({rotateY}deg) rotateZ({rotateZ}deg)"
    style:transition="transform {rotateDelay}ms"
    >
        {#each sides as side}
            <div
            class="side"
            >
                {#each side as circle}
                    <Icon
                    _spring={false}
                    {_color}
                    >
                        {#if circle}
                            <Circle
                            _fill={true}
                            />
                        {/if}
                    </Icon>
                {/each}
            </div>
        {/each}
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    @use '../../assets/scss/styles/grid.scss' as *;
    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/cursor.scss' as *;

    /* #GROUPS */
    .die
    {
        perspective: 500px;
        perspective-origin: center;

        z-index: 3;

        width: 90px;
        height: 90px;

        padding: 15px;

        .die-3d
        {
            @include any;

            transform-style: preserve-3d;
            transform-origin: center;

            .side
            {
                @include grid(12%, 12%, 3, 3);
                @include f-j-center;
                @include any;
                @include no-event;

                align-content: center;
                gap: 12%;

                background-color: $dark;

                border: solid $o-primary 4px;

                box-sizing: border-box;

                font-size: 30px;
                user-select: none;
            }
            .side:nth-child(1)
            {
                transform: translateZ(45px);
            }
            .side:nth-child(2)
            {
                transform: translateY(-150%) rotateX(-90deg);
            }
            .side:nth-child(3)
            {
                transform: translate(-50%, -200%) rotateY(90deg);
            }
            .side:nth-child(4)
            {
                transform: translateY(-250%) rotateX(90deg);
            }
            .side:nth-child(5)
            {
                transform: translate(50%, -400%) rotateY(-90deg);
            }
            .side:nth-child(6)
            {
                transform: translateY(-500%) translateZ(-45px);
            }
        }
    }
</style>

<!--
    *optimisation du dé necessaire...
     
    *animation => dé destructuré qui se decompose a l'eloignement du scroll
-->