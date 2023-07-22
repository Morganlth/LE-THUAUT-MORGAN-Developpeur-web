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
        _desc,
        _img

        // BIND card_update

    // #IMPORTS

        // --SVELTE
        import { createEventDispatcher } from 'svelte'
        import { page } from '$app/stores'

    // #CONSTANTE

        // --SVELTE
        const dispatch = createEventDispatcher()

    // #VARIABLES

        // --ELEMENT-CARD
        let
        card_ON = false,
        card_TRANSLATEZ = 0,
        card_SCALE = 1

    // #FUNCTIONS

        // --UPDATE
        export function card_update(value)
        {
            [card_TRANSLATEZ, card_SCALE] = value ? [_radius, 2] : [0, 1]

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
    style:transform="translateZ({card_TRANSLATEZ}px) scale({card_SCALE})"
    on:click={card_click}
    >
        <section
        class="content"
        >
            <div
            class="title"
            >
                {#if _img}
                    <img
                    src={$page.url.origin + _img.src}
                    alt={_img.alt}
                    style:transform="scale({1 / card_SCALE})"
                    style:width={_img.width ?? 'auto'}
                    style:height={_img.height ?? 'auto'}
                    >
                {/if}
            </div>

            <p>{_desc ?? ''}</p>
        </section>
    </button>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/font' as *;

    /* #CARD */

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

            .title
            {
                @include flex;
                @include f-j-center;
                @include any-w;

                align-items: flex-end;
    
                height: 60px;
            }

            img
            {
                max-width: 80%;
    
                transition: transform .4s;
            }

            p
            {
                @include p-content;

                color: $s-light;
            }
        }
    }
</style>