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
            height = window.innerHeight * .3 // 30vh

            canvas.width = width
            canvas.height = height

            context = canvas.getContext('2d')
            context.lineWidth = 10

            w_10 = width * .1
            h_10 = height * .1

            draw()

            // console.log()
        }

        // --DRAW
        function draw()
        {
            const [r, g, b] = _colors.sLight.match(/\w\w/g).map(x => parseInt(x, 16))

            let
            h = height - Math.random() * h_10 * 2 - h_10 * 3,
            h_95 = h_10 * 9.5,
            mid = false
        
            for (let i = 0; i < 20; i++)
            {
                drawTree(i < 10, h, r, g, b)

                if (!mid && i === 10)
                {
                    h = height - Math.random() * h_10 * 2 - h_10 * 3
                    mid = true
                }

                h < h_95 ? h += Math.random() * h_10 : h = h_95
            }
        }

        function drawTree(left, h, r, g, b)
        {
            const
            x = Math.random() * w_10 * 4 + (left ? -w_10 * 2 : w_10 * 7),
            y = Math.random() * h_10 * 5,
            w = Math.random() * w_10 * .3 + w_10 * .3,
            s = x + w / 2

            context.beginPath()
            context.moveTo(s, y)
            context.lineTo(x + w, h)
            context.lineTo(x, h)
            context.fillStyle = _colors[Math.round(Math.random()) ? 'secondary' : 'secondary']
            context.fill()
            context.closePath()

            context.beginPath()
            context.moveTo(s, h)
            context.lineTo(s, h + h_10 / 2)
            context.strokeStyle = `rgba(${r}, ${g}, ${b}, .6)`
            context.stroke()
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
        
        top: 50%;
        left: 0;
    }
</style>