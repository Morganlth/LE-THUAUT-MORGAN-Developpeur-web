<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _img,
        _desc,
        _color

    // #IMPORT

        // --SVELTE
        import { page } from '$app/stores'
</script>

<!-- #HTML -->

<section
class="card-content"
>
    <div>
        {#if _img}
            <img
            src={$page.url.origin + _img.src}
            alt={_img.alt}
            style:width={_img.width ?? 'auto'}
            style:height={_img.height ?? 'auto'}
            >
        {/if}
    </div>

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

    /* #CARD-CONTENT */

    .card-content
    {
        @include f-center(true);
        @include f-column;
        @include any;

        gap: 20px;

        &>div
        {
            @include flex;
            @include f-j-center;
            @include any-w;

            align-items: flex-end;

            height: 60px;
        }

        img { max-width: 70%; }

        p { @include p-content; }
    }
</style>