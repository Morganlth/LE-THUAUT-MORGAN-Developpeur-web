<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _width,
        _colors

    // #IMPORTS
   
        // --CONTEXT
        import { app } from '../field/Main.svelte'

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

        // --OBJECTS
        const
        options = { text: true, snake: true, fps: false },
        modes = { none: false, normal: true, challenge: false }

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
        let charged = false

        // --ELEMENT-CARD-GAME-OVER
        let gameOver = { on: false, update: updateGameOver }

        // --ELEMENT-SNAKE
        let
        score,
        lock = false,
        invincible = false

        // --ELEMENT-FRAME
        let
        fps,
        translateX = 100

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

                if (!options.snake && options.text) tick().then(viewCards)
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

            if (options.fps) setFps()
        }

        // --RESTORE
        function restore() /* ne set pas les fps ?*/
        {
            options.text = localStorage.getItem('presentation_text') === 'true'
            options.snake = localStorage.getItem('presentation_snake') === 'true'
            options.fps = localStorage.getItem('presentation_fps') === 'true'

            if (!options.snake)
            {
                if (options.text) modes.none = true
        
                modes.normal = false
            }
            else if (!options.text) modes.normal = false
        }

        // --UPDATE
        function updateGameOver(on)
        {
            gameOver.on = on
    
            gameOver[on ? 'update' : 'view']()
            .then(() => { if (options.snake) animation(!on) })
        }

        function updateOption(id)
        {
            switch (id)
            {
                case 0:
                    updateText(!options.text)
                    break
                case 1:
                    updateSnake(!options.snake)
                    break
                case 2:
                    updateFps(!options.fps)
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
                    updateNone(!modes.none)
                    break
                case 1:
                    updateNormal(!modes.normal)
                    break
                case 2:
                    updateChallenge(!modes.challenge)
                    break
                default:
                    break
            }
        }

        function updateText(on)
        {
            options.text = on

            if (on)
            {
                if (charged) viewCards()
                
                modes.challenge = false
            }
            else
            {
                if (charged) hidden()
    
                modes.none = false
                modes.normal = false
            }

            localStorage.setItem('presentationText', on)
        }

        function updateSnake(on)
        {
            options.snake = on
        
            if (on)
            {
                if (charged) hidden()
            
                modes.none = false
            }
            else
            {
                if (charged) viewCards()
    
                modes.normal = false
                modes.challenge = false
            }

            // animation(on ? false : true)

            localStorage.setItem('presentationSnake', onafterprint)
        }

        function updateFps(on)
        {
            if (on) setFps()

            options.fps = on

            localStorage.setItem('presentationFps', on)
        }

        function updateNone(on)
        {
            if (on)
            {
                if (!options.text) updateText(true)
                if (options.snake) updateSnake(false)
    
                modes.normal = false
                modes.challenge = false
        
                if (gameOver.on) gameOver.change(false)
            }

            noneOn = on
        }

        function updateNormal(on)
        {
            if (on)
            {
                if (textOff) updateText(false)
                if (snakeOff) updateSnake(false)
                if (noneOn) noneOn = false
                if (challengeOn) challengeOn = false
                if (gameOver.on) gameOver.change(false)
            }

            normalOn = on
        }

        function updateChallenge(on)
        {
            if (on)
            {
                if (!textOff) updateText(true)
                if (snakeOff) updateSnake(false)
                if (normalOn) normalOn = false
                if (noneOn) noneOn = false

                prepareSnake()
            }
            else if (gameOver.on) gameOver.change(false)

            challengeOn = on
        }

        // --EVENTS  
        function click()
        {
            translateX = translateX ? 0 : 100
            translateX ? (lock = false, setTimeout(() => { invincible = false }, 100)) : (lock = true, invincible = true)
        }

        function mouseLeave(e)
        {
            if (e.relatedTarget.classList.contains('cell')) return
        
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
        
                card.update(x, y)

                y += card.height
            }
        }

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
    _options={options}
    _mode={modes}
    _cards={cards}
    _gameOver={gameOver}
    _lock={lock}
    _invincible={invincible}
    {_colors}
    bind:score={score}
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

        {#if options.fps}
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
        style:right="{-size}px"
        style:transform="translateX({translateX}%)"
        style:padding="{size * 2}px {size}px"
        on:mouseleave={mouseLeave}
        >
            <h4>OPTIONS</h4>

            <ul>
                {#each options as option, i}
                    <li>
                        <Cell
                        _style="display: block; width: 100%; border: none; cursor: pointer"
                        on:click={updateOption.bind(null, i)}
                        >
                            <Toggle
                            _check={option.link}
                            >
                                {option.content}
                            </Toggle>
                        </Cell>
                    </li>
                {/each}
            </ul>

            <h4>MODES DE JEU</h4>

            <ul>
                {#each gameModes as mode, i}
                    <li>
                        <Cell
                        _style="display: block; width: 100%; border: none; cursor: pointer"
                        on:click={updateMode.bind(null, i)}
                        >
                            <Toggle
                            _check={mode.link}
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
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss';

    /* #GROUPS */

    #presentation
    {
        height: 100vh;

        background-color: $dark;
    }
</style>