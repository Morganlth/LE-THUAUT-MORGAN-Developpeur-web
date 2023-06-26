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

        // --SIZES-20-PERCENT
        let
        w_20,
        h_20
        

    // #FUNCTIONS

        // --SET
        function set()
        {
            width = window.innerWidth
            height = window.innerHeight * .7 // 70vh

            canvas.width = width
            canvas.height = height

            context = canvas.getContext('2d')

            w_20 = width * .2
            h_20 = height * .2

            draw()
        }

        // --DRAW
        function draw()
        {
            const [r, g, b] = _colors.sLight.match(/\w\w/g).map(x => parseInt(x, 16))
    
            let
            a = 0.7,
            h = h_20 * 4 + Math.random() * h_20

            for (let i = 0; i < 8; i++)
            {
                drawMontain(i < 4, h, r, g, b, a)

                if (a >= 1)
                {
                    a = 0.7
                    h = h_20 * 4 + Math.random() * h_20
                }
                else
                {
                    a += 0.1
                    h += Math.random() * h_20 / 4
                }
            }
        }

        function drawMontain(left, h, r, g, b, a)
        {
            const
            x = Math.random() * w_20 + (left ? -w_20 / 2 : w_20 * 3),
            y = Math.random() * h_20 * 2 + h_20,
            w = Math.random() * w_20 + w_20,
            s = x + (w + Math.random() * w_20 / 2 * (left ? -1 : 1)) / 2
    
            context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
            context.beginPath()
            context.moveTo(s, y)
            context.lineTo(x, h)
            context.lineTo(x + w, h)
            context.fill()
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