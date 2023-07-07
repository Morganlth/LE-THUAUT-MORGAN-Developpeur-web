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
        _onColor,
        _offColor

        // --BINDS
        export let on = false

        export function animate() { floating(Math.random()) }
        export function clear() { clearInterval(interval), interval = null }

    // #IMPORT

        // --SVELTE
        import { createEventDispatcher } from 'svelte'

        // --COMPONENT-COVER
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICON
        import Logo from '../icons/Logo.svelte'

    // #CONSTANTES

        // --SVELTE
        const dispatch = createEventDispatcher()

        // --DEFAULT
        const
        rad90 = 90 * Math.PI / 180,
        rad45 = 45 * Math.PI / 180

    // #VARIABLES

        // --ELEMENT-GRAVITY-AREA
        let gravityArea

        // --ELEMENT-SATELLITE
        let
        satellite,
        translateX = 0,
        translateZ = 0,
        rotateY = 0,
        forceX = 0,
        forceY = 0,
        last = +new Date(),
        interval,
        timeout

    // #REACTIVE

    $: update(_y)

    $: rotateY += on ? -rad90 : rad90

    // #FUNCTIONS

        // --UPDATE
        function update(y)
        {
            const angle = y * Math.PI + _offset

            translateX = _r * Math.cos(angle)
            translateZ = _r * Math.sin(angle)            

            rotateY = angle
        }

        // --EVENTS
        function gravity_mouseMove({clientX, clientY})
        {
            const now = +new Date()

            clearTimeout(timeout)

            if (now > last + 100)
            {
                clear()

                gravityEffect(clientX, clientY)

                last = now
            }
            else timeout = setTimeout(() => { gravityEffect(clientX, clientY), animate() }, 300)
        }

        function gravity_mouseLeave()
        {
            clearTimeout(timeout)

            ;[forceX, forceY] = [0, 0]

            animate()
        }

        function satellite_click()
        {
            on = !on

            dispatch('click', { id: _id, on: on })
        }

        // --ANIMATION
        function floating(t)
        {
            if (interval) return

            let up = false
    
            interval = setInterval(() =>
            {
                forceY = 10 * (Math.sin((t - 0.5) * Math.PI) + 1) - 10

                t += up ? -.05 : .05

                if (t > 1) t = 1, up = true
                else if (t < 0) t = 0, up = false
            }, 100)
        }

        function gravityEffect(clientX, clientY)
        {
            const
            boundingClientRect = gravityArea.getBoundingClientRect(),
            size = boundingClientRect.width / 2,
            difX = clientX - (boundingClientRect.left + size),
            difY = clientY - (boundingClientRect.top + size),
            a = Math.atan(difY / difX),
            r = Math.cos(rad45) * (size / Math.cos((rad90 - Math.abs(_rotate) - rad45)))

            forceX = difX * (1 - Math.abs(difX) / (Math.cos(a) * r)) * .3
            forceY = difY * (1 - Math.abs(difY) / Math.abs(Math.sin(a) * r)) * .3
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
    style:transform="translateX({translateX}px) translateZ({translateZ}px)"
    bind:this={gravityArea}
    on:mousemove={gravity_mouseMove}
    on:mouseleave={gravity_mouseLeave}
    on:click={satellite_click}
    >
        <!--application des forces | -_rotate pour retrouver l'axe x-y horizontal-vertical-->
        <div
        style:transform="rotate({-_rotate}rad) translate({forceX}px, {forceY}px)"
        >
            <!--rotation de l'objet | _rotate pour se replacer face a la trajectoire-->
            <div
            class="satellite"
            title={_title}
            style:transform="rotate({_rotate}rad) rotateY({rotateY}rad)"
            bind:this={satellite}
            >
                {#each [0, 1, 2, 3, 4, 5] as side}
                    <div
                    class="side"
                    style:border="solid 8px {on ? _onColor : _offColor}"
                    >
                        <Icon
                        _size="30%"
                        _spring={false}
                        _color={_onColor}
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
        @include absolute;

        transform-style: preserve-3d;

        transition: transform .3s;

        .gravity-area
        {
            @include f-center(true);
            @include pointer;

            transform-style: preserve-3d;

            width: $size * 2;
            height: $size * 2;

            background-color: transparent;

            border: none;
            border-radius: 50%;
            outline: none;

            transition: transform .4s;

            &
            >div { transition: transform .6s; }
        }

        .satellite
        {
            @include no-event;

            transform-style: preserve-3d;
            transform-origin: center;

            width: $size;
            height: $size;

            transition: transform .6s;

            .side
            {
                @include f-center(true);
                @include any;

                background-color: $dark;

                /* box-shadow: 0 0 10px rgba($light, .1); */
                box-sizing: border-box;
            }
            .side:nth-child(1) { transform: translateZ(math.div($size, 2)); }
            .side:nth-child(2) { transform: translateY(-150%) rotateX(-90deg); }
            .side:nth-child(3) { transform: translate(-50%, -200%) rotateY(90deg) scaleX(-1); }
            .side:nth-child(4) { transform: translateY(-250%) rotateX(90deg); }
            .side:nth-child(5) { transform: translate(50%, -400%) rotateY(-90deg); }
            .side:nth-child(6) { transform: translateY(-500%) translateZ(math.div(-$size, 2)); }
        }
    }
</style>