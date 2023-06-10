<!-- #SCRIPT -->

<script>
    // #EXPORTS
    
        // #PROPS
        export let
        _data = {},
        _style = 'border: none'

    // #IMPORT

        // #SVELTE-DEPENDENCE
        import { createEventDispatcher } from 'svelte'

    // #CONSTANTE

    const dispatch = createEventDispatcher()

    // #FUNCTION

    function handleClick(cE) { dispatch('click', { event: cE }) }
</script>

<!-- #HTML -->

<button
type="button"
class="cell"
{..._data}
style={_style}
on:click={handleClick}
>
    <slot />
</button>

<!-- #STYLE -->

<style>
    .cell
    {
        background-color: transparent;

        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
    }
</style>