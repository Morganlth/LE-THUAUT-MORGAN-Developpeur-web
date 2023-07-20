<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors
        
    // #IMPORTS

        // --JS
        import { rgba } from '../../assets/js/utils/color'
        import { drawCircle } from '../../assets/js/utils/canvas'

        // --SVELTE
        import { onMount } from 'svelte'
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
            canvas_set()

            canvas_draw()
        }

        function canvas_set()
        {
            canvas_SIZE = Math.min(window.innerWidth, window.innerHeight) * .95

            canvas.width = canvas_SIZE
            canvas.height = canvas_SIZE

            context = canvas.getContext('2d')
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

        // --DRAW-CLEAR
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

    // #CYCLE

    onMount(moon_set)
</script>

<!-- #HTML -->

<div
class="moon"
>
    <p>LES HOMMES AURONT TOUJOURS LE DROIT DE REVER</p>

    <canvas
    style:width="{canvas_SIZE}px"
    style:height="{canvas_SIZE}px"
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
    @use '../../assets/scss/styles/font' as *;

    /* #MOON */

    .moon
    {
        @include relative;

        p
        {
            @include absolute;
            @include p-content;

            top: 0%;
            left: 20%;

            z-index: -1;

            width: 30%;

            color: $secondary;
            writing-mode: vertical-lr;
        }

        canvas { mix-blend-mode: color; }
    }
</style>