<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _direction,
        _translateX,
        _colors

    // #IMPORTS

        // --JS
        import { drawCircle, drawEllipse } from '../../assets/js/utils/canvas'

        // --CONTEXT
        import { event, wwindow } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

    // #CONSTANTE

        // --ELEMENT-CLOUD
        const CLOUD_SPEED = Math.random() + .4

    // #VARIABLES

        // --ELEMENT-CLOUD
        let
        cloud_A, // semi-major axis
        cloud_B, // semi-small axis
        cloud_X,
        cloud_Y

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        canvas_WIDTH,
        canvas_HEIGHT,
        canvas_TRANSLATEX,
        canvas_TRANSLATEY

    // #FUNCTIONS

        // --SET
        function cloud_set()
        {
            cloud_setVar()
            cloud_setEvent()
    
            canvas_set()
            canvas_setPosition(wwindow.window_testSmallScreen())
            canvas_draw()
        }

        function cloud_setVar()
        {
            cloud_A = Math.floor(Math.random() * 150) + 150
            cloud_B = Math.floor(Math.random() * 30) + 20

            canvas_WIDTH = cloud_A * 2 + 320
            canvas_HEIGHT = cloud_B * 2 + 320

            cloud_X = canvas_WIDTH / 2
            cloud_Y = canvas_HEIGHT / 2
        }

        function cloud_setEvent() { event.event_add('resize', cloud_resize) }

        function canvas_set()
        {
            canvas.width = canvas_WIDTH
            canvas.height = canvas_HEIGHT

            context = canvas.getContext('2d')
        }

        function canvas_setPosition()
        {
            canvas_TRANSLATEX = Math.random() * (window.innerWidth + canvas_WIDTH) - canvas_WIDTH
            canvas_TRANSLATEY = Math.random() * (window.innerHeight * 1.5 - canvas_HEIGHT)
        }

        // --GET
        function canvas_getCircleGap(d) { return (Math.random() * 1 + 1) * d }

        // --DESTROY
        function cloud_destroy() { event.event_remove('resize', cloud_resize) }

        // --EVENT
        async function cloud_resize() { canvas_setPosition() }

        // --DRAW
        function canvas_draw()
        {
            canvas_drawCloud()
            drawEllipse(context, cloud_A, cloud_B, cloud_X, cloud_Y)
        }

        function canvas_drawCloud()
        {
            let [pX, direction] = [-cloud_A + Math.random() * 20, 1]

            while (true)
            {
                const
                PY = (Math.sqrt((1 - (pX * pX) / (cloud_A * cloud_A)) * cloud_B * cloud_B) + Math.random() * 60) * direction,
                RADIUS = Math.random() * 50 + 50

                canvas_draw2Circles(cloud_X + pX, cloud_Y + PY, RADIUS, direction)

                pX += (RADIUS + Math.random() * 60) * direction

                if (pX > cloud_A) pX = cloud_A - Math.random() * 20, direction = -1
                if (pX < -cloud_A) break
            }
        }

        function canvas_draw2Circles(x, y, r, d)
        {
            const [GAPX, GAPY] = [canvas_getCircleGap(d), canvas_getCircleGap(d)]

            context.fillStyle = _colors.light
            drawCircle(context, x + GAPX, y + GAPY, r + .5)
            context.fillStyle = _colors.dark
            drawCircle(context, x, y, r)
        }

    // #CYCLE

    onMount(cloud_set)
    onDestroy(cloud_destroy)
</script>

<!-- #HTML -->

<div
class="cloud"
style:transform="translateX(calc((100% - {_translateX * CLOUD_SPEED}px) * {_direction}))"
>
    <canvas
    style:transform="translate({canvas_TRANSLATEX}px, {canvas_TRANSLATEY}px)"
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

    /* #CLOUD */

    .cloud
    {
        @include xy-start(true);
        @include any;

        transition: transform .3s;
    }
</style>