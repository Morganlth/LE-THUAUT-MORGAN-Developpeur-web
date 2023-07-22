<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _subPath,
        _colors

    // #IMPORTS
    
        // --JS
        import { rgb } from '../../assets/js/utils/color'

        // --CONTEXTS
        import { app, event, wwindow, router } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

        // --COMPONENT-PAGES
        import Booki from '../pages/Booki.svelte'
        import SophieBluel from '../pages/SophieBluel.svelte'
        import NinaCarducci from '../pages/NinaCarducci.svelte'

        // --COMPONENT-ELEMENT
        import Card from '../elements/Card.svelte'

    // #CONSTANTE

        // --ELEMENT-PROJECT
        const PROJECT_ID = 3

        // --ELEMENT-CANVAS
        const CANVAS_PARTICLES = []
    
        // --ELEMENT-CARD
        const CARD_CARDS =
        [
            {
                component: Booki,
                subPath: 'booki',
                desc: 'Créez la page d\'accueil d\'une agence de voyage avec HTML & CSS',
                img:
                {
                    src: '/src/assets/images/projects/booki/logo/booki.png',
                    alt: 'projet Booki OpenClassrooms',
                    width: 'auto',
                    height: 'auto'
                }
            },
            {
                component: SophieBluel,
                subPath: 'sophiebluel',
                desc: 'Créez une page web dynamique avec JavaScript',
                img:
                {
                    src: '/src/assets/images/projects/sophiebluel/logo/sophie-bluel.svg',
                    alt: 'projet Sophie Bluel / JavaScript OpenClassrooms',
                    width: null,
                    height: '100%'
                }
            },
            {
                component: NinaCarducci,
                subPath: 'ninacarducci',
                desc: 'Débuggez et optimisez un site de photographe',
                img:
                {
                    src: '/src/assets/images/projects/ninacarducci/logo/nina-carducci.svg',
                    alt: 'projet Nina Carducci / Optimisation OpenClassrooms',
                    width: null,
                    height: '100%'
                }
            },
            {}, {}, {}, {}, {}, {}, {}
        ]

    // #VARIABLES

        // --ELEMENT-PROJECT
        let
        project,
        project_OFFSETTOP

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        canvas_SIZE,
        canvas_SIZE_DIV_2,
        canvas_BACKGROUNDCOLOR = rgb(_colors.dark),
        canvas_ALPHA = 1,
        canvas_SPEED = 1,
        canvas_ANGLE = 0,
        canvas_FRAMEID,
        canvas_LAST = +new Date(),
        canvas_TIMEOUT

        // --ELEMENT-CONTAINER
        let
        container_OVERFLOWX,
        container_OVERFLOWY

        // --ELEMENT-TRACK
        let
        track,
        track_ROTATE,
        track_TRANSLATEX,
        track_TRANSLATEY

        // --ELEMENT-CARD-CONTAINER
        let
        cardcontainer_WIDTH,
        cardcontainer_HEIGHT,
        cardcontainer_RADIUS,
        cardcontainer_TRANSLATEZ,
        cardcontainer_ROTATEY = 0

        // --ELEMENT-CARD
        let
        card_TARGET = 0,
        card_TIMEOUT

    // #FUNCTIONS

