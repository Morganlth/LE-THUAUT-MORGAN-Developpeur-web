<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORTS
   
        // --CONTEXTS
        import { app, event, wwindow, router, spring } from '../field/Main.svelte'

        // --JS
        import fps_get from '../../assets/js/utils/fps'

        // --SVELTE
        import { onMount, onDestroy, tick } from 'svelte'
        import { fade } from 'svelte/transition'

        // --COMPONENT-ELEMENTS
        import Snake from '../elements/Snake.svelte'
        import Tag from '../elements/Tag.svelte'
        import Toggle from '../elements/Toggle.svelte'

        // --COMPONENT-COVERS
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICONS
        import Cross from '../icons/Cross.svelte'
        import Side from '../icons/Side.svelte'

    // #CONSTANTES

        // --ELEMENT-PRESENTATION
        const
        PRESENTATION_ID = 1,
        PRESENTATION_PARAMS =
        [
            {
                on: true,
                name: 'text',
                content: 'LE TEXTE',
                update: presentation_updateText
            },
            {
                on: true,
                name: 'snake',
                content: 'LE SERPENT',
                update: presentation_updateSnake
            },
            {
                on: false,
                name: 'fps',
                content: 'LES FPS',
                update: presentation_updateFps
            }
        ],
        PRESENTATION_MODES =
        [
            {
                on: false,
                name: 'read',
                text: true,
                snake: false,
                content: 'LECTURE'
            },
            {
                on: true,
                name: 'play',
                text: null, // auto
                snake: true,
                content: 'JOUER'
            },
            {
                on: false,
                name: 'challenge',
                text: false,
                snake: true,
                content: 'CHALLENGE'
            }
        ]

        // --ELEMENT-TAG
        const TAG_ELEMENTS =
        [
            {
                title: 'NOM - PRÉNOM',
                content: ['LE THUAUT Morgan']
            },
            {
                title: 'AGE',
                content: ['21 ans']
            },
            {
                title: 'PROFESSION',
                content: ['Développeur Web', 'Objectif suivant: FULL STACK', 'Objectif futur: aucune limite tant que j\'ai la soif d\'apprendre']
            },
            {
                title: 'LOCALITÉ',
                content: ['Bretagne - FRANCE']
            },
            {
                title: 'ÉTUDES - FORMATIONS',
                content: ['Lycée Jeanne d\'Arc PONTIVY - bac S SVT spécialité MATHS', 'OpenClassrooms - formation de Développeur Web']
            },
            {
                title: 'CONTACT',
                content: ['Tel:  06 09 23 72 08', 'Email:  lethuaut.morgan@gmail.com', { label: 'LinkedIn', link: 'https://www.linkedin.com/in/le-thuaut-morgan/' }]
            }
        ],
        TAG_GAMEOVER = { on: false },
        TAG_MOBILE = { on: false }

    // #VARIABLES

        // --EVENT-CONTEXT
        let event_GRABBING = event.event_GRABBING

        // --ELEMENT-PRESENTATION
        let
        presentation,
        presentation_BLOCKSIZE = 40

        // --ELEMENT-TAG
        let
        tag_CONTAINER,
        tag_CHARGED = false,
        tag_FONTCHARGED = false,
        tag_Z = 0,
        tag_INDEX = 0,
        tag_SAVE = -1

        // --ELEMENT-SNAKE
        let
        snake_SCORE,
        snake_TAIL = [0, 0],
        snake_INVINCIBLE = false,
        snake_resetSize,
        snake_resetGame,
        snake_updateEvent,
        snake_animation,
        snake_updateClientRect

        // --ELEMENT-FRAME
        let
        frame_FPS = 0,
        frame_TRANSLATEX = 100

    // #REACTIVE

        // --ELEMENT-PRESENTATION
        $: presentation_$TEXT = PRESENTATION_PARAMS.find(p => p.name === 'text').on
        $: presentation_$SNAKE = PRESENTATION_PARAMS.find(p => p.name === 'snake').on
        $: presentation_$FPS = PRESENTATION_PARAMS.find(p => p.name === 'fps').on
        $: presentation_$CHALLENGE = PRESENTATION_MODES.find(m => m.name === 'challenge').on

        // --ELEMENT-TAG
        $: tag_update(snake_TAIL)

        // --ELEMENT-SNAKE
        $: snake_updateEvent instanceof Function && tag_CHARGED
        ? snake_updateEvent(!$event_GRABBING && snake_test())
        : null // set default desktop event snake

    // #FUNCTIONS

        // --SET
        function presentation_set()
        {
            tag_set()
    
            presentation_setVar()
            presentation_setCommand()
            presentation_setEvent()
            presentation_setRouter()
        }

        function tag_set()
        {
            document.fonts.ready.then(() =>
            {
                tag_FONTCHARGED = true

                tick().then(() =>
                {
                    if (presentation_$TEXT && !presentation_$SNAKE) tag_showAll()

                    mobile_update(wwindow.window_MOBILE && presentation_$SNAKE)

                    tag_CHARGED = true
                })
            })
        }

        function presentation_setVar() { presentation_BLOCKSIZE = wwindow.window_testSmallScreen() ? 30 : presentation_BLOCKSIZE }

        function presentation_setCommand()
        {
            app.app_add('presentation_text', presentation_text, true)
            app.app_add('presentation_snake', presentation_snake, true)
            app.app_add('presentation_fps', presentation_fps, true)
        }

        function presentation_setEvent() { event.event_add('resize', presentation_resize) }

        function presentation_setRouter() { router.router_add(PRESENTATION_ID, 'presentation', presentation_getOffset(), presentation_call) }

        async function presentation_setFps()
        {
            frame_FPS = await fps_get()

            if (presentation_$FPS) presentation_setFps()
        }

        function presentation_setItem(key, value) { localStorage.setItem('presentation_' + key, value) }

        function snake_setInvincibleTime() { setTimeout(() => snake_INVINCIBLE = false, 500) }

        function gameover_setGame()
        {
            snake_resetSize(false)
            snake_resetGame()
            gameover_update(false)
            snake_updateEvent(true)
        }

        function mobile_setGame()
        {
            snake_resetGame()
            mobile_updateGame(true)
            mobile_update(false)
            snake_updateEvent(true)
        }

        // --GET
        function presentation_getOffset() { return presentation[wwindow.window_testSmallScreen() ? 'offsetTop' : 'offsetLeft'] }

        function presentation_getParam(name) { return PRESENTATION_PARAMS.find(p => p.name === name) }

        function presentation_getMode(text, snake)
        {
            return snake ?? presentation_getParam('snake').on
            ? 'play'
            : text ?? presentation_getParam('text').on
                ? 'read'
                : 'none'
        }

        function tag_getGap()
        {
            const HEIGHT = window.innerHeight - presentation_BLOCKSIZE * 3

            return (HEIGHT - TAG_ELEMENTS.reduce((a, tag) => a += tag.height, 0)) / (TAG_ELEMENTS.length - 1)
        }

        // --RESTORE
        function tag_restore()
        {
            if (tag_SAVE > -1 && !TAG_MOBILE.on)
            {
                tag_INDEX = tag_SAVE

                tag_update(snake_TAIL)
            }
        }

        // --RESET
        function tag_reset()
        {
            if (!tag_FONTCHARGED) return

            TAG_GAMEOVER.reset()
            TAG_MOBILE.reset()
    
            for (const TAG of TAG_ELEMENTS) TAG.reset()
        }

        // --UPDATE
        function presentation_updateVar(smallScreen)
        {
            const SIZE = smallScreen ? 30 : 40

            if (presentation_BLOCKSIZE !== SIZE)
            {
                if (localStorage.getItem('snake_size') == presentation_BLOCKSIZE) app.app_COMMANDS['snake_size'](SIZE)

                presentation_BLOCKSIZE = SIZE
            }
        }

        function presentation_updateParam(name, on)
        {
            const PARAM = presentation_getParam(name)

            if (PARAM.on === on) return null

            PARAM.on = on ?? !PARAM.on
            PRESENTATION_PARAMS[PARAM] = PARAM // svelte
            presentation_setItem(PARAM.name, PARAM.on)

            if (on == undefined) { PARAM.update(PARAM.on) } else return PARAM 
        }

        function presentation_updateParamPair(text_ON, snake_ON)
        {
            const
            TEXT = presentation_updateParam('text', text_ON),
            SNAKE = presentation_updateParam('snake', snake_ON)

            tick().then(() =>
            {
                if (TEXT) TEXT.update(text_ON)
                if (SNAKE) SNAKE.update(snake_ON)
            })
        }

        function presentation_updateMode(mode, param)
        {
            for (const MODE of PRESENTATION_MODES)
                if (MODE.name === mode)
                    if (MODE.on)
                        return
                    else
                        MODE.on = true,
                        PRESENTATION_MODES[MODE] = MODE, // svelte
                        TAG_GAMEOVER.on
                        ? gameover_update(false)
                        : null,
                        param
                        ? presentation_updateParamPair(MODE.text ?? presentation_$TEXT, MODE.snake ?? presentation_$SNAKE)
                        : null
                else if (MODE.on)
                    MODE.on = false,
                    PRESENTATION_MODES[MODE] = MODE // svelte
        }

        function presentation_updateText(on)
        {
            if (tag_FONTCHARGED)
            {
                on
                ? presentation_$SNAKE
                    ? tag_restore()
                    : tag_showAll()
                : tag_hideAll()
            }
        }

        function presentation_updateSnake(on)
        {
            if (presentation_$TEXT && tag_FONTCHARGED) on ? (tag_hideAll(), tag_restore()) : tag_showAll()
    
            if (on) app.app_updateMode(false)

            wwindow.window_MOBILE
            ? (!TAG_MOBILE.on ? mobile_updateGame(false) : null, mobile_update(on))
            : snake_animation(on)
        }

        function presentation_updateFps(on) { if (on) presentation_setFps() }

        function tag_update([x, y])
        {
            if (presentation_$TEXT && tag_FONTCHARGED)
            {
                if (tag_INDEX === TAG_ELEMENTS.length) tag_INDEX = 0
                if (tag_SAVE > -1) TAG_ELEMENTS[tag_SAVE].hide()

                tag_SAVE = tag_INDEX

                const TAG = TAG_ELEMENTS[tag_INDEX++]
    
                ;[x, y] = [tag_testPosition(window.innerWidth, TAG.width, x), tag_testPosition(window.innerHeight, TAG.height, y)]

                TAG.show(x, y, 100)
            }
        }
    
        async function gameover_update(on)
        {
            TAG_GAMEOVER.on = on
    
            await TAG_GAMEOVER[on ? 'show' : 'hide']()
           
            if (presentation_$SNAKE) snake_animation(!on)
            
            on ? (snake_updateEvent(false), spring.spring_mouseLeave()) : (snake_INVINCIBLE = true, snake_setInvincibleTime())
        }

        async function mobile_update(on)
        {
            if (tag_FONTCHARGED)
            {
                if (on && tag_SAVE > -1) await TAG_ELEMENTS[tag_SAVE].hide()
                if (on && TAG_GAMEOVER.on)
                    snake_resetSize(false),
                    TAG_GAMEOVER.on = false,
                    await TAG_GAMEOVER.hide()
    
                TAG_MOBILE.on = on
                TAG_MOBILE[on ? 'show' : 'hide']()
            }
        }

        function mobile_updateGame(on)
        {
            const START = presentation_getParam('snake').on && on

            START
            ? event.event_scrollTo(presentation_getOffset())
            : snake_updateEvent(false)

            event.event_SNAKE_MOBILE_START_GAME = START
            app.app_FREEZE.set(START)
            snake_animation(START)
        }

        // --DESTROY
        function presentation_destroy() { event.event_remove('resize', presentation_resize) }

        // --COMMANDS
        function presentation_text(on)
        {
            on = app.app_testDefault(on) ? true : app.app_testBoolean(on)

            ;((mode = presentation_getMode(on)) => presentation_updateMode(mode, false))()
            ;((text = presentation_updateParam('text', on)) => text ? text.update(on) : null)()
    
            app.app_success('presentation text - ' + on)
        }

        function presentation_snake(on)
        {
            on = app.app_testDefault(on) ? true : app.app_testBoolean(on)

            ;((mode = presentation_getMode(null, on)) => presentation_updateMode(mode, false))()
            ;((snake = presentation_updateParam('snake', on)) => snake ? snake.update(on) : null)()

            app.app_success('presentation snake - ' + on)
        }

        function presentation_fps(on)
        {
            on = app.app_testDefault(on) ? false : app.app_testBoolean(on)
        
            ;((fps = presentation_updateParam('fps', on)) => fps ? fps.update(on) : null)()

            app.app_success('presentation fps - ' + on)
        }

        // --EVENTS
        async function presentation_click(e)
        {
            if (e.target.classList.contains('screen-shield'))
                if (TAG_GAMEOVER.on) gameover_setGame()
                else if (TAG_MOBILE.on) mobile_setGame()
        }

        async function presentation_touchStart(e)
        {
            if (snake_test()) return

            snake_updateClientRect()
        }

        async function presentation_mouseLeave() { if (spring.spring_LOCK) spring.spring_mouseLeave() }

        async function presentation_click_param()
        {
            if (this !== 'fps')
            {
                const [TEXT_ON, SNAKE_ON] = this === 'text'
                ? [!presentation_$TEXT, !presentation_$TEXT ? presentation_$SNAKE : true]
                : [!presentation_$SNAKE ? presentation_$TEXT : true, !presentation_$SNAKE]

                presentation_updateMode(presentation_getMode(TEXT_ON, SNAKE_ON), false)
                presentation_updateParamPair(TEXT_ON, SNAKE_ON)
            }
            else presentation_updateParam(this)
        }

        async function presentation_click_mode()
        {
            if (this === 'challenge') snake_resetSize(true)

            presentation_updateMode(this, true)
        }

        async function presentation_resize(smallScreen)
        {
            router.router_updatePageStart(PRESENTATION_ID, presentation_getOffset())

            tag_reset()

            presentation_updateVar(smallScreen)
            presentation_updateText(presentation_$TEXT)

            if (snake_test()) snake_updateEvent(true)
            if (wwindow.window_MOBILE && !TAG_MOBILE.on) mobile_updateGame(false)

            mobile_update(wwindow.window_MOBILE && presentation_$SNAKE)
        }

        async function options_click()
        {
            (frame_TRANSLATEX = frame_TRANSLATEX ? 0 : 100)
            ? (snake_test()
                ? snake_updateEvent(true)
                : null,
              snake_setInvincibleTime())
            : (snake_updateEvent(false), snake_INVINCIBLE = true)
        }

        async function options_mouseLeave(e)
        {
            const TARGET = e.relatedTarget

            if (!TARGET || TARGET.classList.contains('icon')) return
        
            snake_setInvincibleTime()

            frame_TRANSLATEX = 100
            
            if (snake_test()) snake_updateEvent(true)
        }

        async function mobile_clickCross()
        {
            mobile_updateGame(false)
            mobile_update(presentation_$SNAKE)
        }

        // --ROUTER-CALL
        function presentation_call() { if (presentation_$SNAKE && wwindow.window_MOBILE === false) snake_updateClientRect() }

        // --TESTS
        function tag_testPosition(size, tagSize, coord)
        {
            if (coord < presentation_BLOCKSIZE) coord = presentation_BLOCKSIZE
            else
            {
                const TOTAL = coord + tagSize + presentation_BLOCKSIZE

                if (TOTAL > size) coord -= TOTAL - size
            }

            return coord
        }

        function snake_test() { return presentation_$SNAKE && !TAG_GAMEOVER.on && !TAG_GAMEOVER.on && (wwindow.window_MOBILE ? !TAG_MOBILE.on : true) }

        // --UTILS
        function tag_showAll() { wwindow.window_MOBILE ? tag_showAllMobile() : tag_showAllDesktop() }

        function tag_showAllDesktop()
        {
            const GAP = tag_getGap()

            let y = presentation_BLOCKSIZE * 1.5

            for (const TAG of TAG_ELEMENTS)
            {
                const X = Math.random() * (window.innerWidth - TAG.width - presentation_BLOCKSIZE * 2) + presentation_BLOCKSIZE
        
                TAG.show(X, y)

                y += TAG.height + GAP
            }
        }

        function tag_showAllMobile()
        {
            let i = 0

            for (const TAG of TAG_ELEMENTS)
            {
                const
                X = (window.innerWidth - TAG.width - presentation_BLOCKSIZE * 2) / 2 + window.innerWidth * i++,
                Y = Math.random() * (window.innerHeight - TAG.height - presentation_BLOCKSIZE * 4) + presentation_BLOCKSIZE * 2
        
                TAG.show(X, Y)
            }

            tag_Z = 1
        }

        function tag_hideAll()
        {
            for (let i = 0; i < TAG_ELEMENTS.length; i++) TAG_ELEMENTS[i].hide()

            tag_CONTAINER.scrollTo({ left: 0, behavior: 'instant' })
            tag_Z = 0
        }

    // #CYCLES

    onMount(presentation_set)
    onDestroy(presentation_destroy)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
