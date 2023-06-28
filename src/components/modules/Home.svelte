<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _width,
        _colors

    // #IMPORTS

        // --CONTEXT
        import { router } from '../field/Main.svelte'

        // --SVELTE
        import { onMount } from 'svelte'

        // --COMPONENT-ELEMENTS
        import TicTacToe from '../elements/TicTacToe.svelte'
        import Console from '../elements/Console.svelte'

        // --COMPONENT-COVER
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICONS
        import E from '../icons/E.svelte'
        import Logo from '../icons/Logo.svelte'
        import Mouse from '../icons/Mouse.svelte'

    // #ROUTER-SET

    router.add(0, 'home', 0)
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
                                    href="./{['presentation', 'competence', 'project'][i]}"
                                    alt="LE THUAUT Morgan - {section}"
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
                {_colors}
                />
            </div>

            <div
            class="scroll-icon"
            >
                <Icon
                _transform="rotate(-90deg)"
                _size="20px"
                _spring={false}
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

    /* #GROUPS */

    #home
    {
        @include relative;
        @include glow;
    
        overflow: hidden;

        height: 100vh;

        padding: 70px 0 30px 20px;

        box-sizing: border-box;

        .bg
        {
            @include flex;
            @include xy-start(true);
            @include any;

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
            @include relative;
            @include any;

            border-right: solid rgba($s-light, .3) 4px;
            border-bottom: solid $o-primary 4px;
            border-left: solid $dark 8px;

            box-sizing: border-box;
        }
    
        &::before
        {
            @include absolute;
            @include any-h;

            content: '';

            top: 0;
            right: 0%;

            width: 10%;

            background: linear-gradient(90deg, transparent 0%, $dark 50%);
        }
    }

    .content
    {
        @include flex;
        @include f-column;
        @include relative;
        @include any-h;

        justify-content: space-between;

        width: $width;

        padding: 1% 0 1% 2.5%;

        box-sizing: border-box;

        .me
        {
            @include absolute;
            @include any-h;
            @include no-event;

            bottom: 0;
            right: 0;

            opacity: .3;

            width: 43%;

            mix-blend-mode: screen;

            object-position: bottom;
            object-fit: cover;
        }

        .lang,
        .scroll-icon
        {
            @include text-info;

            opacity: 0.7;
        }
        .scroll-icon
        {
            @include flex;
            @include f-a-center;

            gap: 10px;
        }
    }

    .main
    {
        @include flex;
        @include relative;

        align-items: flex-end;
        gap: 34%;

        z-index: 2;

        margin-bottom: 5%;

        section
        {
            @include flex;
            @include f-column;

            align-items: flex-end;
        }

        ul { @include flex; }

        a { @include link; }

        h1
        {
            @include flex;
            @include f-column;
            @include relative;
            @include title-1;
            @include no-event;

            align-items: flex-end;
            gap: 20px;

            opacity: .95;

            margin-top: 20px;

            &::before
            {
                @include absolute;
    
                content: '';

                bottom: 0;
                left: 4px;

                width: 88%;
                height: 63%;

                border-left: solid $secondary 2px;
                border-bottom: solid $secondary 2px;
            }
        }

        span
        {
            @include flex;

            gap: 5px;
        }
    }

    .manager
    {
        @include f-center(true);
        @include relative;

        z-index: 2;

        width: $width;
    }
</style>