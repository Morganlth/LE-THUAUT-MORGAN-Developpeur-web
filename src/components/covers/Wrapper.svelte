<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _translateX = 0,
        _translateY = 0,
        _zIndex = 0,
        _background = 'transparent'
</script>

<!-- #HTML -->

<div
class="wrapper"
style:transform="translate({_translateX}px, {_translateY}px)"
style:z-index={_zIndex}
style:background-color={_background}
>
    <slot />
</div>