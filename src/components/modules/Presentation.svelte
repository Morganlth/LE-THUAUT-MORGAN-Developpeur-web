<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _width,
        _colors

    // #IMPORTS
   
        // --CONTEXTS
        import { app } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // --JS
        import getFps from '../../assets/js/fps'

        // --SVELTE
        import { onMount, tick } from 'svelte'

        // --COMPONENT-ELEMENT
        import Snake from '../elements/Snake.svelte'
        import Card from '../elements/Card.svelte'
        import Toggle from '../elements/Toggle.svelte'

        // --COMPONENT-COVERS
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // --COMPONENT-ICON
        import Side from '../icons/Side.svelte'

    // #CONSTANTE

        // --PARAM
        const size = 40

        // --TO-ITERATE
        const cards =
        [
            { title: 'NOM - PRÉNOM', content: ['LE THUAUT Morgan'] },
            { title: 'AGE', content: ['21 ans'] },
            { title: 'PROFESSION', content: ['Développeur Web - FULL STACK'] },
            { title: 'LOCALITÉ', content: ['Morbihan - FRANCE'] },
            { title: 'ÉTUDES - FORMATIONS', content: ['Lycée Jeanne d\'Arc PONTIVY - bac S SVT spécialité MATHS', 'OpenClassrooms - formation de Développeur Web'] },
            { title: 'CONTACT', content: ['Tel:  06 09 23 72 08', 'Email:  lethuaut.morgan@gmail.com'] }
        ]

    // #VARIABLES

        // --ELEMENT-CARD
        let
        charged = false,
        i = 0,
        j = -1

        // --ELEMENT-CARD-GAME-OVER
        let gameOver = { on: false, update: updateGameOver }

        // --ELEMENT-SNAKE
        let
        score,
        snakeTail = [0, 0],
        resetSnake,
        animation,
        lock = false,
        invincible = false

        // --ELEMENT-FRAME
        let
        fps = 0,
        translateX = 100

        // --PARAMS
        let
        textParam = true,
        snakeParam = true,
        fpsParam = false

        // --MODES
        let
        noneMode = false,
        normalMode = true,
        challengeMode = false

    // #REACTIVE

        // --UPDATE
        $: updateCard(snakeTail)

        // --TO-ITERATE
        $: params =
        [
            { on: textParam, content: 'AFFICHER LE TEXTE' },
            { on: snakeParam, content: 'AFFICHER LE SERPENT' },
            { on: fpsParam, content: 'AFFICHER LES FPS' }
        ]
        
        $: modes =
        [
            { on: noneMode, content: 'AUCUN' },
            { on: normalMode, content: 'NORMAL' },
            { on: challengeMode, content: 'CHALLENGE' }
        ]

    // #FUNCTIONS

        // --SET
        function set()
        {
            restore()
            setCard()
            setCommand()
        }

        function setCard()
        {
            document.fonts.ready.then(() =>
            {
                charged = true

                if (!snakeParam && textParam) tick().then(viewCards)
            })
        }

        function setCommand()
        {
            app.add('presentationText', presentationText, true)
            app.add('presentationSnake', presentationSnake, true)
            app.add('presentationFps', presentationFps, true)
        }
        
        async function setFps()
        {
            fps = await getFps()

            if (fpsParam) setFps()
        }

        function setInvincible()
        {
            invincible = true

            setTimeout(() => invincible = false, 500)
        }

        // --RESTORE
        function restore()
        {
            restoreParams()
            restoreModes()
        }

        function restoreParams()
        {
            const
            textStorage = localStorage.getItem('presentation_text'),
            snakeStorage = localStorage.getItem('presentation_snake'),
            fpsStorage = localStorage.getItem('presentation_fps')

            textParam = (!textStorage || textStorage === 'true')
            snakeParam = (!snakeStorage || snakeStorage === 'true')
            fpsParam = (!fpsStorage || fpsStorage === 'true') 
        }

        function restoreModes()
        {
            if (!snakeParam)
            {
                if (textParam) noneMode = true
        
                normalMode = false
            }
            else if (!textParam) normalMode = false
        }

        function restoreCard()
        {
            if (j > -1)
            {
                i = j

                updateCard(snakeTail)
            }
        }

        // --UPDATE
        function updateCard([cardX, cardY])
        {
            if (!textParam || !charged) return
    
            if (i === cards.length) i = 0

            cards[j < 0 ? cards.length - 1 : j].hidden()

            j = i

            cards[i++].view(cardX, cardY, 100)
        }
    
        async function updateGameOver(on)
        {
            gameOver.on = on
    
            await gameOver[on ? 'view' : 'hidden']()
           
            if (snakeParam) animation(!on)
            
            on ? spring.spring_mouseLeave() : setInvincible()
        }

        function updateParam(id)
        {
            switch (id)
            {
                case 0:
                    updateText(!textParam)
                    break
                case 1:
                    updateSnake(!snakeParam)
                    break
                case 2:
                    updateFps(!fpsParam)
                    break
                default:
                    break
            }
        }

        function updateMode(id)
        {
            switch (id)
            {
                case 0:
                    updateNone(!noneMode)
                    break
                case 1:
                    updateNormal(!normalMode)
                    break
                case 2:
                    updateChallenge(!challengeMode)
                    break
                default:
                    break
            }
        }

        function updateText(on)
        {
            textParam = on

            if (on)
            {
                if (charged) snakeParam ? restoreCard() : viewCards()
                
                challengeMode = false
            }
            else
            {
                if (charged) hiddenCards()
    
                noneMode = false
                normalMode = false
            }

            localStorage.setItem('presentationText', on)
        }

        function updateSnake(on)
        {
            snakeParam = on
        
            if (on)
            {
                if (textParam && charged) hiddenCards(), restoreCard()
            
                noneMode = false
            }
            else
            {
                if (textParam && charged) viewCards()
    
                normalMode = false
                challengeMode = false
            }

            animation(on)

            localStorage.setItem('presentationSnake', on)
        }

        function updateFps(on)
        {
            if (on) setFps()

            fpsParam = on

            localStorage.setItem('presentationFps', on)
        }

        function updateNone(on)
        {
            if (on)
            {
                if (!textParam) updateText(true)
                if (snakeParam) updateSnake(false)
                if (gameOver.on) gameOver.update(false)
    
                normalMode = false
                challengeMode = false
            }

            noneMode = on
        }

        function updateNormal(on)
        {
            if (on)
            {
                if (!textParam) updateText(true)
                if (!snakeParam) updateSnake(true)
                if (gameOver.on) gameOver.update(false)
                
                noneMode = false
                challengeMode = false
            }

            normalMode = on
        }

        function updateChallenge(on)
        {
            if (on)
            {
                if (textParam) updateText(false)
                if (!snakeParam) updateSnake(true)
                
                noneMode = false
                normalMode = false

                resetSnake()
            }
            else if (gameOver.on) gameOver.update(false)

            challengeMode = on
        }

        // --EVENTS  
        function click()
        {
            translateX = translateX ? 0 : 100
            translateX ? (lock = false, setTimeout(() => { invincible = false }, 100)) : (lock = true, invincible = true)
        }

        function mouseLeave(e)
        {
            const target = e.relatedTarget

            if (!target || target.classList.contains('icon')) return
        
            setTimeout(() => { invincible = false }, 200)

            translateX = 100
            lock = false
        }

        // --COMMANDS
        async function presentationText(on)
        {
            on = app.testDefault(on) ? true : app.testBoolean(on)
    
            updateText(on)

            app.success('presentationText ' + on)
        }

        async function presentationSnake(on)
        {
            on = app.testDefault(on) ? true : app.testBoolean(on)
        
            updateSnake(on)

            app.success('presentationSnake ' + on)
        }

        async function presentationFps(on)
        {
            on = app.testDefault(on) ? false : app.testBoolean(on)
        
            updateFps(on)

            app.success('presentationFps ' + on)
        }

        // --CODE
        function viewCards()
        {
            // if (textOff || !snakeOff) return

            let y = size

            for (const card of cards)
            {
                const x = Math.random() * (window.innerWidth - card.width - size * 2) + size
        
                card.view(x, y)

                y += card.height
            }
        }

        function hiddenCards() { for (let i = 0; i < cards.length; i++) cards[i].hidden() }
    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
