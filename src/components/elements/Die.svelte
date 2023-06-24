<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _main,
        _pageY = 0,
        _maxX = 0,
        _maxY = 0,
        _initX = 0,
        _initY = 0,
        _color

        // #BIND
        export let number = 0

    // #IMPORTS

        // --CONTEXT
        import { spring } from '../field/Main.svelte'
    
        // #MODULE
        import { event } from '../field/Main.svelte'

        // #SVELTE
        import { onMount, onDestroy } from 'svelte'    
    
        // #COVER
        import Icon from '../covers/Icon.svelte'

        // #ICON
        import Circle from '../icons/Circle.svelte'

    // #CONSTANTES

    const
    gravity = 9,
    force = 1,
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

    let
    delay = 50,
    last = +new Date(),
    x = 0,
    y = 0,
    vX = 0,
    vY = 0,
    anchor = 0,
    translateX = 0,
    translateY = 0,
    rotateX = 0,
    rotateY = -20,
    rotateZ = 0,
    rotateDelay = 0,
    cursor = 'grab',
    launchedInterval = null,
    rotateInterval = null

    // #FUNCTIONS

    function set()
    {
        setEvent()
        setVar(_initX, _initY)
    }

    function setVar(xNow, yNow)
    {
        rotateDelay = delay
        x = xNow
        y = yNow
        vX = 0
        vY = 0
        anchor = yNow
        rotateX %= 360
        rotateY %= 360
        rotateZ %= 360
    }

    function setEvent()
    {
        event.add('scroll', die_scroll)
        event.add('mouseMove', die_mouseMove)
        event.add('mouseUp', die_mouseUp)
    }

    // --DESTROY
    function destroy()
    {
        event.remove('scroll', die_scroll)
        event.remove('mouseMove', die_mouseMove)
        event.remove('mouseUp', die_mouseUp)
    }

    async function die_scroll()
    {
        const pageYNow = _main.scrollTop

        delay = 0

        if (event.grabbing)
        {
            y += pageYNow - _pageY
            anchor = y
    
            updateTranslate()
            updateRotate()
        }
    
        _pageY = pageYNow
    }

    async function die_mouseMove(xNow, yNow)
    {
        if (!event.grabbing) return

        const
        now = +new Date(),
        coords = getCoords(xNow, yNow)

        delay = 50

        if (coords)
        {
            [xNow, yNow] = coords

            vX = Math.floor(xNow - x) * force
            vY = Math.floor(yNow - y) * force
            x = xNow
            y = yNow
    
            if (now > last + delay)
            {
                updateTranslate()
                updateRotate()

                last = now

                if (Math.abs(vX) <= force && Math.abs(vY) <= force) anchor = y
            }
        }
    }

    async function die_mouseUp()
    {
        cursor = 'grab'
        event.grabbing = false
        document.body.style.userSelect = 'auto'

        if (!launchedInterval && y !== anchor && (Math.abs(vX) > gravity || Math.abs(vY) > gravity)) launched()
    }

    function getCoords(x, y)
    {
        let
        xNow = Math.floor(x),
        yNow =  _main.scrollTop + Math.floor(y)

        return (xNow < 0 || xNow > _maxX || yNow < 0 || yNow > _maxY) ? null : [xNow, yNow]
    }

    function updateTranslate(xNow, yNow)
    {
        translateX = (xNow ?? x) - _initX
        translateY = (yNow ?? y) - _initY
    }

    function updateRotate()
    {
        rotateX = Math.floor((y - _initY) * 360 / _initY)
        rotateY = Math.floor((x - _initX) * 360 / _initX)
    }

    function grab()
    {
        clear()

        cursor = 'grabbing'
        event.grabbing = true
        document.body.style.userSelect = 'none'
    }

    function clear()
    {
        clearInterval(rotateInterval)
        clearInterval(launchedInterval)
        launchedInterval = null
    }

    function launched()
    {
        const smaller = y < anchor

        let
        t = 0,
        xNow = x,
        yNow = y,
        g = gravity * (smaller ? -1 : 1)

        launchedInterval = setInterval(() =>
        {
            xNow += vX
            yNow = Math.floor(y + vY * t - 0.5 * g * t * t)
    
            if (xNow < 0 || xNow > _maxX)
            {
                xNow = (xNow < 0 ? 0 : _maxX)
                vX = -vX / 2
            }
            if (smaller ? yNow >= anchor : yNow <= anchor)
            {
                if (yNow < 0) yNow = 0
                else if (yNow > _maxY) yNow = _maxY
    
                clear()
                setVar(xNow, yNow)
                getNumber()
            }

            updateTranslate(xNow, yNow)

            t++
        }, delay)

        rotateRandom()
    }

    function rotateRandom()
    {
        rotateDelay = 90
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

<div
class="die"
style:transform="translateX({translateX}px) translateY({translateY}px)"
style:transition="transform {delay}ms"
style:cursor={cursor}
on:mousedown={grab}
on:mouseenter={spring.spring_mouseEnter}
on:mouseleave={spring.spring_mouseLeave}
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
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/grid.scss',
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #GROUPS */
    .die
    {
        perspective: 500px;
        perspective-origin: center;

        z-index: 3;

        width: 90px;
        height: 90px;

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

                border: solid $indicator 4px;

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