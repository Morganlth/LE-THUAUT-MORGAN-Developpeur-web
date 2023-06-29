<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORT

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTES

        // --COLOR
        const [r, g, b] = _colors.sLight.match(/\w\w/g).map(x => parseInt(x, 16))

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
            context.lineWidth = 4
            context.strokeStyle = _colors.sDark
            context.fillStyle = _colors.sLight

            draw()
            // console.log()
        }

        // --DRAW
        function draw()
        {
            generateMontain()
            generateForest()
        }

        function drawMontain(left, y, small)
        {
            const
            x = Math.random() * width * .4 + (left ? -width * .1 : width * .7),
            w = (Math.random() * width * .3 + width * .2) / (small ? 3 : 1),
            h = (Math.random() * height * .25 + height * .2) / (small ? 3 : 1),
            s = x + Math.random() * width * .05 * (left ? -1 : 1)
    
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

        function drawTree(left, y)
        {
            const
            x = Math.random() * width * .4 + (left ? -width * .03 : width * .63),
            w = Math.random() * width * .01 + width * .04,
            h = Math.random() * height * .05 + height * .15

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
            const h_01 = height * .01
    
            context.fillStyle = `rgba(${r}, ${g}, ${b}, .6)`
            context.beginPath()
            context.rect(x - 5, y, 10, Math.random() * h_01 + h_01)
            context.fill()
            context.closePath()
        }

        // --GENERATE
        function generateMontain()
        {
            let y = Math.random() * height * .03 + height * .6

            for (let i = 0; i < 8; i++)
            {
                if (i === 4) y = Math.random() * height * .03  + height * .6
                
                y += Math.random() * height * .03

                drawMontain(i < 4, y)
            }

            y = height * .7

            for (let i = 0; i < 4; i++) drawMontain(i < 2, y, true)
        }

        function generateForest()
        {
            const max = Math.floor(Math.random() * 7) + 7
        
            let y = Math.random() * height * .03 + height * .75
        
            for (let i = 0; i < max * 2; i++)
            {
                if (i === max) y = Math.random() * height * .03 + height * .75
                
                y += Math.random() * height * .2 / max

                drawTree(i < max, y)
            }
        }
    

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
class="decor"
>
    <div
    class="background"
    >
        <div></div>
        <div></div>
    </div>

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
    /* #USES */

    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/background.scss' as *;

    /* #GROUPS */

    .decor
    {
        @include any;

        .background
        {
            @include absolute;
            @include any;

            z-index: -1;

            div:nth-child(1)
            {
                @include neon;
            }

            div:nth-child(2)
            {
                @include absolute;
                @include any-w;

                bottom: 0;
                left: 0;

                height: 40%;

                background-color: $s-dark;

                &::before,
                &::after
                {
                    @include absolute;

                    content: '';
                }

                &::before
                {
                    top: 0;
                    left: 50%;

                    transform: translate(-50%, -7%);
            
                    width: 200%;
                    height: 15vh;

                    background-color: $s-dark;

                    border: solid rgba($light, .1) 4px;
                    border-bottom: none;
                    border-radius: 50%;
                }

                &::after
                {
                    @include any-w;

                    bottom: -60vh;

                    height: 70vh;

                    background: linear-gradient(0deg, transparent 0%, $dark 20% 80%, transparent 100%);
                }
            }
        }
    }
</style>