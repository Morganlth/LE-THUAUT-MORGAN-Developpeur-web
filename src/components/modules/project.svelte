<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _height,
        _colors

    // #IMPORTS

        // --CONTEXTS
        import { event } from '../field/Main.svelte'
        import { router } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

    // #CONSTANTES

        // --ELEMENNT-CARD-CONTAINER
        const gap = 100
    
        // --TO-ITERATE
        const cards = ['', '', '', '', '', '', '', '', '', '']

    // #VARIABLES

        // --GLOBAL
        let
        frameId = null,
        width,
        height,
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
        rotate = 0,
        translateX = 0

        // --ELEMENT-CARD-CONTAINER
        let
        translateZ = 0,
        rotateY = 0,
        cardWidth = 0,
        cardHeight = 0

    // #FUNCTIONS

// canvas animation inspired from : https://codepen.io/chriscourses/pen/poyEEojs

        // --SET
        function set()
        {
            setVar()
            setCanvas()
            setTrack()
            setEvent()
            setRouter()
        }

        function setVar()
        {
            width = window.innerWidth
            height = window.innerHeight
            size = Math.sqrt(width * width + height * height)
            sizeBy2 = size / 2

            offsetTop = project.offsetTop + project.parentNode.offsetTop + height - 5 // 5 pour une marge d'erreur dans les calculs (utile pour project_wheel avec scrollTop et offsetTop)
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
            setCardContainer()

            const widthAndGap = cardWidth + gap

            rotate = Math.atan(height / width) / Math.PI * 180
            translateX = (size - width + gap) / 2
            translateZ = widthAndGap / 2 / Math.tan(18 * Math.PI / 180)

            setDecagon(widthAndGap)
        }

        function setCardContainer()
        {
            cardWidth = width / 2
            cardHeight = height / 2
        }

        function setDecagon(widthAndGap)
        {
            const children = [...track.firstChild.children]
    
            let [tZ, tX, rY] = [-translateZ, 0, 0]

            for (let i = 0; i < children.length; i++)
            {
                if (i)
                {
                    tX -= widthAndGap - Math.cos(rY * Math.PI / 180) * widthAndGap
                    tZ -= Math.sin(rY * Math.PI / 180) * widthAndGap
                    rY -= 36
                }
        
                children[i].style.transform = `translateX(${tX}px) translateZ(${tZ}px) rotateY(${rY}deg)`
            }
        }

        function setEvent() { event.add('wheel', project_wheel) }

        function setRouter() { router.add(3, 'project', offsetTop, project_call) }

        // --DESTROY
        function destroy()
        {
            event.remove('wheel', project_wheel)
            
            destroyFrame()
        }

        function destroyFrame()
        {
            if (frameId)
            {
                cancelAnimationFrame(frameId)
                frameId = null

                if (rotateY >= 360) rotateY %= 360
            }
        }

        // --EVENT
        async function project_wheel(target, deltaY)
        {
            const scrollTop = target.scrollTop

            if (scrollTop >= offsetTop - size)
            {
                if (!frameId) animate()

                if (deltaY > 0 && scrollTop >= offsetTop) move()
            }
            else destroyFrame()
        }

        // --ROUTER-CALL
        function project_call() { project_wheel(router.main, true) }

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

        // --UTILS
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

        function move()
        {
            const now = +new Date()

            if (now > last + 200)
            {
                last = now
                rotateY += 36

                clearTimeout(timeout), timeout = setTimeout(() => timeout = null, 400)
            }
        }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<div
id="project"
style:height={_height}
bind:this={project}
>
    <canvas
    style:width="{size}px"
    style:height="{size}px"
    bind:this={canvas}
    >
    </canvas>

    <div
    class="track"
    style:transform="rotate({rotate}deg) translate({translateX}px, -50%)"
    bind:this={track}
    >
        <!-- le décalage avec le 'padding-right' est important pour etre centré par rapport aux cotés, ne pas utiliser 'border-box' sur cet element -->
        <div
        class="card-container"
        style:gap="{gap}px"
        style:transform="translateZ({translateZ}px) rotateY({rotateY}deg)"
        style:width="{cardWidth}px"
        style:height="{cardHeight}px"
        style:padding-right="{gap}px"
        >
            {#each cards as card}
                <div
                class="card"
                >
                </div>
            {/each}
        </div>
    </div>

    <p>INFINITY</p>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/font.scss' as *;

    /* #GROUPS */

    #project
    {
        @include flex;
        @include relative;

        align-items: flex-end;

        width: 100vw;

        overflow: clip;

        canvas
        {
            @include absolute;

            top: 75%;
            left: 50%;

            z-index: -1;

            transform: translate(-50%, -50%);
        }

        .track
        {
            @include f-center(true);
            @include any-w;

            perspective: 2000px;

            transform-origin: top left;

            height: 50%;

            & 
            >div
            {
                @include flex;

                transform-style: preserve-3d;

                transition: transform 0.3s;
            }
        }

        .card
        {
            @include any;

            flex-shrink: 0;

            transform-origin: left;

            background-color: $dark;

            border: solid $light 4px;

            box-sizing: border-box;
        }

        p
        {
            @include absolute;
            @include text-info;

            bottom: 30px;
            left: 3%;
        }
    }
</style>