<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _offsetTop,
        _color

        // --BIND
        export let number = 6

    // #IMPORTS

        // --CONTEXTS
        import { event, wwindow, spring } from '../field/Main.svelte'

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

        // --ELEMENT-MAIN
        let main_scrollTop = 0

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
        let lastOffsetTop = 0

        // --ELEMENT-DIE
        let
        die,
        die_grab = event.grabbing,
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

    // #REACTIVE

    $: die_updateEvent($die_grab)

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

        function setEvent() { event.add('mouseUp', die_mouseUp) }

        function die_setEventDesktop() { event.addSeveral({ scroll: die_scroll, mouseMove: die_mouseMove }) }

        // --GET
        function getNumber()
        {
            const // position du dé en x, y, z
            posX = Math.abs(rotateX / 90),
            posY = Math.abs(rotateY / 90),
            posZ = Math.abs(rotateZ / 90)

            let n = modelX[posX] // recupère le premier nombre parmis les possibilité en x

            // verifie si le nombre existe sur les models y et z, puis effectue les rotations suivante en modifiant le nombre
            if (posY && modelY.includes(n)) n = modelY[(modelY.indexOf(n) + posY) % 4]
            if (posZ && modelZ.includes(n)) n = modelZ[(modelZ.indexOf(n) + posZ) % 4]

            number = n
        }

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
        function die_updateEvent(on)
        {
            if (wwindow.window_MOBILE === false)
                on ? die_setEventDesktop() : die_destroyEventDesktop(),
                main_scrollTop = event.main_scrollTop
        }

        function update(cursor, grab, userSelect)
        {
            cursor = cursor
            event.grabbing.set(grab)
            document.body.style.userSelect = userSelect
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

        function updateRotate()
        {
            rotateX = Math.floor(y * 360 / initY)
            rotateY = Math.floor(x * 360 / initX)
        }

        // --DESTROY
        function destroy()
        {
            event.remove('mouseUp', die_mouseUp)

            die_destroyEventDesktop()
        }

        function die_destroyEventDesktop()
        {
            event.remove('scroll', die_scroll)
            event.remove('mouseMove', die_mouseMove)
        }

        // --EVENTS
        async function die_mouseDown()
        {
            // clear()

            update('grabbing', true, 'none')
        }

        async function die_mouseUp()
        {
            if (event.grabbing)
            {
                clearTimeout(timeout)
    
                update('grab', false, 'auto')

                if (!launchedInterval && (Math.abs(vX) > gravity || Math.abs(vY) > gravity)) launched()
            }
        }

        async function die_scroll()
        {
            if (lastOffsetTop === _offsetTop) y += event.main_scrollTop - main_scrollTop

            delay = 0
    
            updateTranslate()
            updateRotate()
        
            main_scrollTop = event.main_scrollTop
            lastOffsetTop = _offsetTop
        }

        async function die_mouseMove(xNow, yNow)
        {
            const now = +new Date()

            clearTimeout(timeout)
    
            now > last + delay ? move(xNow, yNow, now) : timeout = setTimeout(() => move(xNow, yNow, now), delay)
        }

        // --UTIL
        function move(xNow, yNow, now)
        {
            delay = 50

            xNow -= initX
            yNow += main_scrollTop - (initY + _offsetTop)
            
            updatePosition(xNow, yNow)
            updateTranslate()
            updateRotate()

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