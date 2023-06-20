<!-- #SCRIPT -->

<script>
    // #EXPORT

        // #PROP
        export let _colors

    // #IMPORTS

        // #JS
        import getFps from '../../assets/js/fps'

        // #CONTEXTS
        import { app } from '../field/Main.svelte'
        import { event } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // #SVELTE
        import { onMount, tick } from 'svelte'

        // #ELEMENTS
        import Toggle from '../elements/Toggle.svelte'
        import Card from '../elements/Card.svelte'

        // #COVERS
        import Cell from '../covers/Cell.svelte'
        import Icon from '../covers/Icon.svelte'

        // #ICON
        import Side from '../icons/Side.svelte'

    // #CONSTANTES

    const
    defaultSize = 40,
    snake = [],
    apple = [],
    cards =
    [
        { title: 'NOM - PRÉNOM', content: ['LE THUAUT Morgan'] },
        { title: 'AGE', content: ['21 ans'] },
        { title: 'PROFESSION', content: ['Développeur Web - FULL STACK'] },
        { title: 'LOCALITÉ', content: ['Morbihan - FRANCE'] },
        { title: 'ÉTUDES - FORMATIONS', content: ['Lycée Jeanne d\'Arc PONTIVY - bac S SVT spécialité MATHS', 'OpenClassrooms - formation de Développeur Web'] },
        { title: 'CONTACT', content: ['Tel:  06 09 23 72 08', 'Email:  lethuaut.morgan@gmail.com'] }
    ]

    // #VARIABLES

    let
    blockSize = defaultSize,
    offsetX = 0,
    offsetY = 0,
    width,
    height,
    lock = false,
    outside = true,
    invincible = false

    let
    canvas,
    columns,
    rows,
    context,
    boundingClientRect,
    clientX = 0,
    clientY = 0,
    x = -1,
    y = -1,
    xScope = false,
    yScope = false

    let
    score = 0,
    fps = 0,
    translateX = 100,
    textOff = false,
    snakeOff = false,
    fpsOn = false,
    noneOn = false,
    normalOn = true,
    challengeOn = false

    let
    fontCharged = false,
    i = 0

    let gameOver =
    {
        on: false
    ,
        change: function (value)
        {
            this.on = value

            if (!snakeOff) setTimeout(() => animation(!value), 100)

            this[value ? 'update' : 'hidden']()
        }
    }

    // #REACTIVES

    $: options =
    [
        { link: textOff, content: 'MASQUER LE TEXTE' },
        { link: snakeOff, content: 'MASQUER LE SERPENT' },
        { link: fpsOn, content: 'AFFICHER LES FPS' },
    ]

    $: gameModes =
    [
        { link: noneOn, content: 'AUCUN' },
        { link: normalOn, content: 'NORMAL' },
        { link: challengeOn, content: 'CHALLENGE' }
    ]

    // #FUNCTIONS

    function addCommand()
    {
        const
        name_1 = 'snakeSize',
        name_2 = 'snakeTextOff',
        name_3 = 'snakeOff',
        name_4 = 'fpsOn'

        app.add(name_1, (size) =>
        {
            size = app.testDefault(size) ? defaultSize : app.testNumber(size, 10, 70)

            blockSize = size
            localStorage.setItem(name_1, size)
            reset()
    
            app.success(name_1 + ' ' + size)
        }, true)

        app.add(name_2, (off) =>
        {
            off = app.testDefault(off) ? false : app.testBoolean(off)
    
            updateText(off)

            app.success(name_2 + ' ' + off)
        }, true)

        app.add(name_3, (off) =>
        {
            off = app.testDefault(off) ? false : app.testBoolean(off)
    
            updateSnake(off)

            app.success(name_3 + ' ' + off)
        }, true)

        app.add(name_4, (on) =>
        {
            on = app.testDefault(on) ? false : app.testBoolean(on)
    
            updateFps(on)

            app.success(name_4 + ' ' + on)
        }, true)
    }

    function set()
    {
        setCards()
        restore()
        reset()
        initSnake()
        setEvent()
    }

    function restore()
    {
        textOff = localStorage.getItem('textOff') === 'true'
        snakeOff = localStorage.getItem('snakeOff') === 'true'
        fpsOn = localStorage.getItem('fpsOn') === 'true'

        if (!textOff && snakeOff) noneOn = true, normalOn = false
        else if (textOff || snakeOff) normalOn = false
    }

    function reset()
    {
        offsetX = window.innerWidth % blockSize
        offsetY = window.innerHeight % blockSize / 2

        width = window.innerWidth - offsetX
        height = window.innerHeight - offsetY * 2

        setCanvas()
        initApple()
    }

    function setCards()
    {
        document.fonts.ready.then(() =>
        {
            fontCharged = true

            if (snakeOff && !textOff) tick().then(view)
        })
    }

    async function setFps()
    {
        fps = await getFps()

        if (fpsOn) setFps()
    }

    function setCanvas()
    {
        canvas.width = width
        canvas.height = height

        columns = width / blockSize
        rows = height / blockSize

        context = canvas.getContext('2d')
        boundingClientRect = canvas.getBoundingClientRect()
    }

    function setEvent()
    {
        event.add('scroll', snake_scroll)
        event.add('mouseMove', snake_mouseMove)
        event.add('mouseDown', snake_mouseDown)
    }

    async function snake_scroll()
    {
        boundingClientRect = canvas.getBoundingClientRect()

        move()
    }

    async function snake_mouseMove(x, y)
    {
        clientX = x
        clientY = y

        move()
    }

    async function snake_mouseDown(e)
    {
        if (gameOver.on && e.target.classList.contains('frame'))
        {
            clientX = e.clientX
            clientY = e.clientY

            update()
            initApple()
            moveSnake()
            prepareSnake()
            invincible = true
            gameOver.change(false)

            setTimeout(() => invincible = false, 500)
        }
    }

    function initApple()
    {
        const
        appleX = Math.floor(Math.random() * (columns - 2) + 1), // ne prend pas les bordure
        appleY = Math.floor(Math.random() * (rows - 2) + 1)

        if (snake.find(part => part[0] === appleX && part[1] === appleY)) return initApple() // probleme si snake trop grand

        apple[0] = appleX
        apple[1] = appleY
    }

    function initSnake() { for (let i = 0; i < 10; i++) snake.push([-1, -1]) }

    function move()
    {
        if (lock || event.grabbing || gameOver.on) return

        update()

        if (snake.length && snake[0][0] === x && snake[0][1] === y) return
        if (!xScope || !yScope)
        {
            if (challengeOn) return gameOver.change(true)
            if (outside || check()) return
        }
        else
        {
            if (snakeOff) { if (spring.lock) spring.spring_mouseLeave() }
            else if (!spring.lock) spring.spring_mouseEnter()
        }
    
        draw()
    }

    function update()
    {
        x = Math.floor((clientX - boundingClientRect.left) / blockSize)
        y = Math.floor((clientY - boundingClientRect.top) / blockSize)

        xScope = x >= 0 && x < columns
        yScope = y >= 0 && y < rows

        score = snake.length
    }

    function check()
    {
        for (let i = 0; i < snake.length; i++)
        {
            const part = snake[i]
    
            if (part[0] >= 0 && part[0] < columns && part[1] >= 0 && part[1] < rows) return false
        }

        return outside = true
    }

    function draw()
    {
        if (outside) outside = false
        if (snakeOff) return

        const [snakeX, snakeY] = [snake[0][0], snake[0][1]]

        let
        gapX = snakeX - x,
        gapY = snakeY - y,
        i = 0

        while(i++ < 20)
        {
            if (gapX !== 0) x < snakeX ? gapX-- : gapX++
            if (gapY !== 0) y < snakeY ? gapY-- : gapY++

            clear()
            drawApple()
            drawSnake(x + gapX, y + gapY)

            if (gapX === 0 && gapY === 0) break
        }
    }

    function updateGamePlan()
    {
        if (!textOff) updateCard()
    
        initApple()

        snake.push([])
    }

    function clear() { context.clearRect(0, 0, width, height) }

    function drawApple()
    {
        let
        appleX = apple[0] * blockSize,
        appleY = apple[1] * blockSize,
        appleSize = blockSize

        context.fillStyle = _colors.indicator
        context.fillRect(appleX, appleY, appleSize, appleSize)
    }

    function drawSnake(x, y)
    {
        context.fillStyle = _colors.oPrimary

        for (let i = snake.length - 1; i > 0; i--)
        {
            snake[i] = snake[i-1]

            const
            part = snake[i],
            snakeX = part[0],
            snakeY = part[1]

            if (!invincible && xScope && yScope && snakeX === x && snakeY === y) challengeOn ? gameOver.change(true) : snake.pop()
            if (snakeX === apple[0] && snakeY === apple[1]) updateGamePlan()

            drawSnakeBody(part, i)
        }

        drawSnakeHead(x, y)
    }

    function drawSnakeHead(x, y)
    {
        if (x === apple[0] && y === apple[1]) updateGamePlan()

        snake[0] = [x, y]
    
        context.fillStyle = _colors.primary
        context.fillRect(snake[0][0] * blockSize, snake[0][1] * blockSize, blockSize, blockSize)
    }

    function drawSnakeBody(part, i)
    {
        const model = getAvailablePositions(snake[i+1], part, snake[i-2])

        let
        offsetX = 0,
        offsetY = 0,
        partWidth = blockSize,
        partHeight = blockSize
    
        if (model.includes('l')) offsetX++
        if (model.includes('t')) offsetY++
        if (model.includes('r')) partWidth -= (2 - offsetY)
        if (model.includes('b')) partHeight -= (2 - offsetX)

        context.fillRect(part[0] * blockSize + offsetX, part[1] * blockSize + offsetY, partWidth, partHeight)
    }

    function getAvailablePositions(pre, now, aft)
    {
        let positions = 'trbl' // top right bottom left
    
        const
        posA = getPositionTaken(pre, now),
        posB = getPositionTaken(aft, now)

        if (posA) positions = positions.replace(posA, '')
        if (posB) positions = positions.replace(posB, '')

        return positions
    }

    function getPositionTaken(a, b) // t (top) - b (bottom) - r (right) - l (left)
    {
        if (!a || !b) return null

        if (a[0] === b[0]) return a[1] < b[1] ? 't' : 'b'
        else if (a[1] === b[1]) return a[0] < b[0] ? 'l' : 'r'
        else return null
    }

    function btnClick()
    {
        translateX = translateX ? 0 : 100
        translateX ? (lock = false, setTimeout(() => { invincible = false }, 100)) : (lock = true, invincible = true)
    }

    function updateOption(id)
    {
        switch (id)
        {
            case 0:
                updateText(!textOff)
                break
            case 1:
                updateSnake(!snakeOff)
                break
            case 2:
                updateFps(!fpsOn)
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
                updateNone(!noneOn)
                break
            case 1:
                updateNormal(!normalOn)
                break
            case 2:
                updateChallenge(!challengeOn)
                break
            default:
                break
        }
    }

    function leave(e)
    {
        if (e.relatedTarget.classList.contains('cell')) return
    
        setTimeout(() => { invincible = false }, 200)

        translateX = 100
        lock = false
    }

    function updateText(off)
    {
        textOff = off

        if (off)
        {
            if (fontCharged) hidden()
            if (noneOn) noneOn = false
            if (normalOn) normalOn = false
        }
        else
        {
            if (fontCharged) view()
            if (challengeOn) challengeOn = false
        }

        localStorage.setItem('textOff', off)
    }

    function updateSnake(off)
    {
        snakeOff = off
    
        if (off)
        {
            if (fontCharged) view()
            if (normalOn) normalOn = false
            if (challengeOn) challengeOn = false
        }
        else
        {
            if (fontCharged) hidden()
            if (noneOn) noneOn = false
        }

        animation(off ? false : true)

        localStorage.setItem('snakeOff', off)
    }

    function updateFps(on)
    {
        if (on) setFps()

        fpsOn = on

        localStorage.setItem('fpsOn', on)
    }

    function updateNone(on)
    {
        if (on)
        {
            if (textOff) updateText(false)
            if (!snakeOff) updateSnake(true)
            if (normalOn) normalOn = false
            if (challengeOn) challengeOn = false
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

    function prepareSnake()
    {
        if (snake.length > 10)
        {
            animation(false, 10)
            snake.length = 10
            score = 10
        }
    }

    function moveSnake()
    {
        const
        gapX = x - snake[0][0],
        gapY = y - snake[0][1]

        for (let i = 0; i < snake.length; i++)
        {
            const part = snake[i]

            part[0] = part[0] + gapX
            part[1] = part[1] + gapY
        }
    }

    function animation(draw, max = -1)
    {
        let delay = 0

        for (let i = snake.length - 1; i >= max; i--)
        {
            const part = i >= 0 ? snake[i] : apple

            setTimeout(() => requestAnimationFrame(() =>
            {
                if (draw) context.fillStyle = _colors[i > 0 ? 'oPrimary' : i === 0 ? 'primary' : 'indicator']
    
                context[draw ? 'fillRect' : 'clearRect'](part[0] * blockSize, part[1] * blockSize, blockSize, blockSize)
            }), delay += 16)
        }
    }

    function updateCard()
    {
        const lastPart = snake[snake.length - 1]

        if (i === cards.length) i = 0

        const j = i - 1

        cards[j < 0 ? cards.length - 1 : j].hidden()
        cards[i++].update(lastPart[0] * blockSize, lastPart[1] * blockSize, 100)
    }

    function view()
    {
        if (textOff || !snakeOff) return

        let y = blockSize

        for (const card of cards)
        {
            const x = Math.random() * (width - card.width)
    
            card.update(x, y)

            y += card.height
        }
    }

    function hidden() { for (let i = 0; i < cards.length; i++) cards[i].hidden() }

    // #CYCLE

    onMount(() =>
    {
        addCommand()
        set()
    })
</script>

<!-- #HTML -->

<div
class="snake-game"
style:height="{height}px"
style:margin="{offsetY}px {offsetX}px {offsetY}px 0"
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
>
    <div
    class="card-container"
    >
        {#if fontCharged}
            {#each cards as card}
                <Card
                _blockSize={defaultSize}
                _dark={_colors.dark}
                bind:width={card.width}
                bind:height={card.height}
                bind:update={card.update}
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
                _blockSize={defaultSize}
                _start={false}
                _dark={_colors.dark}
                bind:width={gameOver.width}
                bind:height={gameOver.height}
                bind:update={gameOver.update}
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

    <canvas
    style:width="{width}px"
    style:height="{height}px"
    bind:this={canvas}
    >
    </canvas>

    <div
    class="frame"
    style:padding="0 {50 - offsetX}px {30 - offsetY}px 50px"
    >
        <p
        class="score"
        >
            SCORE {score}
        </p>

        {#if fpsOn}
            <p>
                FPS {fps}
            </p>
        {/if}

        <Cell
        _style="border: none; cursor: pointer"
        on:click={btnClick}
        >
            <Icon
            _size="18px"
            _color={_colors.sLight}
            >
                <Side />
            </Icon>
        </Cell>

        <nav
        style:right="{-offsetX}px"
        style:transform="translateX({translateX}%)"
        style:padding="0 {50 - offsetX}px 78px"
        on:mouseleave={leave}
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
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss';

    /* #GROUPS */

    .snake-game
    {
        @include relative;

        display: inline-block;
        
        z-index: 1;

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

        canvas { @include relative; }
    
        .frame
        {
            &,
            nav
            {
                @include flex;

                align-items: flex-end;
            }

            @include xy-start(true);
            @include any;

            justify-content: space-between;

            z-index: 2;

            box-sizing: border-box;
            box-shadow: inset -15px -15px 15px $dark, inset 15px 15px 15px $dark;

            p { @include text-info; }

            nav
            {
                @include f-center(true);
                @include f-column;
                @include absolute;
                @include any-h;
                @include black-glass(blur(3px));

                gap: 30px;

                top: 0;

                z-index: -1;

                transition: transform 0.5s ease;

                border-left: solid 4px $s-light;

                box-sizing: border-box;
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