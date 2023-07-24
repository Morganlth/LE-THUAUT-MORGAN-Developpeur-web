<!-- #SCRIPT -->

<script
context="module"
>
    // #EXPORT

        // --MODULE
        export function orbit_custom(tag) { orbit_CUSTOM.set(tag) }

    // #IMPORT

        // --SVELTE
        import { writable } from 'svelte/store'

    // #VARIABLE

        // --ELEMENT-ORBIT
        export let orbit_CUSTOM = writable(false)
</script>

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORTS

        // --JS
        import { rgba } from '../../assets/js/utils/color'

        // --CONTEXTS
        import { app, event, wwindow, router } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy, tick } from 'svelte'

        // --COMPONENT-ELEMENTS
        import Moon from '../elements/Moon.svelte'
        import Orbit from '../elements/Orbit.svelte'
        import Scene from '../elements/Scene.svelte'
        import Sky from '../elements/Sky.svelte'

    // #CONSTANTES

        // --ELEMENT-COMPETENCE
        const
        COMPETENCE_ID = 2,
        COMPETENCE_DURATION = 900,
        COMPETENCE_SKILLS =
        [
            [
                { text: 'découper, assembler et intégrer tous les éléments d’une maquette graphique en HTML5 et CSS', tags: ['booki'] },
                { text: 'ajouter du contenu audio et vidéo en HTML5' },
                { text: 'animer les pages web avec CSS3' },
                { text: 'construire un projet impliquant SCSS et SASS' }
            ],
            [
                { text: 'faire réagir la page web en fonction des actions de l’utilisateur en JavaScript' },
                { text: 'se connecter à un service web pour exploiter des données tierces (API)' },
                { text: 'gérer les comptes utilisateurs' },
                { text: 'animer les pages web avec JavaScript' },
                { text: 'concevoir un site maintenable grâce à la gestion des erreurs et exceptions' },
                { text: 'construire des algorithmes' },
                { text: 'utiliser le framework React' },
                { text: 'développer un projet sous Svelte' }
            ],
            [
                { text: 'créer un nouveau projet NodeJS impliquant diverses dépendances (Express, MongoDB, jsonwebtoken...)' },
                { text: 'gérer les comptes utilisateurs' },
                { text: 'créer, gérer et afficher le contenu d’une base de données' },
                { text: 'créer des API (REST)' },
                { text: 'construire un projet avec SvelteKit' }
            ],
            [
                { text: 'appliquer les standards du web et les normes en vigueur', tags: ['booki'] },
                { text: 'construire un site web fluide s’adaptant à tout type d’écran (web, smartphone et tablette)', tags: ['booki'] },
                { text: 'améliorer le référencement naturel en utilisant les balises selon leur sémantique' },
                { text: 'améliorer les performances et optimiser une page web' },
                { text: 'appliquer les Schema.org' },
                { text: 'utiliser les balises meta OPEN GRAPH des réseaux sociaux (og, twitter)' }
            ]
        ]

        // --ELEMENT-ORBIT
        const
        ORBIT_ORBITS =
        [
            {
                props: { _id: 0, _rotate: -50 * Math.PI / 180, _offset: 0 },
                title: ['FRONT', 'FORME - STYLE'],
                skills: COMPETENCE_SKILLS[0],
                thematic: { elements: {} },
                content: { elements: {} }
            }
        ,
            {
                props: { _id: 1, _rotate: 80 * Math.PI / 180, _offset: 4.71 },
                title: ['FRONT', 'JAVASCRIPT'],
                skills: COMPETENCE_SKILLS[1],
                thematic: { elements: {} },
                content: { elements: {} }
            }
        ,
            {
                props: { _id: 2, _rotate: 40 * Math.PI / 180, _offset: 3.14 },
                title: ['BACK', 'NODE SERVER'],
                skills: COMPETENCE_SKILLS[2],
                thematic: { elements: {} },
                content: { elements: {} }
            }
        ,
            {
                props: { _id: 3, _rotate: 10 * Math.PI / 180, _offset: 1.57 },
                title: ['ADAPTABILITÉ', 'RÉFÉRENCEMENT'],
                skills: COMPETENCE_SKILLS[3],
                thematic: { elements: {} },
                content: { elements: {} }
            }
        ]


    // #VARIABLES

        // --ELEMENT-COMPETENCE
        let
        competence,
        competence_OFFSETTOP,
        competence_HEIGHT,
        competence_LAST = +new Date(),
        competence_TIMEOUT,
        competence_MOBILE

        // --ELEMENT-CONTENT
        let
        content_MAX = 0,
        content_TRANSLATEX = 0,
        content_LASTX = null,
        content_LAST = +new Date(),
        content_TIMEOUT

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
            $: space_$SCALE = die_NUMBER / 6 * space_RATIO

            // --ELEMENT-ORBIT
            $: orbit_animation(orbit_ANIMATE)
            $: orbit_setCustom($orbit_CUSTOM)

    // #FUNCTIONS

        // --SET
        function competence_set()
        {
            competence_reset()
    
            competence_setCommand()
            competence_setEvent()
            competence_setRouter()
        }

        function competence_setCommand() { app.app_add('space_dimension', space_dimension, true) }

        function competence_setEvent() { event.event_addSeveral({ scroll: competence_scroll, resize: competence_resize }) }

        function competence_setEventDesktop()
        {
            event.event_add('wheel', competence_wheel)

            competence_MOBILE = false
        }

        function competence_setEventMobile()
        {
            event.event_add('touchMove', competence_touchMove)
    
            competence_MOBILE = true
        }

        function competence_setRouter() { router.router_add(COMPETENCE_ID, 'competence', competence_OFFSETTOP) }

        function orbit_set()
        {
            orbit_RADIUS = Math.max(window.innerWidth / 2, window.innerHeight / 2)
            orbit_Y = .01 /* set orbits positions */
        }

        function orbit_setCustom(tag)
        {
            if (!tag) return

            const ID = ORBIT_ORBITS.length
    
            ORBIT_ORBITS.push(
            {
                props: { _id: ID, _rotate: -20 * Math.PI / 180, _offset: .7 },
                title: [tag.toUpperCase()],
                skills: comeptence_getSkills(tag),
                thematic: { elements: {} },
                content: { elements: {} }
            }
            )

            orbit_focus(ID)
        }

        function land_set()
        {
            land_START = land.offsetTop - window.innerHeight * .7
            land_END = land.scrollHeight + land_START - window.innerHeight * 1.75
        }

        function content_set()
        {
            orbit_setList.call(ORBIT_ORBITS[orbit_TARGET].content)
        
            wwindow.window_MOBILE ? competence_setEventMobile() : competence_setEventDesktop()
        }

        function content_setSubtitle() { this.subtitle = [...this.elements.subtitle.querySelectorAll('.char')] }

        function content_setLetters()
        {
            const LETTERS = [...this.elements.title.querySelectorAll('span')]

            this.letters = []

            for (let i = 0; i < LETTERS.length; i++)
                this.letters[i] =
                [
                    LETTERS[i],
                    window.innerWidth / 3 * (Math.round(Math.random()) ? 1 : -1),
                    window.innerHeight / 3 * (Math.round(Math.random()) ? 1 : -1),
                    window.innerHeight * (Math.round(Math.random()) ? 1 : -1)
                ]
        }

        function orbit_setList()
        {
            const
            WIDTH = window.innerWidth,
            LIS = [...this.elements.list.children]

            this.elements.lis = []

            for (let i = 0; i < ORBIT_ORBITS[orbit_TARGET].skills.length; i++)
            {
                const [TRANSLATEX, SPEED] = [Math.random() * WIDTH + WIDTH, Math.random() * 1.5 + .8]

                this.elements.lis[i] = { translateX: TRANSLATEX, speed: SPEED }

                content_MAX = Math.max(content_MAX, (TRANSLATEX + WIDTH + LIS[i].offsetWidth + 100) / SPEED)
            }
        }

        // --GET
        function comeptence_getSkills(tag)
        {
            const SKILLS = []
    
            for (const ARRAYOFSKILLS of COMPETENCE_SKILLS)
                for (const SKILL of ARRAYOFSKILLS)
                    if (SKILL.tags && SKILL.tags.includes(tag)) SKILLS.push(SKILL)

            return SKILLS
        }

        // --RESET
        function competence_reset()
        {
            competence_OFFSETTOP = competence.parentNode.offsetTop
            competence_HEIGHT = competence.offsetHeight + window.innerHeight / 2

            orbit_set()
            land_set()
        }

        function content_reset()
        {
            content_MAX = 0
            content_TRANSLATEX = 0
        }

        // --UPDATE
        function competence_update(now, scroll)
        {
            const GAP = competence_updateElement()
    
            orbit_ANIMATE = !scroll && GAP > 0 && GAP < competence_HEIGHT

            competence_LAST = now
        }

        function competence_updateElement()
        {
            const GAP = event.main_scrollTop - competence_OFFSETTOP
    
            ;[space_RATIO, space_TRANSLATEY, scene_SCALE, orbit_Y] = GAP > 0
            ?   GAP < competence_HEIGHT
                ? [...(GAP >= land_START
                    ? [.3, -100, 1]
                    : [1, 0, 1.5])
                  , GAP / competence_HEIGHT * 5]
                : [.3, -100, 1, 5]
            : [1, 0, 1.5, 0]

            sky_TRANSLATEX = GAP > land_END ? GAP - land_END : 0

            return GAP
        }

        function orbit_update(on)
        {
            on ? (app.app_FREEZE.set(true), space_RATIO = .3) : app.app_FREEZE.set(false)

            tick().then(() => on ? content_set() : content_destroy())
        }

        function orbit_updateLetter(e, x, y, z) { e.style.transform = `translate3d(${x ?? 0}px, ${y ?? 0}px, ${z ?? 0}px)` }

        function orbit_updateSubtitle(i, unwind)
        {
            const LETTER = this.subtitle[i]
            
            unwind ? LETTER.textContent = LETTER.dataset.char : LETTER.innerHTML = '&nbsp;'
        }

        function content_update(value)
        {
            orbit_Y += value > 0 ? .05 : -.05

            content_TRANSLATEX += value

            if (content_TRANSLATEX > content_MAX || content_TRANSLATEX < 0) orbit_click({ detail: { id: null } })
        }

        function content_updateMobile(now, clientX)
        {
            content_update(content_LASTX - clientX)

            content_LASTX = clientX
            content_LAST = now
        }

        // --DESTROY
        function competence_destroy()
        {
            event.event_remove('scroll', competence_scroll)
            event.event_remove('resize', competence_resize)
           
            competence_destroyEventDesktop()
            competence_destroyEventMobile()
        }

        function competence_destroyEventDesktop() { event.event_remove('wheel', competence_wheel) }

        function competence_destroyEventMobile() { event.event_remove('touchMove', competence_touchMove) }

        function orbit_destroyCustom()
        {
            tick().then(() => ORBIT_ORBITS.pop())
            
            orbit_CUSTOM.set(false)

            app.app_TRANSITION.set(true)

            setTimeout(() =>
            {
                event.event_scrollTo(router.router_PAGES[3].start)

                app.app_TRANSITION.set(false)
                app.app_FREEZE.set(true)
            }, 400)
        }

        function content_destroy()
        {
            competence_updateElement()

            competence_MOBILE ? competence_destroyEventMobile() : competence_destroyEventDesktop()
        }

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
            const NOW = +new Date()

            clearTimeout(competence_TIMEOUT)

            NOW > competence_LAST + 100
            ? competence_update(NOW, true)
            : competence_TIMEOUT = setTimeout(competence_update.bind(null, +new Date(), false), 100)
        }

        async function competence_wheel(deltaY) { content_update(deltaY) }

        async function competence_touchMove(clientX)
        {
            const NOW = +new Date()

            clearTimeout(content_TIMEOUT)
    
            NOW > content_LAST + 100
            ? content_updateMobile(NOW, clientX)
            : content_TIMEOUT = setTimeout(content_updateMobile.bind(null, NOW, clientX), 100)
        }

        async function competence_touchStart(e) { if (orbit_TARGET != undefined) content_LASTX = e.changedTouches[0].clientX }

        async function competence_resize()
        {
            competence_reset()

            router.router_updatePageStart(COMPETENCE_ID, competence_OFFSETTOP)

            if (orbit_TARGET != undefined) orbit_click({ detail: { id: null } })
        }

        function orbit_click({detail})
        {
            content_reset()

            if (orbit_TARGET != undefined && orbit_TARGET !== detail.id) ORBIT_ORBITS[orbit_TARGET].on = false

            orbit_TARGET = detail.on ? detail.id : null
    
            orbit_update(detail.on)
        }

        // --CLEAR
        function content_clearAnimation(frameId) { cancelAnimationFrame(frameId) }

        // --TEST
        function content_testEnd(end, unwind)
        {
            return unwind
            ? ++end >= this.subtitle.length
                ? this.subtitle.length - 1
                : end
            : --end < 0
                ? 0
                : end
        }

        // --TRANSITION
        function content_fade() { return { duration: COMPETENCE_DURATION, css: (t) => `opacity: ${t}` } }

        // --ANIMATIONS
        function orbit_animation(animate) { if (competence) for (const ORBIT of ORBIT_ORBITS) ORBIT[animate ? 'animation' : 'clear']() }

        async function content_animationLetterGather()
        {
            for (const LETTER of this.letters)
                orbit_updateLetter(...LETTER),
                requestAnimationFrame(() => orbit_updateLetter(LETTER[0]))
        }

        async function content_animationWriting(start, end, i, j, unwind)
        {
            this.frameId = requestAnimationFrame(() =>
            {
                for (let u = start; unwind ? u < end : u > end; unwind ? u++ : u--)
                    this.subtitle[u].textContent = [' ', unwind ? '>' : '<'][Math.floor(Math.random() * 2)]

                if (++i === 8)
                    i = 0, end = content_testEnd.call(this, end, unwind)
                if (++j === 14)
                {
                    j = 0

                    orbit_updateSubtitle.call(this, start, unwind)

                    if ((unwind ? start++ : start--) === end) return
                }

                content_animationWriting.call(this, start, end, i, j, unwind)
            })
        }

        async function content_animationShatter() { for (const LETTER of this.letters) orbit_updateLetter(...LETTER) }

        // --INTRO-OUTRO
        function content_introstart()
        {
            content_setSubtitle.call(this)

            content_clearAnimation(this.frameId)

            if (orbit_TARGET != undefined)
                content_setLetters.call(this),
                content_animationLetterGather.call(this)

            content_animationWriting.call(this, 0, 1, 0, 0, true)
        }

        function content_outrostart()
        {
            if (!this.subtitle) return

            const LENGTH = this.subtitle.length
    
            content_clearAnimation(this.frameId)

            if (this.letters) content_animationShatter.call(this)

            content_animationWriting.call(this, LENGTH - 1, LENGTH - 2, 0, 0, false)
        }

        function content_outroend(custom) { if (custom && orbit_TARGET == undefined) orbit_destroyCustom() }

        // --UTIL
        function orbit_focus(id)
        {
            app.app_FREEZE.set(false)
            event.event_scrollTo(competence_OFFSETTOP + window.innerHeight)

            setTimeout(() =>
            {
                ORBIT_ORBITS[id].on = true
                orbit_click({ detail: { id: id, on: true } })
            }, 50)
        }

    // #CYCLES

    onMount(competence_set)
    onDestroy(competence_destroy)
