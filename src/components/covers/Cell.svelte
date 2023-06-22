<!-- #SCRIPT -->

<script>
    // #EXPORT
    
        // --PROP
        export let _style = 'border: none'

    // #IMPORT

        // --SVELTE
        import { createEventDispatcher } from 'svelte'

    // #CONSTANTE

    const dispatch = createEventDispatcher()

    // #FUNCTION

        // --EVENT
        function click(e) { dispatch('click', { event: e }) }
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
    .cell
    {
        background-color: transparent;

        font: inherit;

        pointer-events: auto;
    }
</style>