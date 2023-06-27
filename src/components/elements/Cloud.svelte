<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _translateX = 0,
        _colors

    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE

    const speed = Math.random() + .5

    // #VARIABLES

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        width,
        height

    // #FUNCTIONS

        // --SET
        function set()
        {
            width = window.innerWidth
            height = window.innerHeight
    
            canvas.width = width
            canvas.height = height

            context = canvas.getContext('2d')
    
            draw()
        }

        // --DRAW
        function draw()
        {
            const
            a = Math.floor(Math.random() * 150) + 150,
            b = Math.floor(Math.random() * 30) + 20,
            x = Math.random() * (width - 2 * a) + a,
            y = Math.random() * (height - 360) + 180
            
            drawCloud(a, b, x, y)
            drawEllipse(a, b, x, y)
        }

        function drawCloud(a, b, x, y)
        {
            let
            pX = -a + Math.random() * 20,
            d = 1

            while (true)
            {
                const
                pY = (Math.sqrt((1 - (pX * pX) / (a * a)) * b * b) + Math.random() * 60) * d,
                r = Math.random() * 50 + 50

                draw2Circles(x + pX, y + pY, r, d)

                pX += (r + Math.random() * 60) * d

                if (pX > a) pX = a - Math.random() * 20, d = -1
                if (pX < -a) break
            }
        }

        function draw2Circles(x, y, r, d)
        {
            const
            gapX = (Math.random() * 1 + 1) * d,
            gapY = (Math.random() * 1 + 1) * d

            context.fillStyle = _colors.light
            drawCircle(x + gapX, y + gapY, r + .5)
            context.fillStyle = _colors.dark
            drawCircle(x, y, r)
        }

        function drawCircle(x, y, r)
        {
            context.beginPath()
            context.arc(x, y, r, 0, 2 * Math.PI)
            context.fill()
            context.closePath()
        }

        function drawEllipse(a, b, x, y)
        {
            context.beginPath()
            context.ellipse(x, y, a, b + 60, 0, 0, 2 * Math.PI)
            context.fill()
            context.closePath()
        }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
class="cloud"
style:transform="translateX({_translateX * speed}px)"
>
    <canvas
    bind:this={canvas}
    style:width="{width}px"
    style:height="{height}px"
    >
    </canvas>
</div>

<!-- #STYLE -->

<style>
    .cloud
    {
        position: absolute;

        transition: transform .3s;
    }
</style>