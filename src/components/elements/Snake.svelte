<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _colors,
        _lock = false

        // #BINDS

        export function scroll()
        {
            boundingClientRect = canvas.getBoundingClientRect()

            move()
        }

        export function mouseMove(e)
        {

            console.log('move')
            clientX = e.clientX
            clientY = e.clientY
    
            move()
        }

    // #IMPORTS

        // #APP-CONTEXT
        import { app } from './Console.svelte'

        // #SVELTE
        import { onMount, tick } from 'svelte'

        // #ELEMENT
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
    x = 0,
    y = 0

    let
    score = 0,
    translateX = 100,
    textOff,
    snakeOff

    let
    fontCharged = false,
    i = 0

    // #REACTIVES

    $: xScope = x >= 0 && x < columns
    $: yScope = y >= 0 && y < rows

    // #FUNCTIONS

    function addCommand()
    {
        const
        name_1 = 'snakeSize',
        name_2 = 'snakeTextOff',
        name_3 = 'snakeOff'

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
            if (app.testDefault(off) || off === 'f' || off === 'false') off = false
            else if (off === 't' || off === 'true') off = true
            else app.error('la valeur doit être "t" ou "true" pour vrai | "f" ou "false" pour faux', 'TypeError')
    
            updateText(off)

            app.success(name_2 + ' ' + textOff)
        }, true)

        app.add(name_3, (off) =>
        {
            if (app.testDefault(off) || off === 'f' || off === 'false') off = false
            else if (off === 't' || off === 'true') off = true
            else app.error('la valeur doit être "t" ou "true" pour vrai | "f" ou "false" pour faux', 'TypeError')
    
            updateSnake(off)

            app.success(name_3 + ' ' + snakeOff)
        }, true)
    }

    function set()
    {
        setCards()
        restore()
        reset()
        initSnake()
    }

    function restore()
    {
        textOff = localStorage.getItem('textOff') === 'true'
        snakeOff = localStorage.getItem('snakeOff') === 'true'
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

            tick().then(() =>
            {
                if (snakeOff && !textOff) view()
            })
        })
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

    function initApple()
    {
        const
        appleX = Math.floor(Math.random() * (columns - 2) + 1), // ne prend pas les bordure
        appleY = Math.floor(Math.random() * (rows - 2) + 1)

        if (snake.find(part => part[0] === appleX && part[1] === appleY)) return initApple() // probleme si snake trop grand

        apple[0] = appleX
        apple[1] = appleY
    }

    function initSnake() { for (let i = 0; i < 10; i++) snake.push([x - i, y - i]) }

    function move()
    {
        if (_lock) return

        x = Math.floor((clientX - boundingClientRect.left) / blockSize)
        y = Math.floor((clientY - boundingClientRect.top) / blockSize)

        score = snake.length

        if (snake.length && snake[0][0] === x && snake[0][1] === y) return
    
        return (!xScope || !yScope) && (outside || check()) ? null : draw() 
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

        if (apple[0] === snake[0][0] && apple[1] === snake[0][1])
        {
            appleX += 3
            appleY += 3
            appleSize -= 6
        }

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

            if (!invincible && xScope && yScope && snakeX === x && snakeY === y) snake.pop()
            if (snakeX === apple[0] && snakeY === apple[1]) updateGamePlan()

            drawSnakeBody(part, i)
        }

        drawSnakeHead(x, y)
    }

    function drawSnakeHead(x, y)
    {
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

    function handleClick(id)
    {
        switch (id)
        {
            case 0:
                translateX = translateX ? 0 : 100
                translateX ? (_lock = false, setTimeout(() => { invincible = false }, 100)) : (_lock = true, invincible = true)
                break
            case 1:
                updateText(!textOff)
                break
            case 2:
                updateSnake(!snakeOff)
                break
            default:
                break
        }
    }

    function leave(e)
    {
        if (e.relatedTarget.classList.contains('cell')) return
    
        setTimeout(() => { invincible = false }, 100)

        translateX = 100
        _lock = false
    }

    function updateText(off)
    {
        textOff = off

        localStorage.setItem('textOff', off)

        if (fontCharged) off ? hidden() : view()
    }

    function updateSnake(off)
    {
        snakeOff = off

        animation(off ? false : true)

        localStorage.setItem('snakeOff', off)

        if (fontCharged) off ? view() : hidden()
    }

    function animation(draw)
    {
        let delay = 0

        for (let i = snake.length - 1; i >= -1; i--)
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
        cards[i++].update(lastPart[0] * blockSize, lastPart[1] * blockSize)
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
>
    <div
    class="card-container"
    >
        {#if fontCharged}
            {#each cards as card}
                <Card
                _title={card.title}
                _content={card.content}
                _blockSize={defaultSize}
                _dark={_colors.dark}
                bind:width={card.width}
                bind:height={card.height}
                bind:update={card.update}
                bind:hidden={card.hidden}
                />
            {/each}
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

        <Cell
        _style="border: none; cursor: pointer"
        on:click={handleClick.bind(null, 0)}
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
            <ul>
                <li>
                    <Cell
                    on:click={handleClick.bind(null, 1)}
                    >
                        <Toggle
                        _check={textOff}
                        >
                            Masquer le texte
                        </Toggle>
                    </Cell>
                </li>

                <li>
                    <Cell
                    on:click={handleClick.bind(null, 2)}
                    >
                        <Toggle
                        _check={snakeOff}
                        >
                            Désactiver le serpent
                        </Toggle>
                    </Cell>
                </li>
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

            .score { @include text-info; }

            nav
            {
                @include absolute;
                @include any-h;
                @include black-glass(blur(3px));

                top: 0;

                z-index: -1;

                transition: transform 0.5s ease;

                border-left: solid 4px $s-light;

                box-sizing: border-box;
            }

            li
            {
                margin-bottom: 15px;
    
                text-align: right;
            }
        }
    }
</style>