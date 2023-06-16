<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _lock,
        _width,
        _springSize,
        _colors

        // #BINDS
        export let
        scroll,
        mouseMove

    // #IMPORT
   
        // #ELEMENT
        import Snake from '../elements/Snake.svelte'
</script>

<!-- #HTML -->

<div
id="presentation"
style:width={_width}
>
    <Snake
    {_lock}
    {_springSize}
    {_colors}
    bind:scroll={scroll}
    bind:mouseMove={mouseMove}
    />
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss';

    /* #GROUPS */

    #presentation
    {
        height: 100vh;

        background-color: $dark;
    }
</style>