id="presentation"
bind:this={presentation}
on:click={presentation_click}
on:mouseleave={presentation_mouseLeave}
on:touchstart={presentation_touchStart}
>
    <div
    class="tag-container"
    style:z-index={tag_Z}
    style:overflow-x={tag_Z ? 'scroll' : 'hidden'}
    bind:this={tag_CONTAINER}
    >
        <div
        class="screen-shield"
        >
        </div>

        {#if tag_Z}
            <span
            class="tag-scroll"
            transition:fade
            >
                SCROLL
            </span>
        {/if}

        {#if tag_FONTCHARGED}
            {#each TAG_ELEMENTS as tag}
                <Tag
                _max_width="calc(100vw - {presentation_BLOCKSIZE * 3}px)"
                _dark={_colors.dark}
                bind:width={tag.width}
                bind:height={tag.height}
                bind:tag_reset={tag.reset}
                bind:tag_show={tag.show}
                bind:tag_hide={tag.hide}
                >
                    <h2>{tag.title}</h2>

                    <div
                    class="content"
                    >
                        {#each tag.content as text}
                            {#if text instanceof Object}
                                <a
                                href={text.link}
                                alt={text.label}
                                target="_blank"
                                >
                                    {text.label + ': ' + text.link}
                                </a>
                            {:else}
                                <p>{text}</p>
                            {/if}
                        {/each}
                    </div>
                </Tag>
            {/each}

            <div
            class="super-tag"
            >
                <Tag
                _center={true}
                _z={-1}
                _dark={_colors.dark}
                bind:tag_reset={TAG_GAMEOVER.reset}
                bind:tag_show={TAG_GAMEOVER.show}
                bind:tag_hide={TAG_GAMEOVER.hide}
                >
                    <h4>
                        &lt GAME
                        <br>
                        OVER &gt
                    </h4>

                    <p>CLICK POUR REJOUER</p>
                </Tag>
            </div>

            <div
            class="super-tag"
            >
                <Tag
                _center={true}
                _z={-1}
                _dark={_colors.dark}
                bind:tag_reset={TAG_MOBILE.reset}
                bind:tag_show={TAG_MOBILE.show}
                bind:tag_hide={TAG_MOBILE.hide}
                >
                    <h4>
                        &lt SNAKE
                        <br>
                        GAME &gt
                    </h4>

                    <p>CLICK POUR JOUER</p>
                </Tag>
            </div>
        {/if}
    </div>

    <Snake
    _challenge={presentation_$CHALLENGE}
    _gameover={{ on: TAG_GAMEOVER.on, update: gameover_update }}
    _invincible={snake_INVINCIBLE}
    _blockSize={presentation_BLOCKSIZE}
    {_colors}
    bind:snake_SCORE={snake_SCORE}
    bind:snake_TAIL={snake_TAIL}
    bind:snake_resetSize={snake_resetSize}
    bind:snake_resetGame={snake_resetGame}
    bind:snake_updateEvent={snake_updateEvent}
    bind:snake_animation={snake_animation}
    bind:canvas_updateClientRect={snake_updateClientRect}
    />

    <div
    class="frame"
    style:padding="30px {presentation_BLOCKSIZE}px"
    >
        <p
        class="score"
        >
            SCORE {snake_SCORE}
        </p>

        {#if presentation_$FPS}
            <p>
                FPS {frame_FPS}
            </p>
        {/if}

        <div
        class="container"
        >
            <Cell
            _style="border: none; cursor: pointer"
            on:click={options_click}
            >
                <Icon
                _color={_colors.sLight}
                >
                    <Side />
                </Icon>
            </Cell>

            {#if wwindow.window_MOBILE && presentation_$SNAKE && !TAG_MOBILE.on }
                <Cell
                _style="border: none; cursor: pointer"
                on:click={mobile_clickCross}
                >
                    <Icon
                    _color={_colors.sLight}
                    >
                        <Cross />
                    </Icon>
                </Cell>
            {/if}
        </div>

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
        class="options"
        style:transform="translateX({frame_TRANSLATEX}%)"
        style:padding="{presentation_BLOCKSIZE * 2}px {presentation_BLOCKSIZE}px"
        on:mouseleave={options_mouseLeave}
        >
            <nav>
                <section>
                    <h4>PARAMÈTRES</h4>

                    <ul>
                        {#each PRESENTATION_PARAMS as param}
                            <li>
                                <Cell
                                _style="display: block; width: 100%; border: none; cursor: pointer"
                                on:click={presentation_click_param.bind(param.name)}
                                >
                                    <Toggle
                                    _check={param.on}
                                    >
                                        AFFICHER {param.content}
                                    </Toggle>
                                </Cell>
                            </li>
                        {/each}
                    </ul>
                </section>

                <section>
                    <h4>MODES DE JEU</h4>

                    <ul>
                        {#each PRESENTATION_MODES as mode}
                            <li>
                                <Cell
                                _style="display: block; width: 100%; border: none; cursor: pointer"
                                on:click={presentation_click_mode.bind(mode.name)}
                                >
                                    <Toggle
                                    _check={mode.on}
                                    >
                                        {mode.content}
                                    </Toggle>
                                </Cell>
                            </li>
                        {/each}
                    </ul>
                </section>
            </nav>
        </div>
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/cursor' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #PRESENTATION */

    #presentation
    {
        @include relative;

        flex-shrink: 0;

        width: 100vw;
        height: 100vh;

        .tag-container
        {
            @include relative;
            @include any;

            overflow-y: hidden;

            .screen-shield
            {
                @include relative;
                @include any;
            }

            .tag-scroll
            {
                @include absolute;
                @include h-(rgba($light, .02), 50vh);

                top: 50%;
                left: 0;

                transform: translateY(-50%);

                letter-spacing: 10vh;
            }

            h2 { @include h-2($o-primary, 1.4); }

            .content
            {
                margin-left: 10px;
                padding: 4px 0 0 10px;

                border-top: solid 1px $o-primary;

                @include media-min(425px)
                {
                    margin-left: 30px;
                    padding: 10px 0 0 30px;
                }
            }

            p, a
            {
                @include p-content;

                color: $light;
            }
        }

        .super-tag
        {
            h4
            {
                @include h-1($light, 1);

                margin-bottom: 10px;
                white-space: nowrap;
            }

            p { text-align: center; }
        }
    
        .frame
        {
            @include flex;
            @include xy-start(true);
            @include any;
            @include no-event;

            justify-content: space-between;
            align-items: flex-end;

            z-index: 1;

            box-sizing: border-box;

            p { @include p-interact; }

            .container
            {
                @include flex;
                @include any-h;

                --icon-size: 14px;

                flex-direction: column-reverse;
                justify-content: space-between;
            }

            .options
            {
                @include f-center(true);
                @include absolute;
                @include any;
                @include black-glass(blur(5px));

                top: 0;
                right: -1px;

                z-index: -1;

                box-sizing: border-box;

                pointer-events: auto;

                transition: transform .4s ease;
    
                nav
                {
                    @include flex;
                    @include f-column;

                    justify-content: space-around;

                    gap: 30px;

                    @include media-max(false, 649px)
                    {
                        @include any-w;
    
                        flex-direction: row;
                    }
                }

                h4
                {
                    @include h-3;
                    @include any-w;

                    margin-bottom: 30px;

                    text-align: right;
                }

                ul { @include any-w; }

                li { margin-bottom: 10px; }
            }

            @include media-min(768px, 650px)
            {
                .container { --icon-size: 18px; }

                .options
                {
                    width: auto;

                    border-left: solid 4px $s-light;

                    li { margin-bottom: 20px; }
                }
            }
        }
    }
</style>