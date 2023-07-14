<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

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
                props: { _id: 0, _rotate: -50 * Math.PI / 180, _offset: 0 },
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
                props: { _id: 1, _rotate: 80 * Math.PI / 180, _offset: 4.71 },
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
                props: { _id: 2, _rotate: 40 * Math.PI / 180, _offset: 3.14 },
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
                props: { _id: 3, _rotate: 10 * Math.PI / 180, _offset: 1.57 },
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
        max = 0,
        translateX = 0

        // --ELEMENT-ORBIT
        let
        target = null,
        animate = false,
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

    $: scaleSpace = number / 6 * ratio

    $: updateOrbits(animate)

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

        function setLetters()
        {
            const children = [...this.elementTitle.querySelectorAll('span')]

            this.letters = []

            for (let i = 0; i < children.length; i++)
            {
                this.letters[i] =
                {
                    letter: children[i],
                    translateX: window.innerWidth / 3 * (Math.round(Math.random()) ? 1 : -1),
                    translateY: window.innerHeight / 3 * (Math.round(Math.random()) ? 1 : -1),
                    translateZ: window.innerHeight * (Math.round(Math.random()) ? 1 : -1)
                }
            }
        }

        function setList()
        {
            const
            lis = [...this.list.children],
            width = window.innerWidth

            this.listDatas = []

            for (let i = 0; i < this.content.length; i++)
            {
                const
                translateX = Math.random() * width + width,
                speed = Math.random() * 1.5 + .8

                this.listDatas[i] = { translateX: translateX, speed: speed }

                max = Math.max(max, (translateX + width + lis[i].offsetWidth + 50) / speed)
            }
        }

        function setCommand() { app.add('spaceDimension', spaceDimension, true) }

        function setEvent() { event.add('scroll', competence_scroll) }

        function setRouter()
        {
            const start = competence.parentNode.offsetTop
    
            router.router_add(2, 'competence', start)
        }

        // --RESET
        function reset()
        {
            event.remove('wheel', competence_wheel)
    
            translateX = 0
            max = 0
        }

        // --UPDATE
        function update()
        {
            const gap = main.scrollTop - offsetTop
            
            ;[ratio, translateY, scaleScene] = gap >= show ? [.3, -100, 1] : [1, 0, 1.5]
    
            ;[y, animate] = gap > 0 ?
                gap < height
                ? [gap / height * 5, true]
                : [5, false]
            : [0, false]
    
            translate = gap > resolution ? gap - resolution : 0
        }

        function updateOrbits(animate) { if (competence) for (const orbit of orbits) orbit[animate ? 'animate' : 'clear']() }

        function updateLetter(letter, x, y, z) { letter.style.transform = `translate3d(${x ?? 0}px, ${y ?? 0}px, ${z ?? 0}px)` }

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

            translateX += deltaY

            if (translateX > max || translateX < 0) reset(), orbit_click({ detail: { id: null } })
        }

        function orbit_click({detail})
        {
            reset()

            if (target !== null && target !== detail.id) orbits[target].on = false

            target = detail.id
    
            tipping.call(orbits[target], detail.on)
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
        async function gather()
        {
            setLetters.call(this)

            for (const l of this.letters)
            {
                updateLetter(l.letter, l.translateX, l.translateY, l.translateZ)
                requestAnimationFrame(() => updateLetter(l.letter))
            }
        }

        async function writingAnimation(start, end, i, j, unwind)
        {
            this.frameId = requestAnimationFrame(() =>
            {
                for (let u = start; unwind ? u < end : u > end; unwind ? u++ : u--)
                    this.subtitleLetters[u].textContent = [' ', unwind ? '>' : '<'][Math.floor(Math.random() * 2)]

                if (++i === 10)
                {
                    i = 0

                    if (unwind) { if (++end >= this.subtitleLetters.length) end = this.subtitleLetters.length-1 }
                    else { if (--end < 0) end = 0 }
                }
                if (++j === 16)
                {
                    const letter = this.subtitleLetters[start]
            
                    unwind ? letter.textContent = letter.dataset.char : letter.innerHTML = '&nbsp;'

                    if ((unwind ? start++ : start--) === end) return
        
                    j = 0
                }

                writingAnimation.call(this, start, end, i, j, unwind)
            })
        }

        async function shatter() { for (const l of this.letters) updateLetter(l.letter, l.translateX, l.translateY, l.translateZ) }

        // --UTILS
        function tipping(on)
        {
            on ? (app.freeze.set(true), ratio = .3) : (app.freeze.set(false), ratio = 1)

            tick().then(() => on
            ?   (setList.call(this),
                event.add('wheel', competence_wheel))
            : update())
        }

        function introstart()
        {
            gather.call(this)

            cancelAnimationFrame(this.frameId)

            this.subtitleLetters = [...this.elementSubtitle.querySelectorAll('.char')]

            writingAnimation.call(this, 0, 1, 0, 0, true)
        }

        function outrostart()
        {
            shatter.call(this)

            cancelAnimationFrame(this.frameId)

            const length = this.subtitleLetters.length
    
            writingAnimation.call(this, length - 1, length - 2, 0, 0, false)
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
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
        style:--duration="{duration}ms"
        >
            {#each orbits as orbit}
                {#if orbit.on}
                    <div
                    class="content"
                    transition:fade
                    on:introstart={introstart.bind(orbit)}
                    on:outrostart={outrostart.bind(orbit)}
                    >
                        <section>
                            <h2
                            bind:this={orbit.elementTitle}
                            >
                                {#each orbit.title as title}
                                    <div>
                                        {#each title as char}
                                            <span
                                            style:transition="transform {Math.random() * duration / 2 + duration / 2}ms"
                                            >
                                                {char}
                                            </span>
                                        {/each}
                                    </div>
                                {/each}
                            </h2>

                            <p
                            bind:this={orbit.elementSubtitle}
                            >
                                {#each (orbit.type + ' . ' + orbit.title.toString().replaceAll(',', ' ')) as char}
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
                            bind:this={orbit.list}
                            >
                                {#each orbit.content as content, i}
                                    <li
                                    style:transform="translateX({orbit.listDatas
                                    ? orbit.listDatas[i].translateX - translateX * orbit.listDatas[i].speed
                                    : -translateX}px)"
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
                    _title={orbit.title.toString().replaceAll(',', ' ')}
                    _onColor={onColor}
                    _offColor={offColor}
                    bind:on={orbit.on}
                    bind:animate={orbit.animate}
                    bind:clear={orbit.clear}
                    on:click={orbit_click}
                    />
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
        height: calc(100% / 11 * 9);

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