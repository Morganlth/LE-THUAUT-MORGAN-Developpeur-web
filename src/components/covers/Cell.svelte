<!-- #SCRIPT -->

<script>
    // #EXPORT
    
        // --PROP
        export let _style = 'border: none'

    // #IMPORT

        // --SVELTE
        import { createEventDispatcher } from 'svelte'

    // #CONSTANTE

        // --SVELTE
        const DISPATCH = createEventDispatcher()

    // #FUNCTION

        // --EVENT
        function click(e) { DISPATCH('click', { event: e }) }
</script>

<!-- #HTML -->

<button
type="button"
class="cell"
style={_style}
on:click={click}
>
    <slot />
</button>

<!-- #STYLE -->

<style>
    /* #CELL */

    .cell
    {
        background-color: transparent;

        font: inherit;

        pointer-events: auto;
    }
</style>