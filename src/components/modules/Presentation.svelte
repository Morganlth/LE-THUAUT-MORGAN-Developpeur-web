<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _width,
        _colors

    // #IMPORT
   
        // --COMPONENT-ELEMENT
        import Snake from '../elements/Snake.svelte'
</script>

<!-- #HTML -->

<div
id="presentation"
style:width={_width}
>
    <Snake
    {_colors}
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