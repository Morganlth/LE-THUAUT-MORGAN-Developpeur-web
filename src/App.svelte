<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _page = -1

    // #IMPORTS

        // --SCSS
        import colors from './assets/scss/modules/variables.module.scss'
        import './assets/scss/app.scss'

        // --CONTEXT
        import { app } from './components/field/Main.svelte'

        // --SVELTE
        import { onMount } from 'svelte'

        // --COMPONENT-FIELDS
        import Header from './components/field/Header.svelte'
        import Main from './components/field/Main.svelte'

        // --COMPONENT-ELEMENT
        import EcoPopup from './components/elements/EcoPopup.svelte'

    // #CONSTANTE

    const start = performance.now()

    // #VARIABLE

    let eco = false

    // #FUNCTIONS

        // --SET
        function set()
        {
            const appElement = document.body.firstElementChild
            
            appElement.style.backgroundColor = colors.dark
            appElement.style.opacity = 1

            restore()

            if (performance.now() - start > 300) eco = true
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

    {#if eco}
        <EcoPopup />
    {/if}
</slot>