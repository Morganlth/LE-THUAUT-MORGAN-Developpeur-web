<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _in = null,
        _out = null,
        _width,
        _img,
        _desc,
        _color

    // #IMPORT

        // --SVELTE
        import { page } from '$app/stores'

    // #VARIABLES

        // --ELEMENT-CARD-CONTENT
        let
        cardcontent_IN = _in ? cardcontent_transition : () => {},
        cardcontent_OUT = _out ? cardcontent_transition : () => {}

    // #FUNCTION

        // --TRANSITION
        function cardcontent_transition()
        {
            const VALUES = _in ? [0, 1] : [1, 0]

            return {
                duration: 400,
                css: (t) => `opacity: ${VALUES[Math.floor(t)]}`
            }
        }
</script>

<!-- #HTML -->

<section
class="card-content"
style:width={_width}
in:cardcontent_IN
out:cardcontent_OUT
>
    {#if _img}
        <div>
            <img
            src={$page.url.origin + _img.src}
            alt={_img.alt}
            style:width={_img.width ?? 'auto'}
            style:height={_img.height ?? 'auto'}
            >
        </div>
    {/if}

    <p
    style:color={_color}
    >
        {_desc ?? ''}
    </p>
</section>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #CARD-CONTENT */

    .card-content
    {
        @include f-center(true);
        @include f-column;

        gap: 10px;

        &>div
        {
            @include flex;
            @include f-j-center;
            @include any-w;

            align-items: flex-end;

            height: 25px;
        }

        img
        {
            max-width: 70%;
            max-height: 100%;
        }

        p
        {
            @include p-content;

            padding-inline: 10px;

            text-align: center;
        }

        @include media-min(768px, 475px)
        {
            gap: 20px;

            &>div { height: 50px; }
        }
    }
</style>