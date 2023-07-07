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
        _title,
        _img

        // --BIND
        export function update(value)
        {
            [translateZ, scale, ] = value ? [_radius, 2] : [0, 1]

            on = value
        }

    // #IMPORTS

        // --SVELTE
        import { createEventDispatcher } from 'svelte'
        import { page } from '$app/stores'

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
        function card_click() { dispatch('click', { id: _id, on: !on }) }
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
        <section
        class="content"
        >
            {#if _img}
                <img
                src={$page.url.origin + _img.src}
                alt={_img.alt}
                style:transform="scale({1 / scale})"
                style:width={_img.width ?? 'auto'}
                style:height={_img.height ?? 'auto'}
                >
            {/if}

            <p>{_title ?? ''}</p>
        </section>
    </button>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/background.scss' as *;
    @use '../../assets/scss/styles/font.scss' as *;

    /* #GROUPS */

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

            pointer-events: auto;

            transition: transform .4s, width .4s, height .4s;
        }

        .content
        {
            @include f-center(true);
            @include f-column;
            @include any;

            gap: 20px;

            img { transition: transform .4s; }

            p
            {
                @include text-command;

                color: $s-light;
            }
        }
    }
</style>