id="presentation"
style:width={_width}
>
    <div
    class="card-container"
    >
        {#if charged}
            {#each cards as card}
                <Card
                _blockSize={size}
                _dark={_colors.dark}
                bind:width={card.width}
                bind:height={card.height}
                bind:view={card.view}
                bind:hidden={card.hidden}
                >
                    <h3>{card.title}</h3>

                    <div
                    class="content"
                    >
                        {#each card.content as text}
                            <p>{text}</p>
                        {/each}
                    </div>
                </Card>
            {/each}

            <div
            class="game-over"
            >
                <Card
                _blockSize={size}
                _start={false}
                _dark={_colors.dark}
                bind:view={gameOver.view}
                bind:hidden={gameOver.hidden}
                >
                    <h6>
                        &lt GAME
                        <br>
                        OVER &gt
                    </h6>

                    <p>CLICK POUR REJOUER</p>
                </Card>
            </div>
        {/if}
    </div>

    <Snake
    _size={size}
    _snakeParam={snakeParam}
    _challenge={challengeMode}
    _gameOver={gameOver}
    _lock={lock}
    _invincible={invincible}
    {_colors}
    bind:score={score}
    bind:snakeTail={snakeTail}
    bind:resetSnake={resetSnake}
    bind:animation={animation}
    />

    <div
    class="frame"
    style:padding="30px {size}px"
    >
        <p
        class="score"
        >
            SCORE {score}
        </p>

        {#if fpsParam}
            <p>
                FPS {fps}
            </p>
        {/if}

        <Cell
        _style="border: none; cursor: pointer"
        on:click={click}
        >
            <Icon
            _size="18px"
            _color={_colors.sLight}
            >
                <Side />
            </Icon>
        </Cell>

        <nav
        style:transform="translateX({translateX}%)"
        style:padding="{size * 2}px {size}px"
        on:mouseleave={mouseLeave}
        >
            <h4>PARAMÈTRES</h4>

            <ul>
                {#each params as param, i}
                    <li>
                        <Cell
                        _style="display: block; width: 100%; border: none; cursor: pointer"
                        on:click={updateParam.bind(null, i)}
                        >
                            <Toggle
                            _check={param.on}
                            >
                                {param.content}
                            </Toggle>
                        </Cell>
                    </li>
                {/each}
            </ul>

            <h4>MODES DE JEU</h4>

            <ul>
                {#each modes as mode, i}
                    <li>
                        <Cell
                        _style="display: block; width: 100%; border: none; cursor: pointer"
                        on:click={updateMode.bind(null, i)}
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
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #GROUPS */

    #presentation
    {
        @include relative;

        height: 100vh;

        .card-container
        {
            h3
            {
                @include title-3($o-primary);

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
                @include text-command;

                color: $light;
                user-select: none;
            }
        }

        .game-over
        {
            h6
            {
                @include title($light, 90px, 77px);

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

            p { @include text-info; }

            nav
            {
                @include f-center(true);
                @include f-column;
                @include absolute;
                @include any-h;
                @include black-glass(blur(5px));

                gap: 30px;

                top: 0;
                right: 0;

                z-index: -1;

                transition: transform 0.5s ease;

                border-left: solid 4px $s-light;

                box-sizing: border-box;

                pointer-events: auto;
            }

            h4
            {
                @include title-4;
                @include any-w;

                text-align: right;
            }

            ul { @include any-w; }

            li { margin-bottom: 20px; }
        }
    }
</style>