// canvas animation inspired from : https://codepen.io/chriscourses/pen/poyEEojs

        // --SET
        function project_set()
        {
            project_setVar()
            project_setEvent()
            project_setRouter()
            project_setChildren()

            canvas_setParticles()
            cardcontainer_setDecagon()
        }

        function project_setVar()
        {
            const [WIDTH, HEIGHT] = [window.innerWidth, window.innerHeight]

            project_OFFSETTOP = project.offsetTop + HEIGHT
    
            canvas_SIZE = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT)
            canvas_SIZE_DIV_2 = canvas_SIZE / 2
        }

        function project_setEvent() { event.event_addSeveral({ wheel: project_wheel, resize: project_resize }) }

        function project_setRouter()
        {
            router.router_add(PROJECT_ID, 'project', project_OFFSETTOP, project_call)

            if (_subPath)
                for (let i = 0; i < CARD_CARDS.length; i++)
                    if (CARD_CARDS[i].subPath === _subPath)
                    {
                        card_TARGET = i
                        cardcontainer_ROTATEY += 36 * i
                        
                        return card_click({ detail: { id: i, on: true }})
                    }
        }

        function project_setChildren()
        {
            canvas_set()
            track_set()
            cardcontainer_set()
        }

        function canvas_set()
        {
            canvas.width = canvas_SIZE
            canvas.height = canvas_SIZE
    
            context = context ?? canvas.getContext('2d')
            context.shadowBlur = 16
        }

        function track_set(smallScreen)
        {
            [track_ROTATE, track_TRANSLATEX, track_TRANSLATEY] = smallScreen ??  wwindow.window_testSmallScreen()
            ? [0, 0, 0]
            : [Math.atan(window.innerHeight / window.innerWidth) / Math.PI * 180, (canvas_SIZE - window.innerWidth) / 2, -50]
        }

        function cardcontainer_set()
        {
            cardcontainer_WIDTH = window.innerWidth * .52
            cardcontainer_HEIGHT = window.innerHeight * .5

            cardcontainer_RADIUS = cardcontainer_WIDTH / 2 / Math.tan(18 * Math.PI / 180)
            cardcontainer_TRANSLATEZ = cardcontainer_RADIUS
        }

        function canvas_setParticles()
        {
            for (let i = 0; i < 100; i++)
            {
                const
                X = Math.random() * canvas_SIZE - canvas_SIZE_DIV_2,
                Y = Math.random() * canvas_SIZE - canvas_SIZE_DIV_2,
                R = Math.random() * 5 + 3,
                C = _colors[Math.round(Math.random()) ? 'primary' : 'secondary']
            
                CANVAS_PARTICLES[i] = { x: X, y: Y, r: R, c: C }
            }
        }

        function cardcontainer_setDecagon()
        {
            let [tZ, tX, rY] = [-cardcontainer_RADIUS, 0, 0]

            for (let i = 0; i < CARD_CARDS.length; i++)
            {
                if (i)
                    tX -= cardcontainer_WIDTH - Math.cos(rY * Math.PI / 180) * cardcontainer_WIDTH,
                    tZ -= Math.sin(rY * Math.PI / 180) * cardcontainer_WIDTH,
                    rY -= 36
        
                CARD_CARDS[i] = { ...CARD_CARDS[i], translateX: tX, translateZ: tZ, rotateY: rY }
            }
        }

        // --RESET
        function cardcontainer_reset() { cardcontainer_ROTATEY %= 360 }

        // --UPDATE
        function project_update(on)
        {
            CARD_CARDS[card_TARGET].on = on
            CARD_CARDS[card_TARGET].update(on)

            router.router_setSubPath(3, on ? CARD_CARDS[card_TARGET].subPath : null)
            router.router_update()
        }

        // --DESTROY
        function project_destroy()
        {
            project_destroyEvent()
            project_destroyFrame()
        }

        function project_destroyEvent()
        {
            event.event_remove('wheel', project_wheel)
            event.event_remove('resize', project_resize)
        }

        function project_destroyFrame()
        {
            if (canvas_FRAMEID)
            {
                cancelAnimationFrame(canvas_FRAMEID)
                canvas_FRAMEID = null
            }
        }

        // --EVENTS
        async function project_wheel(deltaY)
        {
            if (event.main_scrollTop >= project_OFFSETTOP - canvas_SIZE)
            {
                if (!canvas_FRAMEID) canvas_animation()

                if (deltaY > 0 && event.main_scrollTop >= project_OFFSETTOP) cardcontainer_move()
            }
            else project_destroyFrame(), cardcontainer_reset()
        }

        async function project_resize()
        {
            project_setVar()
            project_setChildren()
            canvas_setParticles()
            cardcontainer_setDecagon()

            router.router_updatePageStart(PROJECT_ID, project_OFFSETTOP)
        }

        function card_click({detail})
        {
            if (detail.id === card_TARGET)
            {
                clearTimeout(card_TIMEOUT)
    
                app.app_FREEZE.set(detail.on)

                detail.on ? card_show() : card_hide()
            }
        }

        // --ROUTER-CALL
        function project_call() { project_wheel() }

        // --DRAW
        function canvas_draw()
        {
            canvas_drawBackground()

            context.save()
            context.translate(canvas_SIZE_DIV_2, canvas_SIZE_DIV_2)
            context.rotate(canvas_ANGLE += (0.001 * canvas_SPEED))

            for (let i = 0; i < CANVAS_PARTICLES.length; i++) canvas_drawParticle.call(CANVAS_PARTICLES[i])

            context.restore()

            if (canvas_ANGLE >= 2 * Math.PI) canvas_ANGLE = 0
        }

        function canvas_drawBackground()
        {
            context.fillStyle = `rgba(${canvas_BACKGROUNDCOLOR}, ${canvas_ALPHA})`
            context.fillRect(0, 0, canvas_SIZE, canvas_SIZE)
        }

        function canvas_drawParticle()
        {
            context.beginPath()
            context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
            context.shadowColor = this.c
            context.fillStyle = this.c
            context.fill()
            context.closePath()
        }

        // --ANIMATION
        function canvas_animation()
        {
            canvas_FRAMEID = requestAnimationFrame(canvas_animation)
           
            canvas_draw()

            if (canvas_TIMEOUT)
            {
                if (canvas_ALPHA > 0.05) canvas_ALPHA -= 0.01
                if (canvas_SPEED < 5) canvas_SPEED += 0.05
            }
            else
            {
                if (canvas_ALPHA < 1) canvas_ALPHA += 0.0005
                if (canvas_SPEED > 1) canvas_SPEED -= 0.05
            }
        }

        // --UTILS
        function cardcontainer_move()
        {
            const NOW = +new Date()

            if (NOW > canvas_LAST + 200)
            {
                canvas_LAST = NOW
                cardcontainer_ROTATEY += 36
                card_TARGET = cardcontainer_ROTATEY / 36 % 10

                clearTimeout(canvas_TIMEOUT), canvas_TIMEOUT = setTimeout(() => canvas_TIMEOUT = null, 400)
            }
        }

        function card_show()
        {
            project_destroyEvent()

            ;[track_ROTATE, track_TRANSLATEX, track_TRANSLATEY] = [0, 0, 0]

            card_TIMEOUT = setTimeout(() =>
            {
                [cardcontainer_TRANSLATEZ, container_OVERFLOWX, container_OVERFLOWY] = [1, 'hidden', 'scroll']
    
                project_update(true)
            }, 400)
        }

        function card_hide()
        {
            [cardcontainer_TRANSLATEZ, container_OVERFLOWX, container_OVERFLOWY] = [cardcontainer_RADIUS, 'visible', 'visible']

            project_update(false)
    
            card_TIMEOUT = setTimeout(() => { track_set(), project_setEvent() }, 400)
        }

    // #CYCLES

    onMount(project_set)
    onDestroy(project_destroy)
