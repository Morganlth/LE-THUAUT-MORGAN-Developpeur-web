<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _subPath,
        _colors

    // #IMPORTS

        // --CONTEXTS
        import { app } from '../field/Main.svelte'
        import { event } from '../field/Main.svelte'
        import { router } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

        // --COMPONENT-PAGES
        import Booki from '../pages/Booki.svelte'
        import SophieBluel from '../pages/SophieBluel.svelte'
        import NinaCarducci from '../pages/NinaCarducci.svelte'

        // --COMPONENT-ELEMENT
        import Card from '../elements/Card.svelte'

    // #CONSTANTE
    
        // --TO-ITERATE
        const cards =
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
                    width: '50%',
                    height: 'auto'
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
                    width: '50%',
                    height: 'auto'
                }
            },
            {}, {}, {}, {}, {}, {}, {}]

    // #VARIABLES

        // --GLOBAL
        let
        frameId = null,
        size,
        sizeBy2,
        offsetTop,
        last = +new Date(),
        timeout = null

        // --ELEMENT-PROJECT
        let project

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        particles,
        [r, g, b] = _colors.dark.match(/\w\w/g).map(x => parseInt(x, 16)),
        a = 1,
        s = 1,
        angle = 0

        // --ELEMENT-TRACK
        let
        track,
        rotate,
        translateX,
        translateY,
        overflowX,
        overflowY

        // --ELEMENT-CARD-CONTAINER
        let
        cardWidth,
        cardHeight,
        radius,
        translateZ,
        rotateY = 0,
        target = 0,
        cardTimeout

    // #FUNCTIONS

