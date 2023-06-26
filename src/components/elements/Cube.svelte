<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _translateX = 0,
        _translateZ = 0,
        _rotateY = 0
</script>

<!-- #HTML -->

<div
class="cube"
style:transform="translateX({_translateX}px) translateZ({_translateZ}px) rotateY({_rotateY}rad)"
>
    {#each [0, 1, 2, 3, 4, 5] as side}
        <div
        class="side"
        >
            <svg
            viewBox="0 0 80 80"
            fill="none"
            stroke-width="10"
            xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="5" y="5" width="70" height="70"/>
                <rect x="5" y="5" width="38" height="38"/>
            </svg>
        </div>
    {/each}
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    @use 'sass:math';

    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/font.scss' as *;
    @use '../../assets/scss/styles/cursor.scss' as *;

    /* #VARIABLE */

    $size: 200px;

    /* #GROUPS */

    .cube
    {
        @include pointer;
    
        width: $size;
        height: $size;

        transform-style: preserve-3d;
        transform-origin: center;

        .side
        {
            @include f-center(true);
            @include any;
            @include font-command;

            background-color: $dark;

            border: solid 8px rgba($light, .1);

            box-sizing: border-box;

            color: $light;
            font-size: 36px;
            text-align: center;
            user-select: none;

            svg
            {
                width: 30%;
                height: 30%;
    
                stroke: rgba($light, 1);
            }
        }
        .side:nth-child(1)
        {
            transform: translateZ(math.div($size, 2));
        }
        .side:nth-child(2)
        {
            transform: translateY(-150%) rotateX(-90deg);
        }
        .side:nth-child(3)
        {
            transform: translate(-50%, -200%) rotateY(90deg) scaleX(-1);
        }
        .side:nth-child(4)
        {
            transform: translateY(-250%) rotateX(90deg);
        }
        .side:nth-child(5)
        {
            transform: translate(50%, -400%) rotateY(-90deg);
        }
        .side:nth-child(6)
        {
            transform: translateY(-500%) translateZ(math.div(-$size, 2));
        }
    }
</style>