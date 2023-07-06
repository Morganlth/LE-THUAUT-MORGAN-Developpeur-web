<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROPS
        export let
        _id,
        _translateX,
        _translateZ,
        _rotateY,
        _radius

        // --BIND
        export function update() { [translateZ, scale] = on ? [_radius, 2] : [0, 1] }

    // #IMPORT

        // --SVELTE
        import { createEventDispatcher } from 'svelte'

    // #CONSTANTE

        // --SVELTE
        const dispatch = createEventDispatcher()

    // #VARIABLES

        // --ELEMENT-CARD
        let on = false

        // --ELEMENT-BUTTON
        let
        translateZ = 0,
        scale = 1

    // #FUNCTION

        // --EVENT
        function card_click()
        {
            on = !on

            dispatch('click', { id: _id, on: on })
        }
</script>

<!-- #HTML -->

<div
class="card"
style:transform="translateX({_translateX ?? 0}px) translateZ({_translateZ ?? 0}px) rotateY({_rotateY ?? 0}deg)"
>
    <button
    type="button"
    style:transform="translateZ({translateZ}px) scale({scale})"
    on:click={card_click}
    >
    </button>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/background.scss' as *;

    /* #GROUP */

    .card
    {
        @include any;

        flex-shrink: 0;

        transform-style: preserve-3d;
        transform-origin: left;

        padding: 0 1vw; /* in project cardWidth = 100vw * .52 */

        box-sizing: border-box;

        button
        {
            @include any;
            @include black-glass(hue-rotate(180deg));

            border: solid rgba($light, .1) 4px;
            outline: none;

            box-sizing: border-box;

            transition: transform .4s, width .4s, height .4s;
        }
    }
</style>