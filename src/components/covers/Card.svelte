<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROPS
        export let
        _id,
        _translateX,
        _translateZ,
        _rotateY,
        _radius,
        _scale

        // BIND card_update

    // #IMPORT

        // --SVELTE
        import { createEventDispatcher } from 'svelte'

    // #CONSTANTE

        // --SVELTE
        const dispatch = createEventDispatcher()

    // #VARIABLES

        // --ELEMENT-CARD
        let
        card_ON,
        card_TRANSLATEZ = 0

    // #FUNCTIONS

        // --UPDATE
        export function card_update(value)
        {
            card_TRANSLATEZ = value ? _radius : 0

            card_ON = value
        }

        // --EVENT
        function card_click() { dispatch('click', { id: _id, on: !card_ON }) }
</script>

<!-- #HTML -->

<div
class="card"
style:transform="translateX({_translateX ?? 0}px) translateZ({_translateZ ?? 0}px) rotateY({_rotateY ?? 0}deg)"
>
    <button
    type="button"
    style:transform="translateZ({card_TRANSLATEZ}px) scale({_scale})"
    on:click={card_click}
    >
        <slot />
    </button>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/cursor' as *;

    /* #CARD */

    .card
    {
        @include any;

        flex-shrink: 0;

        transform-style: preserve-3d;
        transform-origin: left;

        padding: 0 1vw; /* in project cardWidth = 100vw * .*2 */

        box-sizing: border-box;

        button
        {
            @include any;
            @include black-glass(hue-rotate(180deg));
            @include pointer;

            border: solid rgba($light, .1) 4px;
            outline: none;

            box-sizing: border-box;

            pointer-events: auto;

            transition: transform .4s;
        }
    }
</style>