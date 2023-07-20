<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORTS

        // --JS
        import { rgba } from '../../assets/js/utils/color'

        // --CONTEXTS
        import { app, event, router } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy, tick } from 'svelte'

        // --COMPONENT-ELEMENTS
        import Moon from '../elements/Moon.svelte'
        import Orbit from '../elements/Orbit.svelte'
        import Scene from '../elements/Scene.svelte'
        import Sky from '../elements/Sky.svelte'

    // #CONSTANTES

        // --ELEMENT-COMPETENCE
        const COMPETENCE_DURATION = 900

        // --ELEMENT-ORBIT
        const ORBIT_ORBITS =
        [
            {
                props: { _id: 0, _rotate: -50 * Math.PI / 180, _offset: 0 },
                title: ['FRONT', 'FORME - STYLE'],
                content:
                [
                    'découper, assembler et intégrer tous les éléments d’une maquette graphique en HTML5 et CSS',
                    'ajouter du contenu audio et vidéo en HTML5',
                    'animer les pages web avec CSS3',
                    'construire un projet impliquant SCSS et SASS'
                ],
                elements: {}
            }
        ,
            {
                props: { _id: 1, _rotate: 80 * Math.PI / 180, _offset: 4.71 },
                title: ['FRONT', 'JAVASCRIPT'],
                content:
                [
                    'faire réagir la page web en fonction des actions de l’utilisateur en JavaScript',
                    'se connecter à un service web pour exploiter des données tierces (API)',
                    'gérer les comptes utilisateurs',
                    'animer les pages web avec JavaScript',
                    'concevoir un site maintenable grâce à la gestion des erreurs et exceptions',
                    'construire des algorithmes',
                    'utiliser le framework React',
                    'développer un projet sous Svelte'
                ],
                elements: {}
            }
        ,
            {
                props: { _id: 2, _rotate: 40 * Math.PI / 180, _offset: 3.14 },
                title: ['BACK', 'NODE SERVER'],
                content:
                [
                    'créer un nouveau projet NodeJS impliquant diverses dépendances (Express, MongoDB, jsonwebtoken...)',
                    'gérer les comptes utilisateurs',
                    'créer, gérer et afficher le contenu d’une base de données',
                    'créer des API (REST)',
                    'construire un projet avec SvelteKit'
                ],
                elements: {}
            }
        ,
            {
                props: { _id: 3, _rotate: 10 * Math.PI / 180, _offset: 1.57 },
                title: ['ADAPTABILITÉ - RÉFÉRENCEMENT'],
                content:
                [
                    'appliquer les standards du web et les normes en vigueur',
                    'construire un site web fluide s’adaptant à tout type d’écran (web, smartphone et tablette)',
                    'améliorer le référencement naturel en utilisant les balises selon leur sémantique',
                    'améliorer les performances et optimiser une page web',
                    'appliquer les Schema.org',
                    'utiliser les balises meta OPEN GRAPH des réseaux sociaux (og, twitter)'
                ],
                elements: {}
            }
        ]

    // #VARIABLES

        // --ELEMENT-COMPETENCE
        let
        competence,
        competence_OFFSETTOP,
        competence_HEIGHT,
        competence_LAST = +new Date(),
        competence_TIMEOUT

        // --ELEMENT-CONTENT
        let
        content_MAX = 0,
        content_TRANSLATEX = 0

        // --ELEMENT-SPACE
        let
        space_RATIO = 1,
        space_TRANSLATEY = 0

        // --ELEMENT-ORBIT
        let
        orbit_TARGET,
        orbit_ANIMATE = false,
        orbit_RADIUS,
        orbit_Y,
        orbit_COLORS = { on: _colors.light, off: rgba(_colors.light, .1) }

        // --ELEMENT-LAND
        let
        land,
        land_START,
        land_END

        // --ELEMENT-SCENE
        let scene_SCALE = 0

        // --ELEMENT-DIE
        let die_NUMBER = 6

        // --ELEMENT-SKY
        let sky_TRANSLATEX = 0
        

    // #REACTIVE

            // --ELEMENT-SPACE
            $: space_SCALE = die_NUMBER / 6 * space_RATIO

            // --ELEMENT-ORBIT
            $: orbit_animation(orbit_ANIMATE)

    // #FUNCTIONS

        // --SET
        function competence_set()
        {
            competence_OFFSETTOP = competence.getBoundingClientRect().top
            competence_HEIGHT = competence.offsetHeight + window.innerHeight / 2

            orbit_set()
            land_set()
            competence_setCommand()
            competence_setEvent()
            competence_setRouter()
        }

        function orbit_set()
        {
            orbit_RADIUS = window.innerWidth / 2
            orbit_Y = 1 /* set orbits positions */
        }

        function land_set()
        {
            land_START = land.offsetTop - window.innerHeight * .7
            land_END = land.scrollHeight + land_START - window.innerHeight
        }

        function content_setSubtitle(orbit) { orbit.subtitle = [...orbit.elements.subtitle.querySelectorAll('.char')] }

        function content_setLetters(orbit)
        {
            const LETTERS = [...orbit.elements.title.querySelectorAll('span')]

            orbit.letters = []

            for (let i = 0; i < LETTERS.length; i++)
                orbit.letters[i] =
                [
                    LETTERS[i],
                    window.innerWidth / 3 * (Math.round(Math.random()) ? 1 : -1),
                    window.innerHeight / 3 * (Math.round(Math.random()) ? 1 : -1),
                    window.innerHeight * (Math.round(Math.random()) ? 1 : -1)
                ]
        }

        function orbit_setList(orbit)
        {
            const
            WIDTH = window.innerWidth,
            LIS = [...orbit.elements.list.children]

            orbit.elements.lis = []

            for (let i = 0; i < orbit.content.length; i++)
            {
                const [TRANSLATEX, SPEED] = [Math.random() * WIDTH + WIDTH, Math.random() * 1.5 + .8]

                orbit.elements.lis[i] = { translateX: TRANSLATEX, speed: SPEED }

                content_MAX = Math.max(content_MAX, (TRANSLATEX + WIDTH + LIS[i].offsetWidth + 100) / SPEED)
            }
        }

        function competence_setCommand() { app.app_add('space_dimension', space_dimension, true) }

        function competence_setEvent() { event.event_add('scroll', competence_scroll) }

        function competence_setEventDesktop() { event.event_add('wheel', competence_wheel) }

        function competence_setRouter()
        {
            const start = competence.parentNode.offsetTop
    
            router.router_add(2, 'competence', start)
        }

        // --RESET
        function competence_reset()
        {
            competence_destroyEventDesktop()
    
            content_MAX = 0
            content_TRANSLATEX = 0
        }

        // --UPDATE
        function competence_update()
        {
            const GAP = event.main_scrollTop - competence_OFFSETTOP
    
            ;[space_RATIO, space_TRANSLATEY, scene_SCALE, orbit_Y, orbit_ANIMATE] = GAP > 0
            ?   GAP < competence_HEIGHT
                ? [...(GAP >= land_START
                    ? [.3, -100, 1]
                    : [1, 0, 1.5])
                  , GAP / competence_HEIGHT * 5, true]
                : [.3, -100, 1, 5, false]
            : [1, 0, 1.5, 0, false]

            sky_TRANSLATEX = GAP > land_END ? GAP - land_END : 0
        }

        function orbit_update(on)
        {
            on ? (app.app_FREEZE.set(true), space_RATIO = .3) : (app.app_FREEZE.set(false), space_RATIO = 1)

            tick().then(() => on
            ? (orbit_setList(ORBIT_ORBITS[orbit_TARGET]), competence_setEventDesktop())
            : competence_update())
        }

        function orbit_updateLetter(e, x, y, z) { e.style.transform = `translate3d(${x ?? 0}px, ${y ?? 0}px, ${z ?? 0}px)` }

        function orbit_updateSubtitle(orbit, i, unwind)
        {
            const LETTER = orbit.subtitle[i]
            
            unwind ? LETTER.textContent = LETTER.dataset.char : LETTER.innerHTML = '&nbsp;'
        }

        // --DESTROY
        function competence_destroy()
        {
            event.event_remove('scroll', competence_scroll)
           
            competence_destroyEventDesktop()
        }

        function competence_destroyEventDesktop() { event.event_remove('wheel', competence_wheel) }

        // --COMMAND
        function space_dimension(n)
        {
            n = app.app_testDefault(n) ? 6 : app.app_testNumber(n, 1, 6)

            die_NUMBER = n
            localStorage.setItem('space_dimension', n)
    
            app.app_success('space dimension - ' + n)
        }

        // --EVENTS
        async function competence_scroll()
        {
            const now = +new Date()

            clearTimeout(competence_TIMEOUT)

            if (now > competence_LAST + 100) competence_update(), competence_LAST = now
            else competence_TIMEOUT = setTimeout(competence_update, 50)
        }

        async function competence_wheel(deltaY)
        {
            orbit_Y += deltaY > 0 ? .05 : -.05

            content_TRANSLATEX += deltaY

            if (content_TRANSLATEX > content_MAX || content_TRANSLATEX < 0) orbit_click({ detail: { id: undefined } })
        }

        function orbit_click({detail})
        {
            competence_reset()

            if (orbit_TARGET != undefined && orbit_TARGET !== detail.id) ORBIT_ORBITS[orbit_TARGET].on = false

            orbit_TARGET = detail.id
    
            orbit_update(detail.on)
        }

        // --CLEAR
        function content_clearAnimation(orbit) { cancelAnimationFrame(orbit.frameId) }

        // --TEST
        function orbit_testEnd(orbit, end, unwind)
        {
            return unwind
            ? ++end >= orbit.subtitle.length
                ? orbit.subtitle.length - 1
                : end
            : --end < 0
                ? 0
                : end
        }

        // --TRANSITION
        function orbit_fade() { return { duration: COMPETENCE_DURATION, css: (t) => `opacity: ${t}` } }

        // --ANIMATIONS
        function orbit_animation(animate) { if (competence) for (const ORBIT of ORBIT_ORBITS) ORBIT[animate ? 'animation' : 'clear']() }

        async function content_animationLetterGather(orbit)
        {
            for (const LETTER of orbit.letters)
                orbit_updateLetter(...LETTER),
                requestAnimationFrame(() => orbit_updateLetter(LETTER[0]))
        }

        async function content_animationWriting(orbit, start, end, i, j, unwind)
        {
            orbit.frameId = requestAnimationFrame(() =>
            {
                for (let u = start; unwind ? u < end : u > end; unwind ? u++ : u--)
                    orbit.subtitle[u].textContent = [' ', unwind ? '>' : '<'][Math.floor(Math.random() * 2)]

                if (++i === 10)
                    i = 0, end = orbit_testEnd(orbit, end, unwind)
                if (++j === 16)
                {
                    j = 0

                    orbit_updateSubtitle(orbit, start, unwind)

                    if ((unwind ? start++ : start--) === end) return
                }

                content_animationWriting(orbit, start, end, i, j, unwind)
            })
        }

        async function content_animationShatter(orbit) { for (const LETTER of orbit.letters) orbit_updateLetter(...LETTER) }

        // --INTRO-OUTRO
        function content_introstart()
        {
            content_setSubtitle(this)
            content_setLetters(this)

            content_clearAnimation(this)

            content_animationLetterGather(this)
            content_animationWriting(this, 0, 1, 0, 0, true)
        }

        function content_outrostart()
        {
            const LENGTH = this.subtitle.length
    
            content_clearAnimation(this)

            content_animationShatter(this)
            content_animationWriting(this, LENGTH - 1, LENGTH - 2, 0, 0, false)
        }

        function orbit_introstart()
        {
            content_animationWriting(this, 0, 1, 0, 0, true)
        }

    // #CYCLES

    onMount(competence_set)
    onDestroy(competence_destroy)