</script>

<!-- #HTML -->

<div
id="competence"
bind:this={competence}
on:touchstart={competence_touchStart}
>
    <div
    class="track"
    >
        <div
        style:--duration="{COMPETENCE_DURATION}ms"
        >
            {#each ORBIT_ORBITS as orbit (orbit.props._id)}
                {#if orbit.on}
                    <div
                    class="content"
                    transition:content_fade
                    on:introstart={content_introstart.bind(orbit.content)}
                    on:outrostart={content_outrostart.bind(orbit.content)}
                    on:outroend={content_outroend.bind(null, $orbit_CUSTOM)}
                    >
                        <section>
                            <h2
                            bind:this={orbit.content.elements.title}
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
                            bind:this={orbit.content.elements.subtitle}
                            >
                                {#each (orbit.title[0] + (orbit.title.length > 1 ? ' . ' + orbit.title.slice(1).toString().replaceAll(',', ' ') : '')) as char}
                                    <span
                                    class:char={char !== ' '}
                                    data-char={char}
                                    >&nbsp;</span>
                                {/each}
                            </p>
                        </section>

                        <div>
                            <ul
                            bind:this={orbit.content.elements.list}
                            >
                                {#each orbit.skills as skill, i}
                                    <li
                                    style:transform="translateX({orbit.content.elements.lis
                                    ? orbit.content.elements.lis[i].translateX - content_TRANSLATEX * orbit.content.elements.lis[i].speed
                                    : -content_TRANSLATEX}px)"
                                    >
                                        <p>{skill.text}</p>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                {/if}

                {#if !$orbit_CUSTOM && orbit.focus && space_RATIO === 1}
                    <p
                    class="thematic"
                    bind:this={orbit.thematic.elements.subtitle}
                    transition:content_fade
                    on:introstart={content_introstart.bind(orbit.thematic)}
                    on:outrostart={content_outrostart.bind(orbit.thematic)}
                    >
                        {#each (orbit.title[0] + (orbit.title.length > 1 ? ' . ' + orbit.title.slice(1).toString().replaceAll(',', ' ') : '')) as char}
                            <span
                            class:char={char !== ' '}
                            data-char={char}
                            >&nbsp;</span>
                        {/each}
                    </p>
                {/if}
            {/each}

            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <div
            class="space"
            style:transform="scale({space_$SCALE}) translateY({space_TRANSLATEY}%)"
            >
                <Moon
                {_colors}
                />

                {#each ORBIT_ORBITS as orbit}
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

            {#if orbit_TARGET != undefined}
                <p
                class="info"
                >
                    SCROLL
                </p>
            {/if}

            <p
            class="section-info"
            >
                COMPÉTENCES
            </p>
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
    @use '../../assets/scss/styles/media' as *;

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

                .info { @include p-info(top); }
                .section-info { @include p-info; }
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
                    @include h-(rgba($light, .1), 90px, .9);

                    perspective: 100vh;

                    letter-spacing: 10px;

                    div
                    {
                        @include flex;

                        transform-style: preserve-3d;
                    }

                    @include media-min(768px, 768px) { @include h-(rgba($light, .1), 190px, 1); }
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

                ul
                {
                    @include flex;
                    @include f-column;
                    @include any;

                    justify-content: space-between;

                    transform: translateX(100%);

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

        .thematic
        {
            @include absolute;
            @include p-content;
            @include no-event;

            top: 50%;
            left: 50%;

            z-index: 1;

            color: $primary;
            user-select: none;
        }

        .land
        {
            @include absolute;
            @include any-w;

            bottom: 0;
            left: 0;

            height: 400vh;
        }
    }
</style>