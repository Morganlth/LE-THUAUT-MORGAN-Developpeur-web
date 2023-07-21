<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _scene,
        _color

        // --BIND
        export let number = 6

    // #IMPORTS

        // --CONTEXTS
        import { app, event, wwindow, spring } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy, tick } from 'svelte'    
    
        // --COMPONENT-COVER
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICON
        import Circle from '../icons/Circle.svelte'

    // #CONSTANTES

        // --ELEMENT-DIE
        const
        DIE_GRAVITY = 7,
        DIE_MODELX = [1, 4, 6, 2],
        DIE_MODELY = [1, 3, 6, 5],
        DIE_MODELZ = [2, 3, 4, 5],
        DIE_SIDES =
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

        // --ELEMENT-SCENE
        let scene_LASTOFFSETTOP = 0

        // --ELEMENT-DIE
        let
        die,
        die_MOBILE,
        die_DELAY = 50,
        die_LAST = +new Date(),
        die_TIMEOUT,
        die_LAUNCHEDINTERVAL,
        die_ROTATEINTERVAL,
        die_CURSOR = 'grab',
        die_GRAB,
        die_X,
        die_Y,
        die_VX,
        die_VY,
        die_MAX,
        die_INITX,
        die_INITY,
        die_TRANSLATEX,
        die_TRANSLATEY

        // --ELEMENT-DIE-3D
        let
        die3d_ROTATEX,
        die3d_ROTATEY,
        die3d_ROTATEZ,
        die3d_ROTATEDELAY = 0

    // #FUNCTIONS

        // --SET
        function die_set()
        {
            die_resetPosition()

            die_setVar()
            die_setEvent()
        }

        function die_setVar()
        {
            const RADIUS = die.offsetWidth / 2, MAIN = (event.main ? event.main : document.querySelector('main'))
    
            let { top, left } = die.getBoundingClientRect()
    
            die_MAX = MAIN.scrollHeight
            die_INITX = left + RADIUS
            die_INITY = top + RADIUS + MAIN.scrollTop - (_scene ? _scene.offsetTop : 0)
        }

        function die_setEvent() { event.event_add('resize', die_resize) }

        function die_setEventDesktop()
        {
            event.event_addSeveral({ scroll: die_scroll, mouseMove: die_mouseMove, mouseUp: die_mouseUp })

            die_MOBILE = false
        }

        function die_setEventMobile()
        {
            event.event_add('touchMove', die_touchMove)

            die_MOBILE = true
        }

        function die_setNumber()
        {
            const [POSX, POSY, POSZ] = [Math.abs(die3d_ROTATEX / 90), Math.abs(die3d_ROTATEY / 90), Math.abs(die3d_ROTATEZ / 90)] // position du dé en x, y, z

            let n = DIE_MODELX[POSX] // recupère le premier nombre parmis les possibilité en x

            // verifie si le nombre existe sur les models y et z, puis effectue les rotations suivante en modifiant le nombre
            if (POSY && DIE_MODELY.includes(n)) n = DIE_MODELY[(DIE_MODELY.indexOf(n) + POSY) % 4]
            if (POSZ && DIE_MODELZ.includes(n)) n = DIE_MODELZ[(DIE_MODELZ.indexOf(n) + POSZ) % 4]

            number = n
        }

        // --RESET
        function die_reset(xNow, yNow)
        {
            die3d_ROTATEDELAY = die_DELAY
            die_X = xNow
            die_Y = yNow
            die_VX = 0
            die_VY = 0
    
            die3d_ROTATEX %= 360
            die3d_ROTATEY %= 360
            die3d_ROTATEZ %= 360
        }

        function die_resetPosition()
        {
            die_TRANSLATEX = 0
            die_TRANSLATEY = 0

            die3d_ROTATEX = 0
            die3d_ROTATEY = -20
            die3d_ROTATEZ = 0
        }

        // --UPDATE
        function die_update(cursor, grab, userSelect)
        {
            die_CURSOR = cursor
            die_GRAB = grab
            event.event_GRABBING.set(grab)
            document.body.style.userSelect = userSelect
        }

        function die_updatePosition(clientX, clientY)
        {
            die_VX = Math.floor(clientX - die_X) / DIE_GRAVITY
            die_VY = Math.floor(clientY - die_Y) / DIE_GRAVITY
            die_X = clientX
            die_Y = clientY
        }

        function die_updateTranslate(xNow, yNow)
        {
            die_TRANSLATEX = xNow ?? die_X
            die_TRANSLATEY = yNow ?? die_Y
        }

        function die3d_updateRotate()
        {
            die3d_ROTATEX = Math.floor(die_Y * 360 / die_INITY)
            die3d_ROTATEY = Math.floor(die_X * 360 / die_INITX)
        }

        // --DESTROY
        function die_destroy()
        {
            event.event_remove('resize', die_resize)

            die_destroyEventDesktop()
        }

        function die_destroyEventDesktop()
        {
            event.event_remove('scroll', die_scroll)
            event.event_remove('mouseMove', die_mouseMove)
            event.event_remove('mouseUp', die_mouseUp)
        }

        function die_destroyEventMobile() { event.event_remove('touchMove', die_touchMove) }

        // --EVENTS
        async function die_mouseDown()
        {
            main_scrollTop = event.main_scrollTop

            die_clear()

            die_update('grabbing', true, 'none')

            wwindow.window_MOBILE ? die_setEventMobile() : die_setEventDesktop()
        }

        async function die_mouseUp()
        {
            if (die_GRAB)
            {
                clearTimeout(die_TIMEOUT)
    
                die_update('grab', false, 'auto')

                die_MOBILE ? die_destroyEventMobile() : die_destroyEventDesktop()

                if (!die_LAUNCHEDINTERVAL && (Math.abs(die_VX) > DIE_GRAVITY || Math.abs(die_VY) > DIE_GRAVITY)) die_launched()
            }
        }

        async function die_scroll()
        {
            if (scene_LASTOFFSETTOP === _scene.offsetTop) die_Y += event.main_scrollTop - main_scrollTop

            die_DELAY = 0
    
            die_updateTranslate()
            die3d_updateRotate()
        
            main_scrollTop = event.main_scrollTop
            scene_LASTOFFSETTOP = _scene.offsetTop
        }

        async function die_mouseMove(clientX, clientY)
        {
            const NOW = +new Date()

            clearTimeout(die_TIMEOUT)
    
            NOW > die_LAST + die_DELAY
            ? die_move(clientX, clientY, NOW)
            : die_TIMEOUT = setTimeout(die_move.bind(null, clientX, clientY, NOW), die_DELAY)
        }

        async function die_touchMove(clientX, clientY)
        {
            const NOW = +new Date()

            clearTimeout(die_TIMEOUT)
    
            NOW > die_LAST + die_DELAY
            ? die_move(clientX, clientY, NOW)
            : die_TIMEOUT = setTimeout(die_move.bind(null, clientX, clientY, NOW), die_DELAY)
        }

        async function die_touchStart()
        {
            app.app_FREEZE.set(true)

            die_mouseDown()
        }

        async function die_touchEnd()
        {
            app.app_FREEZE.set(false)

            die_mouseUp()
        }

        async function die_resize()
        {
            die3d_ROTATEDELAY = (die_DELAY = 0)
    
            die_resetPosition()
            
            tick().then(() =>
            {
                die_setVar()

                die3d_ROTATEDELAY = (die_DELAY = 50)
            })
        }

        // --CLEAR
        function die_clear()
        {
            clearInterval(die_ROTATEINTERVAL)
            clearInterval(die_LAUNCHEDINTERVAL)
            die_LAUNCHEDINTERVAL = null
        }

        // --UTIL
        function die_move(clientX, clientY, now)
        {
            die_DELAY = 50

            clientX -= die_INITX
            clientY += main_scrollTop - (die_INITY + _scene.offsetTop)
            
            die_updatePosition(clientX, clientY)
            die_updateTranslate()
            die3d_updateRotate()

            die_LAST = now
        }

        function die_launched()
        {
            const SMALLER = die_Y < 0

            let
            t = 0,
            xNow = die_X,
            yNow = die_Y,
            g = DIE_GRAVITY * (SMALLER ? -1 : 1)

            die_LAUNCHEDINTERVAL = setInterval(() =>
            {
                xNow += die_VX
                yNow = Math.floor(die_Y + die_VY * t - 0.5 * g * t * t)
        
                if (xNow < -die_INITX || xNow > die_INITX)
                {
                    xNow = (xNow < 0 ? -die_INITX : die_INITX)
                    die_VX = -die_VX / 2
                }
                if (SMALLER ? yNow >= 0 : yNow <= 0)
                {
                    if (yNow < 0) yNow = 0
                    else if (yNow > die_MAX) yNow = die_MAX
        
                    die_clear()
                    die_reset(xNow, yNow)
                    die_setNumber()
                }

                die_updateTranslate(xNow, yNow)

                t++
            }, die_DELAY)

            die3d_rotateRandom()
        }

        function die3d_rotateRandom()
        {
            die3d_ROTATEDELAY = 180 - die_VX - die_VY
            die3d_ROTATEX = Math.floor(Math.random() * 4) * 90
            die3d_ROTATEY = Math.floor(Math.random() * 4) * 90
            die3d_ROTATEZ = Math.floor(Math.random() * 4) * 90

            die_ROTATEINTERVAL = setInterval(() =>
                Math.round(Math.random())
                ? die3d_ROTATEX += 90
                : Math.round(Math.random())
                    ? die3d_ROTATEY += 90
                    : die3d_ROTATEZ += 90,
            die3d_ROTATEDELAY)
        }

    // #CYCLES

    onMount(die_set)
    onDestroy(die_destroy)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="die"
style:transform="translateX({die_TRANSLATEX}px) translateY({die_TRANSLATEY}px)"
style:transition="transform {die_DELAY}ms"
style:cursor={die_CURSOR}
bind:this={die}
on:mousedown={die_mouseDown}
on:mouseenter={spring.spring_mouseEnter.bind(spring)}
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
on:touchstart={die_touchStart}
on:touchend={die_touchEnd}
>
    <div
    class="die-3d"
    style:transform="rotateX({die3d_ROTATEX}deg) rotateY({die3d_ROTATEY}deg) rotateZ({die3d_ROTATEZ}deg)"
    style:transition="transform {die3d_ROTATEDELAY}ms"
    >
        {#each DIE_SIDES as side}
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

    @use '../../assets/scss/styles/grid' as *;
    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/cursor' as *;

    /* #DIE */

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