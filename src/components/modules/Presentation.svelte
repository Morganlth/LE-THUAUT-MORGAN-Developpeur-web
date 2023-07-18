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

        // --COMPONENT-ELEMENTS
        import Snake from '../elements/Snake.svelte'
        import Tag from '../elements/Tag.svelte'
        import Toggle from '../elements/Toggle.svelte'

        // --COMPONENT-COVERS
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICON
        import Side from '../icons/Side.svelte'

    // #CONSTANTES

        // --ELEMENT-PRESENTATION
        const
        PRESENTATION_BLOCKSIZE = 40,
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
                name: 'none',
                text: false,
                snake: false,
                content: 'AUCUN'
            },
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
                content: ['Développeur Web - FULL STACK']
            },
            {
                title: 'LOCALITÉ',
                content: ['Morbihan - FRANCE']
            },
            {
                title: 'ÉTUDES - FORMATIONS',
                content: ['Lycée Jeanne d\'Arc PONTIVY - bac S SVT spécialité MATHS', 'OpenClassrooms - formation de Développeur Web']
            },
            {
                title: 'CONTACT',
                content: ['Tel:  06 09 23 72 08', 'Email:  lethuaut.morgan@gmail.com']
            }
        ]

        // --ELEMENT-GAMEOVER
        const GAMEOVER = { on: false }

    // #VARIABLES

        // --EVENT-CONTEXT
        let event_GRABBING = event.grabbing

        // --ELEMENT-PRESENTATION
        let presentation

        // --ELEMENT-TAG
        let
        tag_CHARGED = false,
        tag_INDEX = 0,
        tag_SAVE = -1

        // --ELEMENT-SNAKE
        let
        snake_SCORE,
        snake_TAIL = [0, 0],
        snake_INVINCIBLE = false,
        snake_resetSize,
        snake_updateEvent,
        snake_animation

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
        $: snake_updateEvent instanceof Function ? snake_updateEvent(!$event_GRABBING && snake_test()) : null // set default desktop event snake

    // #FUNCTIONS

        // --SET
        function presentation_set()
        {
            tag_set()
    
            presentation_setCommand()
            presentation_setEvent()
            presentation_setRouter()
        }

        function tag_set()
        {
            document.fonts.ready.then(() =>
            {
                tag_CHARGED = true

                if (presentation_$TEXT && !presentation_$SNAKE) tick().then(tag_showAll)
            })
        }

        function presentation_setCommand()
        {
            app.app_add('presentation_text', presentation_text, true)
            app.app_add('presentation_snake', presentation_snake, true)
            app.app_add('presentation_fps', presentation_fps, true)
        }

        function presentation_setEvent() { event.add('resize', presentation_resize) }

        function presentation_setRouter()
        {
            const START = presentation.offsetLeft

            router.router_add(1, 'presentation', START, presentation_call)
        }

        async function presentation_setFps()
        {
            frame_FPS = await fps_get()

            if (presentation_$FPS) presentation_setFps()
        }

        function presentation_setItem(key, value) { localStorage.setItem('presentation_' + key, value) }

        function snake_setInvincibleTime() { setTimeout(() => snake_INVINCIBLE = false, 500) }

        // --GET
        function presentation_getParam(name) { return PRESENTATION_PARAMS.find(p => p.name === name) }

        function presentation_getMode(text, snake)
        {
            return snake ?? presentation_getParam('snake').on
            ? 'play'
            : text ?? presentation_getParam('text').on
                ? 'read'
                : 'none'
        }

        // --RESTORE
        function tag_restore()
        {
            if (tag_SAVE > -1)
            {
                tag_INDEX = tag_SAVE

                tag_update(snake_TAIL)
            }
        }

        // --UPDATE
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
                        GAMEOVER.on
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
            if (tag_CHARGED)
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
            if (presentation_$TEXT && tag_CHARGED) on ? (tag_hideAll(), tag_restore()) : tag_showAll()
    
            if (on) app.app_updateMode(false)

            snake_animation(on)
        }

        function presentation_updateFps(on) { if (on) presentation_setFps() }

        function tag_update([x, y])
        {
            if (!presentation_$TEXT || !tag_CHARGED) return
    
            if (tag_INDEX === TAG_ELEMENTS.length) tag_INDEX = 0

            if (tag_SAVE > -1) TAG_ELEMENTS[tag_SAVE].hidden()

            tag_SAVE = tag_INDEX

            TAG_ELEMENTS[tag_INDEX++].view(x, y, 100)
        }
    
        async function gameover_update(on)
        {
            GAMEOVER.on = on
    
            await GAMEOVER[on ? 'view' : 'hidden']()
           
            if (presentation_$SNAKE) snake_animation(!on)
            
            on ? (snake_updateEvent(false), spring.spring_mouseLeave()) : (snake_INVINCIBLE = true, snake_setInvincibleTime())
        }

        // --DESTROY
        function presentation_destroy() { event.remove('resize', presentation_resize) }

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
        async function presentation_click_param()
        {
            if (this !== 'fps')
            {
                const MODE = presentation_getMode(...(this === 'text' ? [!presentation_$TEXT] : [null, !presentation_$SNAKE]))
        
                presentation_updateMode(MODE, false)
            }
    
            presentation_updateParam(this)
        }

        async function presentation_click_mode()
        {
            if (this === 'challenge') snake_resetSize(true)

            presentation_updateMode(this, true)
        }

        async function presentation_resize()
        {
            GAMEOVER.reset()
    
            for (const TAG of TAG_ELEMENTS)
                TAG.reset()
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
            const target = e.relatedTarget

            if (!target || target.classList.contains('icon')) return
        
            snake_setInvincibleTime()

            frame_TRANSLATEX = 100
            
            if (snake_test()) snake_updateEvent(true)
        }

        // --ROUTER-CALL
        function presentation_call()
        {
            setTimeout(() =>
            {
                if (presentation_$SNAKE && wwindow.window_MOBILE === false && event.contain('scroll', 'snake_scroll') > -1)
                    event.manager.scroll.find(f => f.name === 'snake_scroll')()
            }, 50)
        }

        // --TEST
        function snake_test() { return presentation_$SNAKE && !GAMEOVER.on }

        // --UTILS
        function tag_showAll()
        {
            let y = PRESENTATION_BLOCKSIZE + 30

            for (const TAG of TAG_ELEMENTS)
            {
                const X = Math.random() * (window.innerWidth - TAG.width - PRESENTATION_BLOCKSIZE * 2) + PRESENTATION_BLOCKSIZE
        
                TAG.view(X, y)

                y += TAG.height
            }
        }

        function tag_hideAll() { for (let i = 0; i < TAG_ELEMENTS.length; i++) TAG_ELEMENTS[i].hidden() }

    // #CYCLES

    onMount(presentation_set)
    onDestroy(presentation_destroy)
