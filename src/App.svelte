<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // #SCSS
        import colors from './assets/scss/modules/variables.module.scss'
        import './assets/scss/app.scss'

        // #SVELTE
        import { onMount } from 'svelte'

        // #FIELD
        import Header from './components/field/Header.svelte'
        import Main from './components/field/Main.svelte'

    // #FUNCTION

    function set()
    {
        const app = document.body.firstElementChild
        
        app.style.backgroundColor = colors.dark
        app.style.opacity = 1
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