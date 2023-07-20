<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _translateX = 0,
        _colors

    // #IMPORTS

        // --COMPONENT-ELEMENT
        import Cloud from './Cloud.svelte'

    // #CONSTANTE

        // --TO-ITERATE
        const directions = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1]
</script>

<!-- #HTML -->

<div
class="sky"
>
    {#each directions as d}
        <Cloud
        _d={d}
        _translateX={_translateX}
        {_colors}
        />
    {/each}
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/cursor.scss' as *;

    /* #GROUP */

    .sky
    {
        @include absolute;
        @include any-w;
        @include no-event;

        bottom: 0;
        left: 0;

        transform: translateY(20%);

        height: 100vh;
    }
</style>