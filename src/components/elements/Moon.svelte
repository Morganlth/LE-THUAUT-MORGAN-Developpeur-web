<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors
        
    // #IMPORTS

        // --JS
        import { rgba } from '../../assets/js/utils/color'
        import { clearCanvas, drawCircle } from '../../assets/js/utils/canvas'

        // --CONTEXT
        import { event } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'
        import { page } from '$app/stores'

    // #CONSTANTE

        // --ELEMENT-MOON
        const MOON_AURA = 10

    // #VARIABLES

        // --ELEMENT-CANVAS
        let
        canvas,
        context,
        canvas_SIZE

    // #FUNCTIONS

        // --SET
        function moon_set()
        {
            moon_reset()
            
            moon_setEvent()
        }

        function moon_setEvent() { event.event_add('resize', moon_resize) }

        function canvas_set()
        {
            canvas_SIZE = Math.min(window.innerWidth, window.innerHeight) * .95

            canvas.width = canvas_SIZE
            canvas.height = canvas_SIZE

            context = context ?? canvas.getContext('2d')
        }

        // --GET
        function moon_getBackground()
        {
            return new Promise(resolve =>
            {
                const img = new Image()

                img.src = $page.url.origin + '/src/assets/images/glitch.jpg'

                img.addEventListener('load', () => resolve(img))
            })
        }

        // --RESET
        function moon_reset()
        {
            canvas_set()

            canvas_draw()
        }

        // --DESTROY
        function moon_destroy() { event.event_remove('resize', moon_resize) }

        // --EVENT
        async function moon_resize()
        {
            clearCanvas(context, canvas_SIZE)

            moon_reset()
        }

        // --DRAW
        async function canvas_draw()
        {
            const [COLOR, RADIUS, IMG] = [rgba(_colors.light, .1), canvas_SIZE / 2, await moon_getBackground()]

            canvas_drawAura(RADIUS, COLOR)
            canvas_drawMoon(RADIUS, IMG)
            canvas_drawCrescent(RADIUS, COLOR)
        }

        function canvas_drawAura(radius, color)
        {
            context.fillStyle = color
            drawCircle(context, radius, radius, radius)
            context.clip()
            context.save()
        }

        function canvas_drawMoon(radius, img)
        {
            context.fillStyle = rgba(_colors.dark, .7)
            drawCircle(context, radius, radius, radius - MOON_AURA)
            context.clip()
            context.drawImage(img, 0, 0, canvas_SIZE, canvas_SIZE)
            context.fill()
            context.restore()
        }

        function canvas_drawCrescent(radius, color)
        {
            const [RADIUS_3_4, SIZE_3_4] = [radius * .75, canvas_SIZE * .75]

            context.fillStyle = _colors.dark
            context.globalCompositeOperation = 'destination-out'
            drawCircle(context, SIZE_3_4, radius, RADIUS_3_4)
            context.fillStyle = color
            context.globalCompositeOperation = 'source-over'
            context.fill()

            context.fillStyle = _colors.dark
            context.globalCompositeOperation = 'destination-out'
            drawCircle(context, SIZE_3_4, radius, RADIUS_3_4 - MOON_AURA)
        }

    // #CYCLES

    onMount(moon_set)
    onDestroy(moon_destroy)
</script>

<!-- #HTML -->

<div
class="moon"
>
    <canvas
    style:width="{canvas_SIZE}px"
    style:height="{canvas_SIZE}px"
    bind:this={canvas}
    >
    </canvas>

    <div>
        <p>C'EST AU-DELA DES LIMITES HUMAINES,</p>
        <p>QUE LE TEMPS PARAIT SI PRÉCIEUX</p>
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #MOON */

    .moon
    {
        @include relative;

        &>div
        {
            @include flex;
            @include absolute;

            flex-direction: row-reverse;

            top: 0%;
            left: 20%;

            p
            {
                @include p-content;
    
                color: $s-light;
                line-height: 1.5;
                writing-mode: vertical-lr;
                white-space: nowrap;
                user-select: none;

                @include media-max(false, 649px) { font-size: 18px; }
            }
        }
    }
</style>