<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _rotate = 0,
        _offset = 0,
        _r = 0,
        _y = 0

    // #VARIABLES

        // --ELEMENT-SATELLITE
        let
        translateX = 0,
        translateZ = 0,
        rotateY = 0

    // #REACTIVE

    $: update(_y)

    // #FUNCTION 

        // --UPDATE
        function update(y)
        {
            const angle = y * Math.PI + _offset

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
    <div
    class="satellite"
    style:transform="translateX({translateX}px) translateZ({translateZ}px) rotateY({rotateY}rad)"
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
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use 'sass:math';

    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/font.scss' as *;
    @use '../../assets/scss/styles/cursor.scss' as *;

    /* #VARIABLE */

    $size: 200px;

    /* #GROUPS */

    .orbit
    {
        @include f-center(true);
        @include absolute;
        @include any;

        transform-style: preserve-3d;

        transition: transform .3s;

        .satellite
        {
            @include pointer;
        
            width: $size;
            height: $size;

            transform-style: preserve-3d;
            transform-origin: center;

            transition: transform .3s;

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
    }
</style>