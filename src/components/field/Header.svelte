<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _iconColor = '#FFF'

    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/header.scss'

        // --SVELTE
        import { page } from '$app/stores'

        // --COMPONENT-COVER
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICONS
        import Logo from '../icons/Logo.svelte'
        import LinkedIn from '../icons/LinkedIn.svelte'
</script>

<!-- #HTML -->

<header>
    <div
    data-sveltekit-reload
    >
        <Icon
        _size="30px"
        _href={$page.url.origin}
        _alt="home"
        _color={_iconColor}
        >
            <Logo />
        </Icon>
            
        <p>
            <strong>EE</strong>

            . LE THUAUT MORGAN
        </p>
    </div>

    <Icon
    _size="30px"
    _href="https://www.linkedin.com/in/le-thuaut-morgan/"
    _alt="link to my linkedIn profile"
    _color={_iconColor}
    >
        <LinkedIn />
    </Icon>
</header>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/cursor' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #GROUPS */

    header
    {
        @include flex;
        @include f-a-center;
        @include absolute;
        @include any-w;
        @include no-event;

        justify-content: space-between;

        z-index: 2;

        height: 70px;

        padding-inline: 20px;

        box-sizing: border-box;

        div
        {
            @include flex;

            align-items: center;
        }

        p
        {
            @include flex;
            @include p-interact($light);

            align-items: flex-end;
            flex-wrap: wrap;
            align-self: flex-end;

            gap: 10px;
    
            margin-left: 15px;

            @include media-min(425px) { margin-left: 30px; }
        }
        strong
        {
            color: $primary;
            font-size: 12px;
            font-weight: 900;
        }

        @include media-min(768px) { padding-inline: 60px; }
    }
</style>