// canvas animation inspired from : https://codepen.io/chriscourses/pen/poyEEojs

        // --SET
        function set()
        {
            setVar()
            setCanvas()
            setTrack()
            setCardContainer()
            setEvent()
            setRouter()
        }

        function setVar()
        {
            const
            width = window.innerWidth,
            height = window.innerHeight
    
            size = Math.sqrt(width * width + height * height)
            sizeBy2 = size / 2

            offsetTop = project.offsetTop + project.parentNode.offsetTop + height
        }

        function setCanvas()
        {
            canvas.width = size
            canvas.height = size
    
            context = canvas.getContext('2d')
            context.shadowBlur = 16
            
            setParticles()
        }

        function setParticles()
        {
            particles = []

            for (let i = 0; i < 100; i++)
            {
                const
                x = Math.random() * size - sizeBy2,
                y = Math.random() * size - sizeBy2,
                r = Math.random() * 5 + 3,
                c = _colors[Math.round(Math.random()) ? 'primary' : 'secondary']
            
                particles.push({ x: x, y: y, r: r, c: c })
            }
        }

        function setTrack()
        {
            rotate = Math.atan(window.innerHeight / window.innerWidth) / Math.PI * 180
            translateX = (size - window.innerWidth) / 2
            translateY = -50
        }

        function setCardContainer()
        {
            cardWidth = window.innerWidth * .52
            cardHeight = window.innerHeight * .5

            radius = cardWidth / 2 / Math.tan(18 * Math.PI / 180)
            translateZ = radius

            setDecagon()
        }

        function setDecagon()
        {
            let [tZ, tX, rY] = [-radius, 0, 0]

            for (let i = 0; i < cards.length; i++)
            {
                if (i)
                {
                    tX -= cardWidth - Math.cos(rY * Math.PI / 180) * cardWidth
                    tZ -= Math.sin(rY * Math.PI / 180) * cardWidth
                    rY -= 36
                }
        
                cards[i] = { ...cards[i], translateX: tX, translateZ: tZ, rotateY: rY }
            }
        }

        function setEvent() { event.add('wheel', project_wheel) }

        function setRouter()
        {
            router.router_add(3, 'project', offsetTop, project_call)

            if (_subPath)
                for (let i = 0; i < cards.length; i++)
                    if (cards[i].subPath === _subPath)
                    {
                        target = i
                        rotateY += 36 * i
                        
                        return card_click({ detail: { id: i, on: true }})
                    }
        }

        // --UPDATE
        function update(on)
        {
            cards[target].on = on
            cards[target].update(on)

           router.router_setSubPath(3, on ? cards[target].subPath : null)
           router.router_update()
        }

        // --DESTROY
        function destroy()
        {
            destroyEvent()
            destroyFrame()
        }

        function destroyEvent() { event.remove('wheel', project_wheel) }

        function destroyFrame()
        {
            if (frameId)
            {
                cancelAnimationFrame(frameId)
                frameId = null

                if (rotateY >= 360) rotateY %= 360
            }
        }

        // --EVENTS
        async function project_wheel(deltaY, target)
        {
            const scrollTop = target.scrollTop

            if (scrollTop >= offsetTop - size)
            {
                if (!frameId) animate()

                if (deltaY > 0 && scrollTop >= offsetTop) move()
            }
            else destroyFrame()
        }

        function card_click({detail})
        {
            if (detail.id === target)
            {
                clearTimeout(cardTimeout)
    
                app.freeze.set(detail.on)

                ;(detail.on ? show : hidden)()
            }
        }

        // --ROUTER-CALL
        function project_call() { project_wheel(true, router.main) }

        // --DRAW
        function draw()
        {
            drawBackground()

            context.save()
            context.translate(sizeBy2, sizeBy2)
            context.rotate(angle += (0.001 * s))

            for (let i = 0; i < particles.length; i++) drawParticle.call(particles[i])

            context.restore()

            if (angle >= 2 * Math.PI) angle = 0
        }

        function drawBackground()
        {
            context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
            context.fillRect(0, 0, size, size)
        }

        function drawParticle()
        {
            context.beginPath()
            context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
            context.shadowColor = this.c
            context.fillStyle = this.c
            context.fill()
            context.closePath()
        }

        // --ANIMATION
        function animate()
        {
            frameId = requestAnimationFrame(animate)
           
            draw()

            if (timeout)
            {
                if (a > 0.05) a -= 0.01
                if (s < 5) s += 0.05
            }
            else
            {
                if (a < 1) a += 0.0005
                if (s > 1) s -= 0.05
            }
        }

        // --ACTIONS
        function move()
        {
            const now = +new Date()

            if (now > last + 200)
            {
                last = now
                rotateY += 36
                target = rotateY / 36 % 10

                clearTimeout(timeout), timeout = setTimeout(() => timeout = null, 400)
            }
        }

        function show()
        {
            destroyEvent()

            ;[rotate, translateX, translateY] = [0, 0, 0]

            cardTimeout = setTimeout(() =>
            {
                [translateZ, overflowX, overflowY] = [1, 'hidden', 'scroll']
    
                update(true)
            }, 400)
        }

        function hidden()
        {
            [translateZ, overflowX, overflowY] = [radius, 'visible', 'visible']

            update(false)
    
            cardTimeout = setTimeout(() => { setTrack(), setEvent() }, 400)
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<div
id="project"
bind:this={project}
>
    <canvas
    style:width="{size}px"
    style:height="{size}px"
    bind:this={canvas}
    >
    </canvas>

    <div
    class="container"
    style:overflow="{overflowX ?? 'visible'} {overflowY ?? 'visible'}"
    >
        <div
        class="track"
        style:perspective="{radius ?? 0}px"
        style:transform="rotate({rotate ?? 0}deg) translate({translateX ?? 0}px, {translateY ?? 0}%)"
        style:overflow={overflowX ?? 'visible'}
        bind:this={track}
        >
            <!-- le décalage avec le 'padding-right' est important pour etre centré par rapport aux cotés, ne pas utiliser 'border-box' sur cet element -->
            <div
            class="card-container"
            style:transform="translateZ({translateZ ?? 0}px) rotateY({rotateY ?? 0}deg)"
            style:width="{cardWidth ?? 0}px"
            style:height="{cardHeight ?? 0}px"
            >
                {#each cards as card, i}
                    <Card
                    _id={i}
                    _translateX={card.translateX}
                    _translateZ={card.translateZ}
                    _rotateY={card.rotateY}
                    _radius={radius}
                    _desc={card.desc}
                    _img={card.img}
                    bind:update={card.update}
                    on:click={card_click}
                    />
                {/each}
            </div>
        </div>

        <div
        class="content"
        >
            {#each cards as card}
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

    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/font.scss' as *;
    @use '../../assets/scss/styles/cursor.scss' as *;

    /* #GROUPS */

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

            z-index: -1;

            transform: translate(-50%, -50%);
        }

        .container
        {
            @include any-w;
    
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

        p
        {
            @include absolute;
            @include p-interact;

            bottom: 30px;
            left: 3%;
        }
    }
</style>