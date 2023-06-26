<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors
        
    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE

    const auraRadius = 10

    // #VARIABLES

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        size

        // #FUNCTIONS

            // --SET
            function set()
            {
                size = Math.min(window.innerWidth, window.innerHeight)*.9

                canvas.width = size
                canvas.height = size

                context = canvas.getContext('2d')

                draw()
            }

            // --GET
            function getRGB(color) { return color.match(/\w\w/g).map(x => parseInt(x, 16)) }
    
            function getBackground()
            {
                return new Promise(resolve =>
                {
                    const img = new Image()

                    img.src = './src/assets/images/glitch.jpg'

                    img.addEventListener('load', () => resolve(img))
                })
            }

            // --DRAW-CLEAR
            async function draw()
            {
                const
                [r, g, b] = getRGB(_colors.light),
                radius = size / 2,
                img = await getBackground()

                drawAura(radius, r, g, b)
                drawMoon(radius, img)
                drawCrescent(radius, r, g, b)
            }

            function drawAura(radius, r, g, b)
            {
                context.fillStyle = `rgba(${r}, ${g}, ${b}, .1)`
                drawCircle(radius, radius, radius)
                context.clip()
                context.save()
            }

            function drawMoon(radius, img)
            {
                const [r, g, b] = getRGB(_colors.dark)
    
                context.fillStyle = `rgba(${r}, ${g}, ${b}, .7)`
                drawCircle(radius, radius, radius - auraRadius)
                context.clip()
                context.drawImage(img, 0, 0, size, size)
                context.fill()
                context.restore()
            }

            function drawCrescent(radius, r, g, b)
            {
                const
                radius_3_4 = radius * .75,
                size_3_4 = size * .75
    
                context.fillStyle = _colors.dark
                context.globalCompositeOperation = 'destination-out'
                drawCircle(size_3_4, radius, radius_3_4)
                context.fillStyle = `rgba(${r}, ${g}, ${b}, .1)`
                context.globalCompositeOperation = 'source-over'
                drawCircle(size_3_4, radius, radius_3_4)

                context.fillStyle = _colors.dark
                context.globalCompositeOperation = 'destination-out'
                drawCircle(size_3_4, radius, radius_3_4 - auraRadius)
            }

            function drawCircle(x, y, r)
            {
                context.beginPath()
                context.arc(x, y, r, 0, 2 * Math.PI)
                context.fill()
                context.closePath()
            }

        // #CYCLE

        onMount(set)
</script>

<!-- #HTML -->

<div
class="moon"
>
    <canvas
    style:width="{size}px"
    style:height="{size}px"
    bind:this={canvas}
    >
    </canvas>
</div>