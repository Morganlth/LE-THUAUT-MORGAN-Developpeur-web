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
        import { app, spring } from './components/field/Main.svelte'

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

        // --APP-CONTEXT
        let app_FREEZE = app.app_FREEZE

        // --ELEMENT-SPRING
        let
        spring_COORDS = spring.spring_COORDS,
        spring_SIZE = spring.spring_SIZE
    
        // --ELEMENT-ECOPOPUP
        let ecopopup_ECO = false

    // #REACTIVE

        // --ELEMENT-HEADER
        $: header_TRANSLATEY = $app_FREEZE ? 100 : 0

    // #FUNCTIONS

        // --SET
        function app_set()
        {
            app_restore()
            app_testPerformance()

            document.getElementById('app').style.opacity = 1
        }

        // --RESTORE
        function app_restore()
        {
            const KEYSTORAGE = app.app_KEYSTORAGE
    
            for (let i = 0; i < KEYSTORAGE.length; i++)
            {
                const [KEY, VALUE] = [KEYSTORAGE[i], localStorage.getItem(KEYSTORAGE[i])]

                try { app.app_COMMANDS[KEY](VALUE ?? 'd') } catch { localStorage.removeItem(KEY) }
            }

            if (app.app_KEYWORDS.includes('clear')) app.app_COMMANDS.clear()
        }

        // --TEST
        function app_testPerformance()
        {
            const MODE = localStorage.getItem('mode')
            
            if (MODE !== 'eco' && performance.now() - APP_START > 300) ecopopup_ECO = true
        }

    // #CYCLE

    onMount(app_set)
</script>

<!-- #HTML -->

<slot>
    <Header
    _translateY={header_TRANSLATEY}
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