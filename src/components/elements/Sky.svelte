<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTES

    const [r, g, b] = _colors.light.match(/\w\w/g).map(x => parseInt(x, 16))

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
            height = window.innerHeight * .7

            canvas.width = width
            canvas.height = height

            context = canvas.getContext('2d')
            // context.lineWidth = 3
            // context.strokeStyle = `rgba(${r}, ${g}, ${b}, .5)`
            context.fillStyle = _colors.dark
            
            // `rgba(${r}, ${g}, ${b}, .1)`
            // console.clear()
            const max = Math.random() * 5 + 10
            // const max = 1
    
            for (let i = 0; i < max; i++) draw()
            // console.log()
        }

        // --DRAW
        async function draw()
        {
            const
            a = Math.floor(Math.random() * 150) + 150,
            b = Math.floor(Math.random() * 20) + 20,
            x = Math.random() * width,
            y = Math.random() * (height - 8 * b) + 4 * b
            
            let
            pX = -a + Math.random() * 20,
            d = 1,
            delay = 100

            while (true)
            {
                const
                pY = (Math.sqrt((1 - (pX * pX) / (a * a)) * b * b) + Math.random() * 30) * d,
                r = Math.random() * 40 + 40

                await new Promise(resolve =>
                {
                    setTimeout(() =>
                    {
                        drawCircle(x + pX, y + pY, r, d)
                        resolve()
                    }, delay)
                })

                // console.log((a + x) + ' - ' + (b + y * d) + ' ---- ' + x + ' - ' + y)

                pX += (r + Math.random() * 40) * d

                if (pX > a) pX = a, d = -1
                if (pX < -a) break
            }

            context.beginPath()
            context.ellipse(x, y, a, b + 30, 0, 0, 2 * Math.PI)
            context.fill()
            context.closePath()
        }

        function drawCircle(x, y, radius, d)
        {
            context.beginPath()
            context.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
            context.arc(x + (2 * d), y + (2 * d), radius, 0, 2 * Math.PI)
            context.fill()
            context.closePath()

            context.beginPath()
            context.fillStyle = _colors.dark
            context.arc(x, y, radius, 0, 2 * Math.PI)
            context.fill()
            // Math.random() > (d === -1 ? .7 : .5) ? context.stroke() : null
            context.closePath()
        }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
class="sky"
>
    <canvas
    bind:this={canvas}
    style:width={width}
    style:height={height}
    >
    </canvas>
</div>

<!-- #STYLE -->

