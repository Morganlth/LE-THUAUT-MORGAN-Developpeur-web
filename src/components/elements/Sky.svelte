<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _translate = 0,
        _colors

    // #IMPORTS

        // --COMPONENT-ELEMENT
        import Cloud from './Cloud.svelte'

    // #CONSTANTE

        // --TO-ITERATE
        const clouds = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1]
</script>

<!-- #HTML -->

<div
class="sky"
>
    {#each clouds as cloud}
        <Cloud
        _translateX={_translate * cloud}
        {_colors}
        />
    {/each}
</div>

<!-- #STYLE -->

<style>
    .sky { position: relative; }
</style>