<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _page = { id: 0 }

    // #IMPORTS

        // --SCSS
        import colors from './assets/scss/modules/variables.module.scss'
        import './assets/scss/app.scss'

        // --CONTEXTS
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

        // --ELEMENT-APP
        const APP_START = performance.now()

    // #VARIABLES

        // --ELEMENT-SPRING
        let
        spring_COORDS = spring.coords,
        spring_SIZE = spring.size
    
        // --ELEMENT-ECOPOPUP
        let ecopopup_ECO = false

    // #FUNCTIONS

        // --SET
        function app_set()
        {
            app_restore()
    
            app_testPerformance()
        }

        // --RESTORE
        function app_restore()
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
        async function app_testPerformance()
        {
            const mode = localStorage.getItem('mode')
            
            if (mode !== 'eco' && performance.now() - APP_START > 300) ecopopup_ECO = true
        }

    // #CYCLE

    onMount(app_set)
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
        cx={$spring_COORDS.x}
        cy={$spring_COORDS.y}
        r={$spring_SIZE < 0 ? 0 : $spring_SIZE}
        />
    </svg>

    {#if ecopopup_ECO}
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

    /* #APP */

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