</script>

<!-- #HTML -->

<div
id="project"
bind:this={project}
>
    <canvas
    style:width="{canvas_SIZE}px"
    style:height="{canvas_SIZE}px"
    bind:this={canvas}
    >
    </canvas>

    <div
    class="container"
    style:overflow="{container_OVERFLOWX ?? 'visible'} {container_OVERFLOWY ?? 'visible'}"
    >
        <div
        class="track"
        style:perspective="{cardcontainer_RADIUS ?? 0}px"
        style:transform="rotate({track_ROTATE ?? 0}deg) translate({track_TRANSLATEX ?? 0}px, {track_TRANSLATEY ?? 0}%)"
        style:overflow={container_OVERFLOWX ?? 'visible'}
        bind:this={track}
        >
            <!-- le décalage avec le 'padding-right' est important pour etre centré par rapport aux cotés, ne pas utiliser 'border-box' sur cet element -->
            <div
            class="card-container"
            style:transform="translateZ({cardcontainer_TRANSLATEZ ?? 0}px) rotateY({cardcontainer_ROTATEY ?? 0}deg)"
            style:width="{cardcontainer_WIDTH ?? 0}px"
            style:height="{cardcontainer_HEIGHT ?? 0}px"
            >
                {#each CARD_CARDS as card, i}
                    <Card
                    _id={i}
                    _translateX={card.translateX}
                    _translateZ={card.translateZ}
                    _rotateY={card.rotateY}
                    _radius={cardcontainer_RADIUS}
                    _desc={card.desc}
                    _img={card.img}
                    bind:card_update={card.update}
                    on:click={card_click}
                    />
                {/each}
            </div>
        </div>

        <div
        class="content"
        >
            {#each CARD_CARDS as card}
                {#if card.on && card.component}
                    <svelte:component
                    this={card.component}
                    >
                    </svelte:component>
                {/if}
            {/each}
        </div>
    </div>

    <p>INFINITY</p>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/cursor' as *;

    /* #PROJECT */

    #project
    {
        @include flex;
        @include relative;

        align-items: flex-end;

        width: 100vw;
        height: calc(100% / 11 * 2);

        overflow: clip;

        canvas
        {
            @include absolute;

            top: 75%;
            left: 50%;

            transform: translate(-50%, -50%);
        }

        .container
        {
            @include any-w;

            z-index: 1;
    
            height: 50%;

            scrollbar-width: none !important;
            &::-webkit-scrollbar
            {
                display: none !important;

                width: 0 !important;
            }
        }

        .track
        {
            @include f-center(true);
            @include any;

            transform-origin: top left;

            transition: transform .4s;

            .card-container
            {
                @include flex;
                @include relative;
                @include no-event;

                transform-style: preserve-3d;

                transition: transform .4s;
            }
        }

        .content
        {
            @include any-w;

            display: contents;

            height: 200%;
        }

        &>p { @include p-info; }
    }
</style>