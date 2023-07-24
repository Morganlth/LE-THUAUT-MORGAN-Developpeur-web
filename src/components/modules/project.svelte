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
        import { orbit_custom } from './Competence.svelte'

        // --SVELTE
        import { page } from '$app/stores'
        import { onMount, onDestroy, tick } from 'svelte'
        import { fade } from 'svelte/transition'

        // --COMPONENT-PAGES
        import Booki from '../pages/Booki.svelte'
        import SophieBluel from '../pages/SophieBluel.svelte'
        import NinaCarducci from '../pages/NinaCarducci.svelte'

        // --COMPONENT-COVERS
        import Card from '../covers/Card.svelte'
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ELEMENT
        import CardContent from '../elements/CardContent.svelte'

        // --COMPONENT-ICONS
        import Molecule from '../icons/Molecule.svelte'
        import Github from '../icons/Github.svelte'

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
                    src: '/images/projects/booki/logo/booki.png',
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
                    src: '/images/projects/sophiebluel/logo/sophie-bluel.svg',
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
                    src: '/images/projects/ninacarducci/logo/nina-carducci.svg',
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
        project_OFFSETTOP,
        project_LAST = +new Date(),
        project_MOBILE

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
        cardcontainer_ROTATEY = 0,
        cardcontainer_LASTX,
        cardcontainer_LAST = +new Date()

        // --ELEMENT-CARD
        let
        card_RATIO,
        card_SHOW,
        card_SCALE = 1,
        card_TARGET = 0,
        card_TIMEOUT

    // #FUNCTIONS

