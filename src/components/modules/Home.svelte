<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _width,
        _colors

    // #IMPORTS

        // #ELEMENTS
        import TicTacToe from '../elements/TicTacToe.svelte'
        import Console from '../elements/Console.svelte'

        // #COVER
        import Icon from '../covers/Icon.svelte'

        // ICONS
        import E from '../icons/E.svelte'
        import Logo from '../icons/Logo.svelte'
        import Mouse from '../icons/Mouse.svelte'

    // #FUNCTION

    function linkClick()
    {
        const 
        element = document.getElementById(['presentation', 'competence', 'project'][this]),
        parent = element.parentNode,
        offsetTop = parent.offsetTop + element.offsetTop,
        offsetLeft = parent.offsetLeft + element.offsetLeft

        document.querySelector('main').scrollTo({ top: offsetTop + offsetLeft })
    }
</script>

<!-- #HTML -->

<div
id="home"
style:width={_width}
>
    <div>
        <div
        class="bg"
        >
            <div></div>
            <div></div>
        </div>

        <div
        class="content"
        >
            <img
            class="me"
            src="./src/assets/images/me.png"
            alt="LE THUAUT Morgan"
            >

            <p
            class="lang"
            >
                FR
            </p>

            <div
            class="main"
            >
                <section>
                    <nav>
                        <ul>
                            {#each ['presentation', 'competences', 'projets'] as section, i}
                                <li>
                                    <a
                                    href="#{section}"
                                    on:click|preventDefault={linkClick.bind(i)}
                                    >
                                    &nbsp; #{section}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </nav>
    
                    <h1>
                        <span>
                            D
                            <Icon
                            _transform="rotate(-90deg)"
                            _size="60px"
                            _color={_colors.primary}
                            >
                                <E />
                            </Icon>
                            VELOPPEUR
                        </span>
    
                        <span>
                            W
                            <Icon
                            _transform="rotate(-90deg)"
                            _size="60px"
                            _color={_colors.primary}
                            >
                                <E />
                            </Icon>
                            B
                        </span>
    
                        <Icon
                        _size="60px"
                        _color={_colors.primary}
                        >
                            <Logo />
                        </Icon>
                    </h1>
                </section>

                <TicTacToe
                _defaultColor={_colors.sLight}
                _defeatColor={_colors.dark}
                _playerColor={_colors.primary}
                _aiColor={_colors.secondary}
                />
            </div>

            <div
            class="scroll-icon"
            >
                <Icon
                _transform="rotate(-90deg)"
                _size="20px"
                _color={_colors.sLight}
                >
                    <Mouse />
                </Icon>

                <p>SCROLL</p>
            </div>
        </div>

        <div
        class="manager"
        >
            <Console />
        </div>
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/grid.scss',
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #VARIABLE */

    $width: 50%;

    /* #COMMON */

    .bg,
    .content,
    .main,
    section,
    ul,
    h1,
    h1>span,
    .scroll-icon
    { @include flex; }

    .content,
    section
    { @include f-column; }

    #home::before,
    #home::after,
    .me,
    h1::before
    { @include absolute; }

    #home,
    #home>div,
    .content,
    .manager,
    section,
    h1
    { @include relative; }

    .main,
    section,
    h1
    { align-items: flex-end; }

    #home,
    #home>div,
    .content
    { box-sizing: border-box; }

    .me,
    h1
    { @include no-event; }

    /* #GROUPS */

    #home
    {
        overflow: hidden;

        height: 100vh;

        padding: 70px 0 30px 30px;

        .bg
        {
            @include xy-start(true);
            @include any;
            @include glow(30px);

            div
            {
                @include any-h;
                @include glitch(false);
    
                width: $width;
            }

            div:nth-child(2)
            {
                transform: scaleX(-1)
            }
        }

        &
        >div
        {
            @include flex;
            @include any;

            border-right: solid rgba($s-light, .3) 4px;
            border-bottom: solid $o-primary 4px;
        }

        &::before,
        &::after
        {
            @include any-h;

            content: '';

            top: 0;
        }
    
        &::before
        {
            right: 0%;

            width: 10%;

            background: linear-gradient(90deg, transparent 0%, $dark 50%);
        }
        &::after
        {
            left: 45%;

            opacity: 0.3;

            width: 4px;

            background-color: $secondary;
        }
    }

    .content
    {
        @include any-h;

        justify-content: space-between;

        width: $width;

        padding: 1% 0 1% 2%;

        .me
        {
            @include any-h;

            bottom: 0;
            right: 0;

            opacity: 0.3;

            width: 43%;

            object-position: bottom;
            object-fit: cover;
        }

        .lang,
        .scroll-icon
        {
            @include text-secondary($s-light);

            opacity: 0.8;
        }
        .scroll-icon
        {
            @include f-a-center;

            gap: 10px;
        }
    }

    .main
    {
        gap: 35%;

        margin-bottom: 5%;

        a { @include link; }

        h1
        {
            @include f-column;

            gap: 20px;

            margin-top: 20px;

            color: $light;
            font-family: 'Montserrat';
            font-size: 86px;
            font-weight: 900;
            line-height: 60px;
            letter-spacing: -3px;

            &::before
            {
                content: '';

                bottom: 0;
                left: 4px;

                width: 88%;
                height: 63%;

                border-left: solid $secondary 2px;
                border-bottom: solid $secondary 2px;
            }
        }

        span { gap: 5px; }
    }

    .manager
    {
        @include f-center(true);

        width: $width;
    }
</style>