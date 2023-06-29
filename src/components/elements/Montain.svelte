<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #VARIABLES

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        width,
        height

        // --SIZES-10-PERCENT
        let
        w_10,
        h_10

    // #FUNCTIONS

        // --SET
        function set()
        {
            width = window.innerWidth
            height = window.innerHeight * .7 // 70vh

            canvas.width = width
            canvas.height = height

            context = canvas.getContext('2d')
            context.lineWidth = 2
            context.strokeStyle = _colors.sDark
            context.fillStyle = _colors.sLight

            w_10 = width * .1
            h_10 = height * .1

            draw()
        }

        // --DRAW
        function draw()
        {
            let y = height - Math.random() * h_10 * .5 - h_10 / 3

            for (let i = 0; i < 8; i++)
            {
                i === 4
                ? y = height - Math.random() * h_10 * .5 - h_10 / 3
                : y += Math.random() * h_10 / 4
    
                drawMontain(i < 4, y)
            }

            y = height + 3

            for (let i = 0; i < 4; i++) drawMontain(i < 2, y, true)
        }

        function drawMontain(left, y, small)
        {
            const
            x = Math.random() * w_10 * 4 + (left ? -w_10 : w_10 * 7),
            w = (Math.random() * w_10 * 3 + w_10 * 2) / (small ? 3 : 1),
            h = (Math.random() * h_10 * 4 + h_10 * 3) / (small ? 3 : 1),
            s = x + Math.random() * w_10 / 2 * (left ? -1 : 1)
    
            drawTriangle(x, y, w, h, s)
        }

        function drawTriangle(x, y, w, h, s)
        {
            context.beginPath()
            context.moveTo(x - w / 2, y)
            context.lineTo(s, y - h)
            context.lineTo(x + w / 2, y)
            context.fill()
            context.stroke()
            context.closePath()
        }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
class="montain"
>
    <canvas
    style:width="{width}px"
    style:height="{height}px"
    bind:this={canvas}
    >
    </canvas>
</div>