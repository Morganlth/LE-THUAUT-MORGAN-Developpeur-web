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
        import { onMount, onDestroy, tick } from 'svelte'

        // --COMPONENT-ELEMENTS
        import Moon from '../elements/Moon.svelte'
        import Orbit from '../elements/Orbit.svelte'
        import Scene from '../elements/Scene.svelte'
        import Sky from '../elements/Sky.svelte'

    // #CONSTANTES

    const duration = 900

        // --TO-ITERATE
        const orbits =
        [
            {
                props: { _id: 0, _rotate: -50, _offset: 0 },
                title: ['FORME', 'STYLE'],
                type: 'FRONT',
                content:
                [
                    'découper, assembler et intégrer tous les éléments d’une maquette graphique en HTML5 et CSS',
                    'ajouter du contenu audio et vidéo en HTML5',
                    'animer les pages web avec CSS3',
                    'construire un projet impliquant SCSS et SASS'
                ]
            }
        ,
            {
                props: { _id: 1, _rotate: 80, _offset: 4.71 },
                title: ['LOGIQUE', 'JAVASCRIPT'],
                type: 'FRONT',
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
                ]
            }
        ,
            {
                props: { _id: 2, _rotate: 40, _offset: 3.14 },
                title: ['CÔTÉ', 'SERVER'],
                type: 'BACK',
                content:
                [
                    'créer un nouveau projet NodeJS impliquant diverses dépendances (Express, MongoDB, jsonwebtoken...)',
                    'gérer les comptes utilisateurs',
                    'créer, gérer et afficher le contenu d’une base de données',
                    'créer des API (REST)',
                    'construire un projet avec SvelteKit'
                ]
            }
        ,
            {
                props: { _id: 3, _rotate: 10, _offset: 1.57 },
                title: ['ADAPTABILITÉ', 'RÉFÉRENCEMENT'],
                type: 'FRONT',
                content:
                [
                    'appliquer les standards du web et les normes en vigueur',
                    'construire un site web fluide s’adaptant à tout type d’écran (web, smartphone et tablette)',
                    'améliorer le référencement naturel en utilisant les balises selon leur sémantique',
                    'améliorer les performances et optimiser une page web',
                    'appliquer les Schema.org',
                    'utiliser les balises meta OPEN GRAPH des réseaux sociaux (og, twitter)'
                ]
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

        // --ELEMENT-SPACE
        let
        ratio = 1,
        translateY = 0

        // --ELEMENT-CONTENT
        let
        title,
        letters = [],
        list,
        listTranslateX = 0,
        listMax = 0

        // --ELEMENT-ORBIT
        let
        target = null,
        r,
        y,
        [red, green, blue] = _colors.light.match(/\w\w/g).map(x => parseInt(x, 16)),
        onColor = _colors.light,
        offColor = `rgba(${red}, ${green}, ${blue}, .1)`

        // --ELEMENT-LAND
        let
        land,
        show,
        resolution

        // --ELEMENT-SCENE
        let scaleScene = 0

        // --ELEMENT-DIE
        let number = 6

        // --ELEMENT-SKY
        let translate = 0

        // --EVENT
        let
        last = +new Date(),
        timeout

    // #REACTIVE

    $: scaleSpace = number / 6 * ratio // modifier cette partie pour que le dé retourne directement le calcul dans une variable scale sans réactivité

    // #FUNCTIONS

        // --SET
        function set()
        {
            setMain()
            setCompetence()
            setOrbit()
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
            height = competence.offsetHeight + innerHeight / 2
        }

        function setOrbit()
        {
            r = window.innerWidth / 2
            y = 1 /* set orbits positions */
        }

        function setLand()
        {
            show = land.offsetTop - window.innerHeight * .7
            resolution = land.scrollHeight + show - window.innerHeight
        }

        function setLetter()
        {
            const children = [...title.querySelectorAll('span')]

            for (let i = 0; i < children.length; i++)
            {
                letters[i] =
                {
                    letter: children[i],
                    translateX: window.innerWidth / 3 * (Math.round(Math.random()) ? 1 : -1),
                    translateY: window.innerHeight / 3 * (Math.round(Math.random()) ? 1 : -1),
                    translateZ: window.innerHeight * (Math.round(Math.random()) ? 1 : -1)
                }
            }
        }

        function setCommand() { app.add('spaceDimension', spaceDimension, true) }

        function setEvent() { event.add('scroll', competence_scroll) }

        function setRouter()
        {
            const start = competence.parentNode.offsetTop
    
            router.add(2, 'competence', start)
        }

        // --RESET
        function resetList()
        {
            listTranslateX = 0
            listMax = 0
        }

        // --UPDATE
        function update()
        {
            const gap = main.scrollTop - offsetTop
            
            ;[ratio, translateY, scaleScene] = gap >= show ? [.3, -100, 1] : [1, 0, 1.5]
            y = (gap > 0 ? gap < height ? gap / height : 1 : 0) * 5
            translate = gap > resolution ? gap - resolution : 0
        }

        function updateLetter(letter, x, y, z) { letter.style.transform = `translate3d(${x ?? 0}px, ${y ?? 0}px, ${z ?? 0}px)` }
    
        function updateList()
        {
            const
            children = [...list.children],
            ratioY = (window.innerHeight - 240) / children.length

            for (let i = 0; i < children.length; i++)
            {
                let
                translateX = Math.random() * window.innerWidth * 2 + window.innerWidth,
                translateY = Math.random() * ratioY + ratioY * i + 120

                listMax = Math.max(listMax, translateX + children[i].offsetWidth)
        
                children[i].style.transform = `translate(${translateX}px, ${translateY}px)`
            }

            listMax += window.innerWidth + 200
        }

        // --DESTROY
        function destroy()
        {
            event.remove('scroll', competence_scroll)
            event.remove('wheel', competence_wheel)
        }

        // --COMMAND
        function spaceDimension(n)
        {
            n = app.testDefault(n) ? 6 : app.testNumber(n, 1, 6)

            number = n
            localStorage.setItem('spaceDimension', n)
    
            app.success('spaceDimension ' + n)
        }

        // --EVENTS
        async function competence_scroll()
        {
            const now = +new Date()

            clearTimeout(timeout)

            if (now > last + 100) update(), last = now
            else timeout = setTimeout(update, 50)
        }

        async function competence_wheel(deltaY)
        {
            y += deltaY > 0 ? .05 : -.05

            listTranslateX -= deltaY * 2

            if (listTranslateX < -listMax || listTranslateX > 0) resetList(), orbit_click({ detail: { id: null } })
        }

        function orbit_click({detail})
        {
            event.remove('wheel', competence_wheel)
    
            if (target !== null && target !== detail.id) orbits[target].on = false
    
            tipping(detail.on)

            target = detail.id
        }

        // --TRANSITION
        function fade()
        {
            return {
                duration: duration,
                css: (t) => `opacity: ${t}`
            }
        }

        // --ANIMATIONS
        function gather()
        {
            setLetter()

            for (const l of letters)
            {
                updateLetter(l.letter, l.translateX, l.translateY, l.translateZ)
                requestAnimationFrame(() => updateLetter(l.letter))
            }
        }

        function shatter() { for (const l of letters) updateLetter(l.letter, l.translateX, l.translateY, l.translateZ) }

        // --UTIL
        function tipping(on)
        {
            [main.style.overflowY, ratio] = on ? ['hidden', .3] : ['scroll', 1]

            tick().then(() => on
            ?   (updateList(),
                event.add('wheel', competence_wheel))
            : update())
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
    class="track"
    >
        <div
        style:--duration="{duration}ms"
        >
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <div
            class="space"
            style:transform="scale({scaleSpace}) translateY({translateY}%)"
            >
                <Moon
                {_colors}
                />

                {#each orbits as orbit}
                    <Orbit
                    {...orbit.props}
                    _r={r}
                    _y={y}
                    _duration={duration}
                    _color={orbit.on ? onColor: offColor}
                    bind:on={orbit.on}
                    on:click={orbit_click}
                    />
                {/each}
            </div>

            <div
            class="content"
            >
                {#each orbits as orbit}
                    {#if orbit.on}
                        <section
                        transition:fade
                        on:introstart={gather}
                        on:outrostart={shatter}
                        >
                            <h3
                            bind:this={title}
                            >
                                {#each orbit.title as title}
                                    <div>
                                        {#each title as letter}
                                            <span
                                            style:transition="transform {Math.random() * duration / 2 + duration / 2}ms"
                                            >
                                                {letter}
                                            </span>
                                        {/each}
                                    </div>
                                {/each}
                            </h3>

                            <span>{orbit.type} . {orbit.title.toString().replaceAll(',', ' ')}</span>
                        </section>

                        <div>
                            <ul
                            style:transform="translateX({listTranslateX}px)"
                            bind:this={list}
                            >
                                {#each orbit.content as content}
                                    <li>
                                        <p>{content}</p>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>

    <div
    class="land"
    bind:this={land}
    >
        <Scene
        _scale={scaleScene}
        {_colors}
        bind:number={number}
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
    @use '../../assets/scss/styles/font.scss' as *;
    @use '../../assets/scss/styles/cursor.scss' as *;

    /* #GROUPS */

    #competence
    {
        @include relative;

        z-index: 1;

        width: 100vw;

        .track
        {
            @include any;

            overflow-y: clip;

            box-sizing: border-box;

            &
            >div
            {
                @include sticky(true);
                @include any-w;

                height: 100vh;
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
            @include xy-start(true);
            @include any;
            @include no-event;

            padding: 0px 40px;

            box-sizing: border-box;

            section
            {
                @include flex;
                @include f-column;
                @include f-j-center;
                @include relative;
                @include any;

                z-index: -1;

                h3
                {
                    @include title(rgba($light, .1), 190px, 190px);

                    perspective: 100vh;

                    letter-spacing: 10px;

                    div
                    {
                        @include flex;

                        transform-style: preserve-3d;
                    }
                }

                &
                >span
                {
                    @include font-command;

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

                transform: translateX(100%);

                ul
                {
                    @include flex;
                    @include f-column;
                    @include xy-start(true);
                    @include any;

                    justify-content: space-between;

                    padding: 120px;

                    box-sizing: border-box;

                    transition: transform .3s;

                    li { @include xy-start(true); }

                    p
                    {
                        @include text-command;

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