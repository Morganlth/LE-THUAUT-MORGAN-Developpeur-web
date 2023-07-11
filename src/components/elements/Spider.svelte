<!-- #SCRIPT -->

<script>
    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTES

        // --ELEMENT-CANVAS
        const points = []

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
            setCanvas()
            setPoints()
        }

        function setCanvas()
        {
            canvas.width = (width = window.innerWidth)
            canvas.height = (height = window.innerHeight)
        
            context = canvas.getContext('2d')
        }

        function setPoints()
        {
            for (let i = 0; i < 50; i++)
            {
                const
                x = Math.random() * width,
                y = Math.random() * height,
                r = Math.random() * 2 + 1

                points.push({ x: x, y: y, r: r, a: .5 })
            }
        }

        // --DRAW
        function draw()
        {
            drawBackground()
            drawPoints()
        }

        function drawBackground()
        {
            context.fillStyle = 'black'
            context.rect(0, 0, width, height)
            context.fill()
        }

        function drawPoints()
        {
            // context.fillStyle = `rgba`
            for (const point of points)
            {

            }
        }

        // --ANIMATION
        function animate()
        {
            requestAnimationFrame(() =>
            {
                draw()
                animate()
            })
        }
    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
class="spider"
>
    <canvas
    style:width="{width}px"
    style:height="{height}px"
    bind:this={canvas}
    >

    </canvas>
</div>

<!-- #STYLE -->

<style
lang="scss"
>

</style>