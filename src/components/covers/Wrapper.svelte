<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _translateX = 0,
        _translateY = 0,
        _background = 'transparent'
</script>

<!-- #HTML -->

<div
class="wrapper"
style:transform="translate({_translateX}px, {_translateY}px)"
style:background-color={_background}
>
    <slot />
</div>