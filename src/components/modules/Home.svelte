<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/home.scss'

        // --CONTEXT
        import { router } from '../field/Main.svelte'

        // --SVELTE
        import { page } from '$app/stores'

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
>
    <div>
        <div
        class="bg"
        >
            <div
            style:background-image="url({$page.url.origin}/src/assets/images/glitch_1920.jpg)"
            >
            </div>
            <div
            style:background-image="url({$page.url.origin}/src/assets/images/glitch_1920.jpg)"
            >
            </div>
        </div>

        <div
        class="content"
        >
            <img
            class="me"
            src="{$page.url.origin}/src/assets/images/me.png"
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
                                    href="{$page.url.origin}/{['presentation', 'competence', 'project'][i]}"
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
                            _color={_colors.primary}
                            >
                                <E />
                            </Icon>
                            B
                        </span>
    
                        <Icon
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
    /* #USES */

    /* @use 'sass:map'; */

    @use '../../assets/scss/styles/grid' as *;
    @use '../../assets/scss/styles/grid' as *;
    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/cursor' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #GROUPS */

    #home
    {
        @include relative;
        @include glow;
    
        overflow: hidden;

        width: calc(100% - 100vw);
        height: 100vh;

        padding: 70px 0 30px;

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
    
                width: 50%;
            }

            div:nth-child(2) { transform: scaleX(-1) }
        }

        &>div
        {
            @include flex;
            @include relative;
            @include any;

            border-right: solid rgba($s-light, .3) 4px;
            border-bottom: solid $o-primary 4px;

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

        @include media-min(1024px)
        {
            padding-left: 20px;

            &>div { border-left: solid $dark 8px; }
        }
    }

    .content
    {
        @include flex;
        @include f-column;
        @include relative;
        @include any-h;

        justify-content: space-between;

        width: 50%;

        padding-block: 1%;

        box-sizing: border-box;

        .me
        {
            @include absolute;
            @include any-h;
            @include no-event;

            bottom: 0;
            right: 0;

            transform: scaleX(-1);

            opacity: .3;

            mix-blend-mode: screen;

            object-position: bottom;
            object-fit: cover;

            transition: transform .6s;

            @include media-min(768px, 940px) { transform: translateX(-50%) scaleX(-1); }
        }

        .lang, .scroll-icon
        {
            @include p-interact;

            opacity: 0.7;
        }
        .lang { margin: 10px 0 0 20px; }
        .scroll-icon
        {
            @include flex;
            @include f-a-center;

            opacity: 0;
        }

        @include media-min(768px)
        {
            padding-left: 2.5%;
    
            .lang { margin: 0; }
        }
        @include media-min(1024px)
        {
            .me { transform: translateX(0) scaleX(1); }

            .scroll-icon
            {
                opacity: 1;

                gap: 10px;
            }
        }

        @include media-max(768px, 375px) { padding-top: 0; }
    }

    .main
    {
        @include flex;
        @include f-column;
        @include any-h;

        justify-content: space-around;
        align-items: flex-end;
        
        z-index: 2;

        width: max-content;

        margin: auto;

        box-sizing: border-box;

        section
        {
            @include flex;
            @include f-a-center;

            flex-direction: column-reverse;
        }

        nav { @include any-w; }

        ul
        {
            @include flex;
            @include f-column;
            @include any-w;

            align-items: flex-start;

            gap: 3px;
        }

        a { @include a-interact; }

        h1
        {
            @include flex;
            @include f-column;
            @include relative;
            @include h-1;
            @include no-event;

            align-items: flex-end;

            gap: 10px;

            opacity: .95;

            margin-block: 20px;

            &::before
            {
                @include absolute;
    
                content: '';

                bottom: 0;
                left: 4px;

                width: 86%;
                height: 63%;

                border-left: solid $secondary 2px;
                border-bottom: solid $secondary 2px;
            }

            &>span { @include flex; }
        }

        @include media-min(425px)
        {
            @include any-w;

            margin: 0;
            padding-inline: 5%;

            section { align-self: flex-start; }
        }
        @include media-min(768px)
        {
            flex-direction: row;
            justify-content: space-between;

            height: auto;
    
            padding-bottom: 5%;
            padding-left: 0;

            section { @include f-column; }

            ul
            {
                flex-direction: row;
                justify-content: flex-end;

                gap: 0;
            }

            h1
            {
                gap: 20px;

                margin-bottom: 0;

                &>span { gap: 3px; }
            }
        }
        @include media-min(1024px) { padding-right: 12%; }

        @include media-max(768px, 375px)
        {
            @include any-w;

            section
            {
                @include any-w;
        
                flex-direction: row;
                justify-content: space-around;
            }
            
            nav { width: auto; }
        }
    }

    .manager
    {
        @include flex;
        @include f-j-center;

        align-items: flex-start;

        z-index: 2;

        width: 50%;

        @include media-min(768px) { @include f-a-center; }
    }
</style>