<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _color,
        _rotate = 0,
        _offset = 0,
        _r = 0,
        _y = 0

    // #VARIABLES

    let
    translateX = 0,
    translateZ = 0

    // #REACTIVE

    $: update(_y)

    // #FUNCTION 

    function update(y)
    {
        const angle = 3 * y * Math.PI + _offset

        translateX = _r * Math.cos(angle)
        translateZ = _r * Math.sin(angle)
    }
</script>

<!-- #HTML -->

<div
class="orbit"
style:transform="rotate({_rotate}deg)"
>
    <div
    class="satellite"
    style:transform="perspective({_r * 3}px) translate3d({translateX}px, 0, {translateZ}px)"
    style:background-color={_color}
    >
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss';

    /* #GROUPS */

    .orbit
    {
        @include f-center(true);
        @include absolute;
        @include any;

        transform-style: preserve-3d;

        /* border: solid red 1px; */
    }

    .satellite
    {
        width: 300px;
        height: 300px;

        /* background-color: $dark; */
        /* background: radial-gradient(circle, transparent 5%, rgba($dark, .3) 100%); */

        border-radius: 50%;

        box-shadow: 0 0 5px $s-light;
    }
</style>