<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE

    const [r, g, b] = _colors.sLight.match(/\w\w/g).map(x => parseInt(x, 16))

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
            height = window.innerHeight * .3 // 30vh

            canvas.width = width
            canvas.height = height

            context = canvas.getContext('2d')
            context.lineWidth = .5
            context.strokeStyle = _colors.sDark

            w_10 = width * .1
            h_10 = height * .1

            draw()
        }

        // --DRAW
        function draw()
        {
            const max = Math.floor(Math.random() * 7) + 10
        
            let
            y = height - Math.random() * h_10 - h_10 * 2,
            mid = false
        
            for (let i = 0; i < max * 2; i++)
            {
                if (!mid && i === max)
                {
                    console.log('reset')
                    y = height - Math.random() * h_10 - h_10 * 2
                    mid = true
                }

                drawTree(i < max, y)

                y < h_10 * 9.5 ? y += Math.random() * h_10 / 3 : y = h_10 * 9.5
            }
        }

        function drawTree(left, y)
        {
            const
            x = Math.random() * w_10 * 4 + (left ? -w_10 * .3 : w_10 * 6.3),
            w = Math.random() * w_10 * .2 + w_10 * .3,
            h = Math.random() * h_10 * 3 + h_10 * 4.5

            drawFoliage(x, y, w, h)
            drawTrunk(x, y)
        }

        function drawFoliage(x, y, w, h)
        {
            context.beginPath()
            context.moveTo(x - w / 2, y)
            context.lineTo(x, y - h)
            context.lineTo(x + w / 2, y)
            context.fillStyle = _colors.secondary
            context.fill()
            context.fillStyle = `rgba(${r}, ${g}, ${b}, .3)`
            context.fill()
            context.stroke()
            context.closePath()
        }

        function drawTrunk(x, y)
        {
            const h_04 = h_10 * .4
    
            context.fillStyle = `rgba(${r}, ${g}, ${b}, .6)`
            context.beginPath()
            context.rect(x - 5, y, 10, Math.random() * h_04 + h_04)
            context.fill()
            context.closePath()
        }
    
    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
class="forest"
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
    /* #USE */

    @use '../../assets/scss/styles/position.scss' as *;

    /* #GROUP */

    .forest
    {
        @include absolute;
        
        top: 60vh;
        left: 0;
    }
</style>