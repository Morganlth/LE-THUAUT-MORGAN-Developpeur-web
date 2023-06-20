<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _transform = '',
        _opacity = 1, /*tictactoe*/
        _size = null,
        _href = null,
        _alt = null,
        _color = '#fff'

    // #IMPORT

        // --SCSS
        import '../../assets/scss/components/icon.scss'
</script>

<!-- #HTML -->

<svelte:element
this={_href ? 'a' : 'div'}
class="icon"
style:--icon-color={_color}
style:transform={_transform}
style:opacity={_opacity}
style:width={_size}
style:height={_size}
style:pointer-events={_href ? 'auto' : 'none'}
{...(_href ? { href: _href, alt: _alt } : {})}
>
    <slot />
</svelte:element>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORT */

    @import '../../assets/scss/styles/flex.scss';

    /* #GROUP */

    .icon
    {
        @include f-center(true);

        transition: opacity 0.6s;
    }
</style>