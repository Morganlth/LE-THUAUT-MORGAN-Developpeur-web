<!-- #SCRIPT -->

<script>
    // #EXPORT

        //#PROPS
        export let
        _name = '',
        _color = null,
        _width = '0px',
        _height = '0px',
        _translateY = 0
</script>
<!-- #HTML -->

<div
class="ghost {_name}"
style:width={_width}
style:height={_height}
style:background-color={_color}
style:transform="translateY({_translateY}px)"
>
</div>

<!-- #STYLE -->

<style>
    div { opacity: 0.7; }
</style>