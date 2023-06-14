<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // #SCSS
        import colors from './assets/scss/modules/variables.module.scss'
        import './assets/scss/app.scss'

        // #APP-CONTEXT
        import { app } from './components/elements/Console.svelte'

        // #SVELTE
        import { onMount } from 'svelte'

        // #FIELDS
        import Header from './components/field/Header.svelte'
        import Main from './components/field/Main.svelte'

    // #FUNCTIONS

    function set()
    {
        const appElement = document.body.firstElementChild
        
        appElement.style.backgroundColor = colors.dark
        appElement.style.opacity = 1

        restore()
    }

    function restore()
    {
        for (let i = 0; i < app.storageKeys.length; i++)
        {
            const
            key = app.storageKeys[i],
            item = localStorage.getItem(key)

            if (item !== null) app[key](item)
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
    />
</slot>