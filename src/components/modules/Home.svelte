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

    // #ROUTER

    router.router_add(0, 'home', 0)
</script>

<!-- #HTML -->

<div
id="home"
>
    <div>
        <div
        class="bg"
        style:--url="url({$page.url.origin}/src/assets/images/glitch_1920.jpg)"
        >
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
                            {#each ['presentation', 'competences', 'projets'] as section, id}
                                <li>
                                    <a
                                    href="{$page.url.origin}/{['presentation', 'competence', 'project'][id]}"
                                    alt="LE THUAUT Morgan - {section}"
                                    on:click|preventDefault={router.router_setPage.bind(router, id + 1)}
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

    @use '../../assets/scss/styles/grid' as *;
    @use '../../assets/scss/styles/grid' as *;
    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/cursor' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #HOME */

    #home
    {
        @include relative;
        @include glow(100%, 30%);

        flex-shrink: 0;
    
        overflow: hidden;

        width: 100vw;
        height: 100vh;

        padding-block: 70px 30px;

        box-sizing: border-box;

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
    
        &>div
        {
            @include flex;
            @include f-column;
            @include relative;
            @include any;

            padding-inline: 5%;

            border-bottom: solid $o-primary 4px;

            box-sizing: border-box;
        }

        .bg
        {
            @include xy-start(true);
            @include any;

            &::before, &::after
            {
                @include any;
                @include glitch(false);

                background-image: var(--url);
            }
            &::before
            {
                @include xy-start(true);
        
                content: '';
            }
            &::after
            {
                @include absolute;

                top: 0;
                right: 0;
    
                transform: scaleX(-1);
            }
        }

        @include media-min(768px)
        {
            width: calc(100% - 100vw);

            &>div
            {
                flex-direction: row;

                padding-inline: 0;

                border-right: solid rgba($s-light, .3) 4px;
            }

            .bg
            {
                &::before, &::after { width: 50%; }
                &::after { content: ''; }
            }
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
        @include any;

        justify-content: space-between;

        gap: 20px;

        padding-block: 10px;

        box-sizing: border-box;

        .me
        {
            @include absolute;
            @include no-event;

            bottom: 0;
            right: 0;

            transform: scaleX(-1);

            opacity: .3;

            height: 70%;

            mix-blend-mode: screen;

            object-position: bottom;
            object-fit: cover;

            transition: transform .6s;

            @include media-min-max(1024px, 584px, true) { transform: translateX(0) scaleX(1); }

            /* @include media-max(768px, 374px) { left: 0; } */
        }

        .lang, .scroll-icon
        {
            @include p-interact;

            opacity: 0.7;
        }
        .scroll-icon
        {
            @include flex;
            @include f-a-center;

            opacity: 0;

            @include media-min(1024px, 475px)
            {
                opacity: 1;

                gap: 10px;
            }
        }

        @include media-min(768px)
        {
            @include relative;
            @include any-h;
    
            width: 50%;
    
            padding-block: 20px;
            padding-left: 2.5%;

            .me { @include any-h; }
        }
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

        margin: 0 auto;

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

            margin-block: 10px;

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

            section { align-self: flex-start; }
        }
        @include media-min(768px) { padding-right: 5%; }
        @include media-min(1024px)
        {
            padding: 0 12% 5% 0;

            h1
            {
                gap: 20px;
    
                margin-top: 20px;
            }
        }
    
        @include media-min-max(1024px, 584px, true)
        {
            flex-direction: row;
            justify-content: space-between;

            height: auto;

            section { @include f-column; }

            ul
            {
                flex-direction: row;
                justify-content: flex-end;

                gap: 0;
            }

            h1
            {
                margin-bottom: 0;

                &>span { gap: 3px; }
            }
        }
    }

    .manager
    {
        @include flex;
        @include any;

        align-items: flex-end;
        flex-grow: 1;

        z-index: 2;

        overflow: auto;

        max-height: 100%;

        @include media-min(768px)
        {
            @include f-center;

            width: 50%;

            padding-block: 30px;

            box-sizing: border-box;
        }

        @include media-max(768px, 666px) { display: none; }
    }
</style>