// canvas animation inspired from : https://codepen.io/chriscourses/pen/poyEEojs

        // --SET
        function project_set()
        {
            project_setVar()
            project_setChildren()
            project_setEvent()
            project_setRouter()

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

        function project_setEvent() { event.event_addSeveral({ resize: project_resize, scroll: project_scroll }); console.log('set event 5') }

        function project_setEventDesktop()
        {
            event.event_add('wheel', project_wheel)

            project_MOBILE = false
        }

        function project_setEventMobile()
        {
            event.event_add('touchMove', project_touchMove)
    
            project_MOBILE = true
        }

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

        function track_set(off)
        {
            [track_ROTATE, track_TRANSLATEX, track_TRANSLATEY] = off ?? (wwindow.window_testSmallScreen() || wwindow.window_getRatio() < 1.875)
            ? [0, 0, 0]
            : [Math.atan(window.innerHeight / window.innerWidth) / Math.PI * 180, (canvas_SIZE - window.innerWidth) / 2, -50]
        }

        function cardcontainer_set()
        {
            card_RATIO = wwindow.window_getRatio() < 1 ? .8 : .5

            cardcontainer_WIDTH = window.innerWidth * (card_RATIO + .02)
            cardcontainer_HEIGHT = window.innerHeight * card_RATIO

            cardcontainer_RADIUS = cardcontainer_WIDTH / 2 / Math.tan(18 * Math.PI / 180)
            cardcontainer_TRANSLATEZ = cardcontainer_RADIUS
        }

        function canvas_setParticles()
        {
            for (let i = 0; i < (wwindow.window_testMobile() ? 30 : 100); i++)
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
            [container_OVERFLOWX, container_OVERFLOWY] = on ? ['hidden', 'scroll'] : ['visible', 'visible']

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
            console.log('remove in destroy')
            event.event_remove('scroll', project_scroll)
            event.event_remove('resize', project_resize)

            project_destroyEventDesktop()
            project_destroyEventMobile()
        }

        function project_destroyEventDesktop() { event.event_remove('wheel', project_wheel) }

        function project_destroyEventMobile() { event.event_remove('touchMove', project_touchMove) }

        function project_destroyFrame()
        {
            if (canvas_FRAMEID)
            {
                cancelAnimationFrame(canvas_FRAMEID)
                canvas_FRAMEID = null
            }
        }

        // --EVENTS
        async function project_scroll()
        {
            const NOW = +new Date()

            if (NOW > project_LAST + 200)
                event.main_scrollTop >= project_OFFSETTOP - canvas_SIZE
                ? project_start()
                : project_end(),
                project_LAST = NOW
        }

        async function project_wheel(deltaY) { if (deltaY > 0 && event.main_scrollTop >= project_OFFSETTOP) cardcontainer_move() }

        async function project_resize()
        {
            if (card_SHOW) card_click({ detail: { id: card_TARGET, on: false }})

            project_setVar()
            project_setChildren()
            canvas_setParticles()
            cardcontainer_setDecagon()

            router.router_updatePageStart(PROJECT_ID, project_OFFSETTOP)
        }

        async function project_touchMove(clientX)
        {
            const NOW = +new Date()
    
            if (NOW > cardcontainer_LAST + 300 && event.main_scrollTop >= project_OFFSETTOP)
            {
                const DIF = cardcontainer_LASTX - clientX

                if (Math.abs(DIF) > 10)
                    cardcontainer_move(DIF < 0 ? -1 : 1),
                    cardcontainer_LAST = NOW

                cardcontainer_LASTX = clientX
            }
        }

        async function project_touchStart(e) { cardcontainer_LASTX = e.changedTouches[0].clientX }

        function card_click({detail})
        {
            if (detail.id === card_TARGET)
            {
                clearTimeout(card_TIMEOUT)
    
                tick().then(() => app.app_FREEZE.set(detail.on))

                detail.on ? card_show() : card_hide()
            }
        }

        function content_clickCompetence()
        {
            app.app_TRANSITION.set(true)

            setTimeout(() =>
            {
                orbit_custom(this.subPath)

                app.app_TRANSITION.set(false)
            }, 400)
        }

        // --ROUTER-CALL
        function project_call() { project_start() }

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
        function project_start()
        {
            if (!canvas_FRAMEID)
            {
                if (!card_SHOW)
                    wwindow.window_MOBILE
                    ? project_setEventMobile()
                    : project_setEventDesktop()
    
                canvas_animation()
            }
        }

        function project_end()
        {
            if (canvas_FRAMEID)
                project_MOBILE
                ? project_destroyEventMobile() 
                : project_destroyEventDesktop(),
                project_destroyFrame(),
                cardcontainer_reset()
        }

        function cardcontainer_move(direction = 1)
        {
            const NOW = +new Date()

            if (NOW > canvas_LAST + 200)
            {
                canvas_LAST = NOW
                cardcontainer_ROTATEY += 36 * direction
                card_TARGET = cardcontainer_ROTATEY / 36 % 10

                clearTimeout(canvas_TIMEOUT), canvas_TIMEOUT = setTimeout(() => canvas_TIMEOUT = null, 400)
            }
        }

        function card_show()
        {
            [card_SHOW, card_SCALE] = [true, 1 / card_RATIO]

            event.event_scrollTo(project_OFFSETTOP)

            project_MOBILE ? project_destroyEventMobile()  : project_destroyEventDesktop()
            track_set(true)

            card_TIMEOUT = setTimeout(() =>
            {
                cardcontainer_TRANSLATEZ = 1
    
                project_update(true)
            }, 400)
        }

        function card_hide()
        {
            [card_SHOW, card_SCALE, cardcontainer_TRANSLATEZ] = [false, 1, cardcontainer_RADIUS]

            project_update(false)
    
            card_TIMEOUT = setTimeout(() =>
            {
                track_set()

                wwindow.window_MOBILE ? project_setEventMobile() : project_setEventDesktop()
            }, 400)
        }

    // #CYCLES

    onMount(project_set)
    onDestroy(project_destroy)
</script>

<!-- #HTML -->

<div
id="project"
bind:this={project}
on:touchstart={project_touchStart}
>
    <div
    class="canvas-container"
    style:width="{canvas_SIZE}px"
    style:height="{canvas_SIZE}px"
    >
        <canvas
        bind:this={canvas}
        >
        </canvas>
    </div>

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
                    _scale={card.on ? card_SCALE : 1}
                    bind:card_update={card.update}
                    on:click={card_click}
                    >
                        {#if !card.on}
                            <CardContent
                            _in={true}
                            _width="100%"
                            _img={card.img}
                            _desc={card.desc}
                            _color={_colors.sLight}
                            />
                        {/if}
                    </Card>
                {/each}
            </div>
        </div>

        <div
        class="content"
        >
            {#each CARD_CARDS as card}
                {#if card.on && card.component}
                    <div
                    class="card"
                    >
                        <div
                        class="card-info"
                        transition:fade={{ duration: 200 }}
                        >
                            <nav>
                                <Cell
                                _style="border: none; cursor: pointer;"
                                on:click={content_clickCompetence.bind(card)}
                                >
                                    <Icon
                                    _color={_colors.light}
                                    _title="Voir les compétences associées..."
                                    >
                                        <Molecule />
                                    </Icon>
                                </Cell>

                                <Icon
                                _href={'#'}
                                _alt="#"
                                >
                                    <Github />
                                </Icon>
                            </nav>

                            <p>
                                Ce projet est issue de la Formation OpenClassrooms, la version ci-dessous est une adaptation de ce projet pour se greffer au site [{$page.url.hostname}],
                                vous retrouverez le code original en lien sur mon github.
                            </p>
                        </div>
        
                        <CardContent
                        _out={true}
                        _width="calc({cardcontainer_WIDTH}px - 2vw)"
                        _img={card.img}
                        _desc={card.desc}
                        _color={_colors.light}
                        />
                    </div>

                    <svelte:component
                    this={card.component}
                    >
                    </svelte:component>
                {/if}
            {/each}
        </div>
    </div>

    <p>PROJETS</p>
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
    @use '../../assets/scss/styles/media' as *;

    /* #PROJECT */

    #project
    {
        @include flex;
        @include relative;

        align-items: flex-end;

        width: 100vw;
        height: calc(100% / 11 * 2);

        overflow: clip;

        .canvas-container
        {
            @include absolute;

            top: 75%;
            left: 50%;

            transform: translate(-50%, -50%);

            canvas { @include any; }

            &::after
            {
                @include absolute;
                @include any-w;
                
                content: '';

                top: -1px;
                left: 0;

                height: 10%;

                background: linear-gradient(0deg, transparent 0%, $dark 90%);
            }
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
            @include relative;
            @include any-w;

            .card
            {
                @include f-center(true);
                @include absolute;
                @include any-w;
                @include no-event;

                top: -100vh;
                left: 0;

                height: 100vh;
            }

            .card-info
            {
                @include flex;
                @include f-column;
                @include xy-start(true);
                @include any;

                --icon-size: 25px;

                justify-content: space-between;
                align-items: flex-end;

                gap: 20px;

                padding: 20px;

                box-sizing: border-box;

                nav
                {
                    @include flex;
                    @include any-w;

                    justify-content: space-between;
                    align-items: flex-end;
                }
    
                p
                {
                    @include f-content;

                    width: 50%;
    
                    color: $s-light;
                    font-size: 12px;
                    text-align: justify;

                    pointer-events: auto;

                    &:hover { color: $light; }

                    @include media-min(768px, 475px)
                    {
                        width: 10%;
        
                        font-size: 18px;
                    }
                }

                @include media-min(425px, 650px) { --icon-size: 30px; }
                @include media-min(768px, 475px) { padding-inline: 60px; }
            }
        }

        &>p { @include p-info }
    }
</style>