<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _translateY,
        _iconColor

    // #IMPORTS

        // --SVELTE
        import { page } from '$app/stores'

        // --COMPONENT-COVER
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICON
        import Logo from '../icons/Logo.svelte'
</script>

<!-- #HTML -->

<header
style:transform="translateY(-{_translateY ?? 0}%)"
>
    <div
    data-sveltekit-reload
    >
        <Icon
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

    /* #HEADER */

    header
    {
        @include flex;
        @include f-a-center;
        @include absolute;
        @include any-w;
        @include no-event;

        --icon-size: 25px;

        justify-content: space-between;

        z-index: 2;

        height: 70px;

        padding-inline: 20px;

        box-sizing: border-box;

        transition: transform .4s ease;

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

        @include media-min(425px, 650px) { --icon-size: 30px; }
        @include media-min(768px, 475px) { padding-inline: 60px; }
    }
</style>