<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _page = { id: 0 }

    // #IMPORTS

        // --SCSS
        import colors from './assets/scss/modules/variables.module.scss'
        import './assets/scss/app.scss'

        // --CONTEXT
        import { app } from './components/field/Main.svelte'
        import { spring } from './components/field/Main.svelte'

        // --SVELTE
        import { onMount } from 'svelte'

        // --COMPONENT-FIELDS
        import Header from './components/field/Header.svelte'
        import Main from './components/field/Main.svelte'

        // --COMPONENT-ELEMENT
        import EcoPopup from './components/elements/EcoPopup.svelte'

    // #CONSTANTE

    const start = performance.now()

    // #VARIABLES

        // --ELEMENT-SPRING
        let
        coords = spring.coords,
        size = spring.size
    
        // --ELEMENT-ECOPOPUP
        let eco = false

    // #FUNCTIONS

        // --SET
        function set()
        {
            restore()
            testPerformance()
        }

        // --RESTORE
        function restore()
        {
            for (let i = 0; i < app.storageKeys.length; i++)
            {
                const
                key = app.storageKeys[i],
                item = localStorage.getItem(key)

                try { if (item !== null) app[key](item) }
                catch { localStorage.removeItem(key) }
            }

            app.clear()
        }

        // --TEST
        function testPerformance()
        {
            const mode = localStorage.getItem('mode')
            
            if (mode !== 'eco' && performance.now() - start > 300) eco = true
        }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<slot>
    <Header
    _iconColor={colors.light}
    />

    <Main
    _colors={colors}
    {_page}
    />

    <svg
    class="spring"
    >
	    <circle
        cx={$coords.x}
        cy={$coords.y}
        r={$size < 0 ? 0 : $size}
        />
    </svg>

    {#if eco}
        <EcoPopup />
    {/if}
</slot>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use './assets/scss/styles/position.scss' as *;
    @use './assets/scss/styles/size.scss' as *;
    @use './assets/scss/styles/cursor.scss' as *;

    /* #GROUPS */

    .spring
    {
        @include xy-start(true);
        @include any;
        @include no-event;

        z-index: 5;

        mix-blend-mode: difference;

        circle { fill: $light; }
    }
</style>