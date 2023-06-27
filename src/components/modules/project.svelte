<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _height,
        _colors

    // #IMPORTS

        // #CONTEXTS
        import { event } from '../field/Main.svelte'
        import { router } from '../field/Main.svelte'

        // #SVELTE
        import { onMount, onDestroy } from 'svelte'

    // #CONSTANTES

    const
    PI2 = 2 * Math.PI,
    delay = 200,
    gap = 100,
    cards = ['', '', '', '', '', '', '', '', '', '']

    // #VARIABLES

    let project

    let
    frameId = null,
    width,
    height,
    size,
    offsetTop,
    last = +new Date(),
    timeout = null

    let
    track,
    cardWidth = 0,
    cardHeight = 0,
    rotate = 0,
    translateX = 0,
    translateZ = 0,
    rotateY = 0

    let
    canvas,
    context,
    particles,
    [r, g, b] = _colors.dark.match(/\w\w/g).map(x => parseInt(x, 16)),
    a = 1,
    s = 1,
    angle = 0

    // #FUNCTIONS

// code inspired from : https://codepen.io/chriscourses/pen/poyEEojs

    function set()
    {
        width = window.innerWidth
        height = window.innerHeight
        size = Math.sqrt(width * width + height * height)

        offsetTop = project.offsetTop + project.parentNode.offsetTop + height - 5 // 5 pour une marge d'erreur dans les calculs (utile pour project_wheel avec scrollTop et offsetTop)
    
        initTrack()
        initCanvas()
        setEvent()
        setRouter()
    }

    function setEvent()
    {
        event.add('wheel', project_wheel)
    }

    function setRouter() { router.add(3, 'project', offsetTop, project_call) }

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

    function initTrack()
    {
        cardWidth = width / 2
        cardHeight = height / 2

        const
        widthAndGap = cardWidth + gap,
        children = [...track.firstChild.children]

        rotate = Math.atan(height / width) / Math.PI * 180
        translateX = (size - width) / 2
        translateZ = widthAndGap / 2 / Math.tan(18 * Math.PI / 180)

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

    function initCanvas()
    {
        canvas.width = size
        canvas.height = size
        context = canvas.getContext('2d')
        particles = []

        for (let i = 0; i < 100; i++)
        {
            const
            sizeBy2 = size / 2,
            x = Math.random() * size - sizeBy2,
            y = Math.random() * size - sizeBy2,
            r = Math.random() * 3 + 3,
            c = _colors[Math.round(Math.random()) ? 'primary' : 'secondary']
        
            particles.push({ x: x, y: y, r: r, c: c })
        }
    }

    function animate()
    {
        frameId = requestAnimationFrame(animate)

        drawBackground()
        update()

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

    function drawBackground()
    {
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        context.fillRect(0, 0, size, size)
    }

    function drawParticle()
    {
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, PI2, false)
        context.shadowColor = this.c
        context.shadowBlur = 16
        context.fillStyle = this.c
        context.fill()
        context.closePath()
    }

    function update()
    {
        const sizeBy2 = size / 2

        context.save()
        context.translate(sizeBy2, sizeBy2)
        context.rotate(angle += (0.001 * s))

        for (let i = 0; i < particles.length; i++) drawParticle.call(particles[i])

        context.restore()

        if (angle >= PI2) angle = 0
    }

    function move()
    {
        const now = +new Date()

        if (now > last + delay)
        {
            last = now
            rotateY += 36

            clearTimeout(timeout), timeout = setTimeout(() => timeout = null, delay * 2)
        }
    }

    // #CYCLE

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
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/font.scss';

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