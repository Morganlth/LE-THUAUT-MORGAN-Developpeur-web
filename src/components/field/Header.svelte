<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _iconColor = '#FFF'

    // #IMPORTS

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

            &nbsp;. LE THUAUT MORGAN
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
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/font.scss',
    '../../assets/scss/styles/cursor.scss';

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

        padding: 0 60px;

        box-sizing: border-box;

        div
        {
            @include flex;

            align-items: flex-end;
        }

        p
        {
            @include text-info($light);
    
            margin-left: 30px;
        }
        strong
        {
            color: $primary;
            font-size: 12px;
            font-weight: 900;
        }
    }
</style>