</script>

<!-- #HTML -->

<div
id="presentation"
bind:this={presentation}
>
    <div
    class="tag-container"
    >
        {#if tag_CHARGED}
            {#each TAG_ELEMENTS as tag}
                <Tag
                _blockSize={PRESENTATION_BLOCKSIZE}
                _dark={_colors.dark}
                bind:width={tag.width}
                bind:height={tag.height}
                bind:reset={tag.reset}
                bind:view={tag.view}
                bind:hidden={tag.hidden}
                >
                    <h2>{tag.title}</h2>

                    <div
                    class="content"
                    >
                        {#each tag.content as text}
                            <p>{text}</p>
                        {/each}
                    </div>
                </Tag>
            {/each}

            <div
            class="game-over"
            >
                <Tag
                _blockSize={PRESENTATION_BLOCKSIZE}
                _start={false}
                _dark={_colors.dark}
                bind:reset={GAMEOVER.reset}
                bind:view={GAMEOVER.view}
                bind:hidden={GAMEOVER.hidden}
                >
                    <h4>
                        &lt GAME
                        <br>
                        OVER &gt
                    </h4>

                    <p>CLICK POUR REJOUER</p>
                </Tag>
            </div>
        {/if}
    </div>

    <Snake
    _modes={{ challenge: presentation_$CHALLENGE }}
    _gameover={{ on: GAMEOVER.on, update: gameover_update }}
    _snake={{ invincible: snake_INVINCIBLE, blockSize: PRESENTATION_BLOCKSIZE }}
    {_colors}
    bind:snake_SCORE={snake_SCORE}
    bind:snake_TAIL={snake_TAIL}
    bind:snake_resetSize={snake_resetSize}
    bind:snake_updateEvent={snake_updateEvent}
    bind:snake_animation={snake_animation}
    />

    <div
    class="frame"
    style:padding="30px {PRESENTATION_BLOCKSIZE}px"
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

        <Cell
        _style="border: none; cursor: pointer"
        on:click={options_click}
        >
            <Icon
            _size="18px"
            _color={_colors.sLight}
            >
                <Side />
            </Icon>
        </Cell>

        <nav
        style:transform="translateX({frame_TRANSLATEX}%)"
        style:padding="{PRESENTATION_BLOCKSIZE * 2}px {PRESENTATION_BLOCKSIZE}px"
        on:mouseleave={options_mouseLeave}
        >
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
        </nav>
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

    /* #PRESENTATION */

    #presentation
    {
        @include relative;

        flex-shrink: 0;

        width: 100vw;
        height: 100vh;

        .tag-container
        {
            h2
            {
                @include h-2($o-primary);

                padding-right: 30px;

                white-space: nowrap;
            }

            .content
            {
                margin: 10px 0 0 30px;
                padding: 10px 0 0 30px;

                border-top: solid 1px $o-primary;
            }

            p
            {
                @include p-content;

                color: $light;
                user-select: none;
            }
        }

        .game-over
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

            nav
            {
                @include f-center(true);
                @include f-column;
                @include absolute;
                @include any-h;
                @include black-glass(blur(5px));

                gap: 30px;

                top: 0;
                right: -1px;

                z-index: -1;

                transition: transform 0.5s ease;

                border-left: solid 4px $s-light;

                box-sizing: border-box;

                pointer-events: auto;
            }

            h4
            {
                @include h-3;
                @include any-w;

                text-align: right;
            }

            ul { @include any-w; }

            li { margin-bottom: 20px; }
        }
    }
</style>