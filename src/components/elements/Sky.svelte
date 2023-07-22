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
        const CLOUDS = []

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
            const MAX = 30, COUNT = smallScreen ? 10 : MAX
    
            if (CLOUDS.length === MAX) return

            for (let i = CLOUDS.length; i < COUNT; i++) CLOUDS.push(i % 2 === 0 ? -1 : 1)
        }

        // --DESTROY
        function sky_destroy() { event.event_remove('resize', sky_resize) }

        // --EVENT
        function sky_resize(smallScreen) { cloud_update(smallScreen) }

    // #CYCLES

    onMount(sky_set)
    onDestroy(sky_destroy)
</script>

<!-- #HTML -->

<div
class="sky"
>
    {#each CLOUDS as direction}
        <Cloud
        _direction={direction}
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

        bottom: 0;
        left: 0;

        transform: translateY(20%);

        height: 100vh;
    }
</style>