</script>

<!-- #HTML -->

<div
id="competence"
bind:this={competence}
>
    <div
    class="track"
    >
        <div
        style:--duration="{COMPETENCE_DURATION}ms"
        >
            {#each ORBIT_ORBITS as orbit}
                {#if orbit.on}
                    <div
                    class="content"
                    transition:orbit_fade
                    on:introstart={content_introstart.bind(orbit)}
                    on:outrostart={content_outrostart.bind(orbit)}
                    >
                        <section>
                            <h2
                            bind:this={orbit.elements.title}
                            >
                                {#each orbit.title as title}
                                    <div>
                                        {#each title as char}
                                            <span
                                            style:transition="transform {Math.random() * COMPETENCE_DURATION / 2 + COMPETENCE_DURATION / 2}ms"
                                            >
                                                {char}
                                            </span>
                                        {/each}
                                    </div>
                                {/each}
                            </h2>

                            <p
                            bind:this={orbit.elements.subtitle}
                            >
                                {#each (orbit.title[0] + (orbit.title.length > 1 ? ' . ' + orbit.title.slice(1).toString().replaceAll(',', ' ') : '')) as char}
                                    <span
                                    class:char={char !== ' '}
                                    data-char={char}
                                    >
                                        &nbsp;
                                    </span>
                                {/each}
                            </p>
                        </section>

                        <div>
                            <ul
                            bind:this={orbit.elements.list}
                            >
                                {#each orbit.content as content, i}
                                    <li
                                    style:transform="translateX({orbit.elements.lis
                                    ? orbit.elements.lis[i].translateX - content_TRANSLATEX * orbit.elements.lis[i].speed
                                    : -content_TRANSLATEX}px)"
                                    >
                                        <p>{content}</p>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                {/if}
            {/each}

            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <div
            class="space"
            style:transform="scale({space_SCALE}) translateY({space_TRANSLATEY}%)"
            >
                <Moon
                {_colors}
                />

                {#each ORBIT_ORBITS as orbit}
                    {#if orbit.focus}
                        <p
                        class="orbit-theme"
                        >
                            {#each (orbit.title[0] + (orbit.title.length > 1 ? ' . ' + orbit.title.slice(1).toString().replaceAll(',', ' ') : '')) as char}
                                <span
                                class:char={char !== ' '}
                                data-char={char}
                                >
                                    &nbsp;
                                </span>
                            {/each}
                        </p>
                    {/if}

                    <Orbit
                    {...orbit.props}
                    _r={orbit_RADIUS}
                    _y={orbit_Y}
                    _title={orbit.title.toString().replaceAll(',', ' ')}
                    _colors={orbit_COLORS}
                    bind:orbit_ON={orbit.on}
                    bind:orbit_FOCUS={orbit.focus}
                    bind:satellite_animationFloating={orbit.animation}
                    bind:satellite_clear={orbit.clear}
                    on:click={orbit_click}
                    />
                {/each}
            </div>

            <p>COMPÉTENCES</p>
        </div>
    </div>

    <div
    class="land"
    bind:this={land}
    >
        <Scene
        _scale={scene_SCALE}
        {_colors}
        bind:number={die_NUMBER}
        />

        <Sky
        _translateX={sky_TRANSLATEX}
        {_colors}
        />
    </div>
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

    /* #COMPETENCE */

    #competence
    {
        @include relative;

        z-index: 1;

        width: 100vw;
        height: calc(100% / 11 * 9);

        .track
        {
            @include any;

            overflow-y: clip;

            box-sizing: border-box;

            &
            >div
            {
                @include sticky;
                @include any-w;

                height: 100vh;

                &>p { @include p-info; }
            }

            &::after
            {
                @include xy-start(true);
                @include any-w;

                content: '';

                height: 100vh;

                background: linear-gradient(0deg, transparent 0%, $dark 70%);
            }
        }

        .space
        {
            @include f-center(true);
            @include any;
    
            transform-style: preserve-3d;

            transition: transform var(--duration);

            .orbit-theme
            {
                @include absolute;
                @include p-content;

                top: 50%;
                left: 50%;

                color: $secondary;
            }
        }

        .content
        {
            @include no-event;

            section
            {
                @include flex;
                @include f-column;
                @include f-j-center;
                @include xy-start(true);
                @include any;

                padding: 0px 40px;

                box-sizing: border-box;

                h2
                {
                    @include h-(rgba($light, .1), 190px, 190px);

                    perspective: 100vh;

                    letter-spacing: 10px;

                    div
                    {
                        @include flex;

                        transform-style: preserve-3d;
                    }
                }

                p
                {
                    @include flex;
                    @include f-content;

                    color: $primary;
                    font-size: 18px;
                    user-select: none;
                }
            }

            &
            >div
            {
                @include xy-start(true);
                @include any;

                z-index: 1;

                transform: translateX(100%);

                ul
                {
                    @include flex;
                    @include f-column;
                    @include any;

                    justify-content: space-between;

                    padding: 120px 0;

                    box-sizing: border-box;

                    li
                    {
                        width: fit-content;
    
                        transition: transform .3s;
                    }

                    p
                    {
                        @include p-content;

                        display: inline;

                        color: $s-light;

                        cursor: default;
                        pointer-events: auto;
                        user-select: none;

                        &:hover { color: $primary; }
                    }
                }
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