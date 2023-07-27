<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _translateX = 0,
        _colors

    // #IMPORTS

        // --CONTEXTS
        import { event, wwindow } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

        // --COMPONENT-ELEMENT
        import Cloud from './Cloud.svelte'

    // #CONSTANTE

        // --ELEMENT-CLOUD
        const CLOUD_CLOUDS = []

    // #FUNCTIONS

        // --SET
        function sky_set()
        {
            sky_setEvent()

            cloud_update(wwindow.window_testSmallScreen())
        }

        function sky_setEvent() { event.event_add('resize', sky_resize) }

        // --UPDATE
        function cloud_update(smallScreen)
        {
            const [MIN, MAX] = [3, 30]
    
            if (CLOUD_CLOUDS.length === MAX)
            {
                if (smallScreen || wwindow.window_MOBILE)
                    for (let i = CLOUD_CLOUDS.length - 1; i >= MIN; i--) CLOUD_CLOUDS.pop()
            }
            else
                for (let i = CLOUD_CLOUDS.length; i < (smallScreen || wwindow.window_testMobile() ? MIN : MAX); i++)
                    CLOUD_CLOUDS.push({ key: i, value:( i % 2 === 0 ? -1 : 1) })
        }

        // --DESTROY
        function sky_destroy() { event.event_remove('resize', sky_resize) }

        // --EVENT
        async function sky_resize(smallScreen) { cloud_update(smallScreen) }

    // #CYCLES

    onMount(sky_set)
    onDestroy(sky_destroy)
</script>

<!-- #HTML -->

<div
class="sky"
>
    {#each CLOUD_CLOUDS as cloud (cloud.key)}
        <Cloud
        _direction={cloud.value}
        _translateX={_translateX}
        {_colors}
        />
    {/each}
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/cursor' as *;

    /* #SKY */

    .sky
    {
        @include absolute;
        @include any-w;
        @include no-event;

        bottom: -50vh;
        left: 0;

        height: 150vh;
    }
</style>