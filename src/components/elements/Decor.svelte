<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _scale,
        _colors

    // #IMPORTS

        // --JS
        import { clearCanvas, drawTriangle } from '../../assets/js/utils/canvas'
        import { rgb } from '../../assets/js/utils/color'

        // --CONTEXTS
        import { event, wwindow } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

    // #CONSTANTE

        // --ELEMENT-DECOR
        const COLOR = rgb(_colors.sLight)

    // #VARIABLES

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        canvas_WIDTH,
        canvas_HEIGHT

    // #FUNCTIONS

        // --SET
        function decor_set()
        {
            decor_setEvent()

            canvas_set()
    
            if (!wwindow.window_testSmallScreen() && !wwindow.window_testMobile()) canvas_draw()
        }

        function decor_setEvent() { event.event_add('resize', decor_resize) }

        function canvas_set()
        {
            canvas.width = (canvas_WIDTH = window.innerWidth)
            canvas.height = (canvas_HEIGHT = window.innerHeight)

            context = context ?? canvas.getContext('2d')
            context.lineWidth = 2
            context.strokeStyle = _colors.sDark
            context.fillStyle = _colors.sLight
        }

        // --DESTROY
        function decor_destroy() { event.event_remove('resize', decor_resize) }

        // --EVENT
        async function decor_resize(smallScreen)
        {
            if (smallScreen || wwindow.window_MOBILE) clearCanvas(context, canvas_WIDTH, canvas_HEIGHT)
            else if (canvas_WIDTH < window.innerWidth)
                canvas_set(),
                canvas_draw()
        }

        // --DRAW
        function canvas_draw()
        {
            decor_generateMontain()
            decor_generateForest()
        }

        function canvas_drawMontain(left, y, small)
        {
            const
            X = Math.random() * canvas_WIDTH * .4 + (left ? -canvas_WIDTH * .1 : canvas_WIDTH * .7),
            W = (Math.random() * canvas_WIDTH * .3 + canvas_WIDTH * .2) / (small ? 3 : 1),
            H = (Math.random() * canvas_HEIGHT * .25 + canvas_HEIGHT * .2) / (small ? 3 : 1),
            S = X + Math.random() * canvas_WIDTH * .05 * (left ? -1 : 1)
    
            drawTriangle(context, X, y, W, H, S)
        }

        function canvas_drawTree(left, y)
        {
            const
            X = Math.random() * canvas_WIDTH * .4 + (left ? -canvas_WIDTH * .03 : canvas_WIDTH * .63),
            W = Math.random() * canvas_WIDTH * .01 + canvas_WIDTH* .04,
            H = Math.random() * canvas_HEIGHT * .05 + canvas_HEIGHT * .15

            canvas_drawFoliage(X, y, W, H)
            canvas_drawTrunk(X, y)
        }

        function canvas_drawFoliage(x, y, w, h)
        {
            context.beginPath()
            context.moveTo(x - w / 2, y)
            context.lineTo(x, y - h)
            context.lineTo(x + w / 2, y)
            context.fillStyle = _colors.secondary
            context.fill()
            context.fillStyle = `rgba(${COLOR}, .3)`
            context.fill()
            context.stroke()
            context.closePath()
        }

        function canvas_drawTrunk(x, y)
        {
            const H_MUL_01 = canvas_HEIGHT * .01
    
            context.fillStyle = `rgba(${COLOR}, .6)`
            context.beginPath()
            context.rect(x - 5, y, 10, Math.random() * H_MUL_01 + H_MUL_01)
            context.fill()
            context.closePath()
        }

        // --GENERATE
        function decor_generateMontain()
        {
            let y = Math.random() * canvas_HEIGHT * .03 + canvas_HEIGHT * .6

            for (let i = 0; i < 8; i++)
            {
                if (i === 4) y = Math.random() * canvas_HEIGHT * .03  + canvas_HEIGHT * .6
                
                y += Math.random() * canvas_HEIGHT * .03

                canvas_drawMontain(i < 4, y)
            }

            y = canvas_HEIGHT * .7

            for (let i = 0; i < 4; i++) canvas_drawMontain(i < 2, y, true)
        }

        function decor_generateForest()
        {
            const MAX = Math.floor(Math.random() * 7) + 7
        
            let y = Math.random() * canvas_HEIGHT * .03 + canvas_HEIGHT * .75
        
            for (let i = 0; i < MAX * 2; i++)
            {
                if (i === MAX) y = Math.random() * canvas_HEIGHT * .03 + canvas_HEIGHT * .75
                
                y += Math.random() * canvas_HEIGHT * .2 / MAX

                canvas_drawTree(i < MAX, y)
            }
        }
    

    // #CYCLES

    onMount(decor_set)
    onDestroy(decor_destroy)
</script>

<!-- #HTML -->

<div
class="decor"
style:transform="scale({_scale})"
>
    <div
    class="background"
    >
        <div></div>
    </div>

    <canvas
    style:width="{canvas_WIDTH}px"
    style:height="{canvas_HEIGHT}px"
    bind:this={canvas}
    >
    </canvas>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;

    /* #DECOR */

    .decor
    {
        @include relative;
        @include any;
    
        transition: transform 1s;

        .background
        {
            @include neon;

            div
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

                    bottom: 0;

                    height: 5vh;

                    background: linear-gradient(0deg, $dark -10%, transparent 100%);
                }
            }
        }
        
        canvas
        {
            @include absolute;

            bottom: 0;
            left: 50%;

            transform: translateX(-50%);
        }
    }
</style>