<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _id,
        _rotate,
        _offset,
        _r,
        _y,
        _title,
        _colors

        // --BINDS
        export let
        orbit_ON = false,
        orbit_FOCUS = false

        // BIND satellite_animationFloating
        // BIND satellite_clear

    // #IMPORTS

        // --SVELTE
        import { createEventDispatcher } from 'svelte'

        // --COMPONENT-COVER
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICON
        import Logo from '../icons/Logo.svelte'

    // #CONSTANTES

        // --SVELTE
        const dispatch = createEventDispatcher()

        // --ELEMENT-ORBIT
        const [RAD_45, RAD_60, RAD_90, RAD_120] = [45 * Math.PI / 180, 60 * Math.PI / 180, 90 * Math.PI / 180, 120 * Math.PI / 180]

    // #VARIABLES

        // --ELEMENT-GRAVITY-AREA
        let gravityarea

        // --ELEMENT-SATELLITE
        let
        satellite,
        satellite_TRANSLATEX = 0,
        satellite_TRANSLATEZ = 0,
        satellite_ROTATEY = 0,
        satellite_FORCEX = 0,
        satellite_FORCEY = 0,
        satellite_LAST = +new Date(),
        satellite_INTERVAL,
        satellite_TIMEOUT

    // #REACTIVE

    $: satellite_update(_y)

    $: satellite_ROTATEY += orbit_ON ? -RAD_90 : RAD_90

    // #FUNCTIONS

        // --UPDATE
        function satellite_update(y)
        {
            const ANGLE = y * Math.PI + _offset

            satellite_TRANSLATEX = _r * Math.cos(ANGLE)
            satellite_TRANSLATEZ = _r * Math.sin(ANGLE)            
            satellite_ROTATEY = ANGLE

            orbit_testFocus(ANGLE % (Math.PI * 2))
        }

        // --EVENTS
        function gravityarea_mouseMove({clientX, clientY})
        {
            const NOW = +new Date()

            clearTimeout(satellite_TIMEOUT)

            if (NOW > satellite_LAST + 50)
            {
                satellite_clear()
                gravityarea_animationAttract(clientX, clientY)

                satellite_LAST = NOW
            }
            else satellite_TIMEOUT = setTimeout(gravityarea_animationAttract.bind(null, clientX, clientY), 200)
        }

        function gravityarea_mouseLeave()
        {
            clearTimeout(satellite_TIMEOUT)

            ;[satellite_FORCEX, satellite_FORCEY] = [0, 0]

            satellite_TIMEOUT = setTimeout(satellite_animationFloating.bind(null, .5), 200)
        }

        function satellite_click()
        {
            orbit_ON = !orbit_ON

            dispatch('click', { id: _id, on: orbit_ON })
        }

        // --CLEAR
        export function satellite_clear() { clearInterval(satellite_INTERVAL), satellite_INTERVAL = null }

        // --TEST
        function orbit_testFocus(a)
        {
            orbit_FOCUS = a > RAD_60 && a < RAD_120
        }

        // --ANIMATION
        export function satellite_animationFloating(a)
        {
            if (satellite_INTERVAL) return

            let t = a ?? Math.random(), up = false
    
            satellite_INTERVAL = setInterval(() =>
            {
                satellite_FORCEY = 10 * (Math.sin((t - .5) * Math.PI) + 1) - 10

                t += up ? -.05 : .05

                if (t > 1) t = 1, up = true
                else if (t < 0) t = 0, up = false
            }, 100)
        }

        function gravityarea_animationAttract(clientX, clientY)
        {
            const
            CLIENTRECT = gravityarea.getBoundingClientRect(),
            SIZE = CLIENTRECT.width / 2,
            [DIFX, DIFY] = [clientX - (CLIENTRECT.left + SIZE), clientY - (CLIENTRECT.top + SIZE)],
            [ANGLE, RADIUS] = [Math.atan(DIFY / DIFX), Math.cos(RAD_45) * (SIZE / Math.cos((RAD_90 - Math.abs(_rotate) - RAD_45)))]

            satellite_FORCEX = DIFX * (1 - Math.abs(DIFX) / (Math.cos(ANGLE) * RADIUS)) * .3
            satellite_FORCEY = DIFY * (1 - Math.abs(DIFY) / Math.abs(Math.sin(ANGLE) * RADIUS)) * .3
        }
</script>

<!-- #HTML -->

<div
class="orbit"
style:perspective="{_r * 2.5}px"
style:transform="rotate({_rotate}rad)"
>
    <!--deplacement de l'objet-->
    <button
    class="gravity-area"
    style:transform="translateX({satellite_TRANSLATEX}px) translateZ({satellite_TRANSLATEZ}px)"
    bind:this={gravityarea}
    on:mousemove={gravityarea_mouseMove}
    on:mouseleave={gravityarea_mouseLeave}
    on:click={satellite_click}
    >
        <!--application des forces | -_rotate pour retrouver l'axe x-y horizontal-vertical-->
        <div
        style:transform="rotate({-_rotate}rad) translate({satellite_FORCEX}px, {satellite_FORCEY}px)"
        >
            <!--rotation de l'objet | _rotate pour se replacer face a la trajectoire-->
            <div
            class="satellite"
            title={_title}
            style:transform="rotate({_rotate}rad) rotateY({satellite_ROTATEY}rad)"
            bind:this={satellite}
            >
                {#each [0, 1, 2, 3, 4, 5] as id}
                    <div
                    class="side"
                    style:border="solid 8px {orbit_ON ? _colors.on : _colors.off}"
                    data-side-id={id}
                    >
                        <Icon
                        _size="30%"
                        _spring={false}
                        _color={_colors.on}
                        >
                            <Logo />
                        </Icon>
                    </div>
                {/each}
            </div>
        </div>
    </button>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use 'sass:math';

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/cursor' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #VARIABLE */

    $size-min: 100px;
    $size-max: 200px;

    /* #ORBIT */

    .orbit
    {
        @include absolute;

        transform-style: preserve-3d;

        transition: transform .3s;

        .gravity-area
        {
            @include f-center(true);
            @include pointer;

            transform-style: preserve-3d;

            width: $size-min * 2;
            height: $size-min * 2;

            background-color: transparent;

            border: none;
            border-radius: 50%;
            outline: none;

            transition: transform .4s;

            &>div { transition: transform .5s; }
        }

        .satellite
        {
            @include no-event;

            transform-style: preserve-3d;
            transform-origin: center;

            width: $size-min;
            height: $size-min;

            transition: transform .6s;

            .side
            {
                @include f-center(true);
                @include any;

                background-color: $dark;

                box-sizing: border-box;
            }
            .side:nth-child(1) { transform: translateZ(math.div($size-min, 2)); }
            .side:nth-child(2) { transform: translateY(-150%) rotateX(-90deg); }
            .side:nth-child(3) { transform: translate(-50%, -200%) rotateY(90deg) scaleX(-1); }
            .side:nth-child(4) { transform: translateY(-250%) rotateX(90deg); }
            .side:nth-child(5) { transform: translate(50%, -400%) rotateY(-90deg); }
            .side:nth-child(6) { transform: translateY(-500%) translateZ(math.div(-$size-min, 2)); }
        }

        
        @include media-min(768px)
        {
            .gravity-area
            {
                width: $size-max * 2;
                height: $size-max * 2;
            }

            .satellite
            {
                width: $size-max;
                height: $size-max;

                .side:nth-child(1) { transform: translateZ(math.div($size-max, 2)); }
                .side:nth-child(6) { transform: translateY(-500%) translateZ(math.div(-$size-max, 2)); }
            }
        }
    }
</style>