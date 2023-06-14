<!-- #SCRIPT -->

<script>
    // #EXPORT

        // #PROP
        export let _iconColor = '#FFF'

    // #IMPORT

        // #COVER
        import Icon from '../covers/Icon.svelte'

        // ICONS
        import Logo from '../icons/Logo.svelte'
        import LinkedIn from '../icons/LinkedIn.svelte'
</script>

<!-- #HTML -->

<header>
    <div>
        <Icon
        _size="30px"
        _href="./"
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
    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/font.scss';

    header
    {
        @include flex;
        @include f-a-center;
        @include absolute;
        @include any-w;

        justify-content: space-between;

        height: 60px;

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