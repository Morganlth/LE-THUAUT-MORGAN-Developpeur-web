<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _translateX = 0,
        _background = 'transparent'
</script>

<!-- #HTML -->

<div
class="wrapper"
style:transform="translateX({_translateX}px)"
style:background-color={_background}
>
    <slot />
</div>