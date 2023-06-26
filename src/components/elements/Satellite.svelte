<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _rotate = 0,
        _offset = 0,
        _r = 0,
        _y = 0

    // #IMPORT

        // #ELEMENT
        import Cube from './Cube.svelte'

    // #VARIABLES

    let
    translateX = 0,
    translateZ = 0,
    rotateY = 0

    // #REACTIVE

    $: update(_y)

    // #FUNCTION 

    function update(y)
    {
        const angle = 3 * y * Math.PI + _offset

        translateX = _r * Math.cos(angle)
        translateZ = _r * Math.sin(angle)

        rotateY = angle
    }
</script>

<!-- #HTML -->

<div
class="orbit"
style:perspective="{_r * 2}px"
style:transform="rotate({_rotate}deg)"
>
    <Cube
    _translateX={translateX}
    _translateZ={translateZ}
    _rotateY={rotateY}
    />
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
    }
</style>