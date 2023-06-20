<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _perspective = 0,
        _translateX = 0,
        _translateZ = 0,
        _rotateY = 0,
        _content = ['', ''],
        _color = '#FFF'
</script>

<!-- #HTML -->

<div
class="cube"
style:transform="perspective({_perspective}px) translateX({_translateX}px) translateZ({_translateZ}px) rotateY({_rotateY}rad)"
>
    {#each [0, 1, 2, 3, 4, 5] as side}
        <div
        class="side"
        style:border-color={_color}
        >
            {_content[0]} <br>
            {_content[1]}
        </div>
    {/each}
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/font.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #GROUPS */

    .cube
    {
        @include pointer;
    
        width: 250px;
        height: 250px;

        transform-style: preserve-3d;
        transform-origin: center;

        .side
        {
            @include f-center(true);
            @include any;
            @include font-command;

            background-color: $dark;

            border: solid 8px;

            box-sizing: border-box;

            color: $light;
            font-size: 36px;
            text-align: center;
            user-select: none;
        }
        .side:nth-child(1)
        {
            transform: translateZ(125px);
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
            transform: translateY(-500%) translateZ(-125px);
        }
    }
</style>