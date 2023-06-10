<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _colors,
        _grabbing = false

        // #BINDS
        export function scroll()
        {
            if (_grabbing) return

            const boundingClientRect = canvas.getBoundingClientRect()

            x = Math.floor((clientX - boundingClientRect.left) / blockSize)
            y = Math.floor((clientY - boundingClientRect.top) / blockSize)

            // console.log(x + ' - ' + y)

            draw()
        }

        export function mouseMove(e)
        {
            if (_grabbing) return

            const boundingClientRect = canvas.getBoundingClientRect()

            clientX = e.clientX
            clientY = e.clientY
            x = Math.floor((e.pageX - boundingClientRect.left) / blockSize)
            y = Math.floor((e.pageY - boundingClientRect.top) / blockSize)

            score.innerText = snake.length

            if (snake.length && snake[0][0] === x && snake[0][1] === y) return
        
            draw()
        }

    // #IMPORTS

        // #SVELTE
        import { onMount } from 'svelte'

        // #ELEMENT
        import Toggle from '../elements/Toggle.svelte'

        // #COVER
        import Cell from '../covers/Cell.svelte'

    // #CONSTANTES

    const
    blockSize = 25,
    snake = [],
    apple = [],
    texts =
    [
        ['NOM - PRÉNOM', 'LE THUAUT Morgan'],
        ['AGE', '21 ans'],
        ['PROFESSION', 'Développeur Web - FULL STACK'],
        ['LOCALITÉ', 'Morbihan - FRANCE'],
        ['ÉTUDES - FORMATIONS', 'Lycée Jeanne d\'Arc PONTIVY - bac S SVT spécialité MATHS',
                                'OpenClassrooms - formation de Développeur Web'],
        ['CONTACT', 'Tel:  06 09 23 72 08',
                    'Email:  lethuaut.morgan@gmail.com']
    ]

    // #VARIABLES

    let
    canvas = null,
    infos = null,
    score = null,
    context = null,
    translateY = 0,
    width = 0,
    height = 0,
    columns = 0,
    rows = 0,
    clientX = 0,
    clientY = 0,
    x = 0,
    y = 0,
    textX = 0,
    textY = 0,
    textId = -1,
    textOff = false

    // #FUNCTIONS

    function setCanvas()
    {
        const parent = canvas.parentNode

        width = window.innerWidth
        width -= width % blockSize
        height = window.innerHeight
        height -= height % blockSize

        canvas.width = width
        canvas.height = height
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'

        columns = width / blockSize
        rows = height / blockSize

        context = canvas.getContext('2d')

        initApple()
        initSnake()
    }

    function draw()
    {
        const
        snakeX = snake[0][0],
        snakeY = snake[0][1]

        let
        gapX = snakeX - x,
        gapY = snakeY - y,
        i = 0

        while(i++ < 30) // instantanné / pas ouf lorsque la souris sort en x
        {
            if (gapX !== 0) x < snakeX ? gapX-- : gapX++
            if (gapY !== 0) y < snakeY ? gapY-- : gapY++

            drawBackground()
            drawText()
            drawApple()
            drawSnake(x + gapX, y + gapY)

            if (gapX === 0 && gapY === 0) break
        }
    }

    function initText()
    {
        if (textOff) return

        const
        lastSnakePart = snake[snake.length-1],
        lastSnakePartX = lastSnakePart[0],
        lastSnakePartY = lastSnakePart[1] + 1

        textX = (
        lastSnakePartX > 0 ?
        lastSnakePartX < columns ?
        lastSnakePartX : columns - 1 : 1
        ) * blockSize

        textY = (
        lastSnakePartY > 0 ?
        lastSnakePartY < rows ?
        lastSnakePartY : rows - 1 : 1
        ) * blockSize

        textId === texts.length - 1 ? textId = 0 : textId++
    }

    function initApple()
    {
        if (snake.length > columns * rows) return

        const
        appleX = Math.floor(Math.random() * columns),
        appleY = Math.floor(Math.random() * rows)

        if (snake.find(part => part[0] === appleX && part[1] === appleY)) return initApple()

        apple[0] = appleX
        apple[1] = appleY
    }

    function initSnake()
    {
        for (let i = 0; i < 10; i++) snake.push([x - i, y - i])
    }

    function updateGamePlan()
    {
        initText()
        initApple()

        snake.push([])
    }

    function drawBackground()
    {
        context.fillStyle = _colors.dark
        context.fillRect(0, 0, width, height)
    }

    function drawText()
    {
        if (textOff || textId === -1) return

        const
        currentText = texts[textId],
        fullWidth = textX + getTextMaxWidth(currentText),
        fullHeight = currentText.length * blockSize

        if (fullWidth > width) textX += (width - fullWidth - blockSize)
        if (textY + fullHeight > height) textY += (height - (textY + fullHeight))

        context.fillStyle = _colors.sDark
        context.fillRect(0, textY, width, fullHeight)
    
        for (let i = 0; i < currentText.length; i++)
        {
            if (i === 0)
            {
                context.fillStyle = _colors.secondary
                context.font = '700 ' + blockSize + 'px Montserrat'
            }
            else
            {
                context.fillStyle = _colors.light
                context.font = '400 18px Montserrat'
            }

            context.fillText(currentText[i], textX, textY + blockSize * i)
        }
    }

    function getTextMaxWidth(currentText)
    {
        context.font = blockSize + 'px Montserrat'

        let maxWidth = 0
    
        for (let i = 0; i < currentText.length; i++)
        {
            const currentTextWidth = context.measureText(currentText[i]).width

            if (currentTextWidth > maxWidth) maxWidth = currentTextWidth
        }

        return maxWidth
    }

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
        updateSnake(x, y)
        drawSnakeHead()
        drawSnakeBody()
    }

    function updateSnake(x, y)
    {
        const
        xScope = x >= 0 && x < columns,
        yScope = y >= 0 && y < rows

        if (snake[0][0] !== x || snake[0][1] !== y)
        {
            for (let i = snake.length - 1; i > 0; i--)
            {
                snake[i] = snake[i-1]

                const
                snakeX = snake[i][0],
                snakeY = snake[i][1]

                if (xScope && yScope && snakeX === x && snakeY === y) snake.pop()
                if (snakeX === apple[0] && snakeY === apple[1]) updateGamePlan()
            }

            snake[0] = [x, y]
        }
    }

    function drawSnakeHead()
    {
        context.fillStyle = _colors.primary
        context.fillRect(snake[0][0] * blockSize, snake[0][1] * blockSize, blockSize, blockSize)
    }

    function drawSnakeBody()
    {
        context.fillStyle = _colors.oPrimary

        for (let i = snake.length-1; i > 0; i--)
        {
            const
            now = snake[i],
            model = getAvailablePositions(snake[i+1], now, snake[i-1])
    
            let
            offsetX = 0,
            offsetY = 0,
            partWidth = blockSize,
            partHeight = blockSize
        
            if (model.includes('l')) offsetX++
            if (model.includes('t')) offsetY++
            if (model.includes('r')) partWidth -= (2 - offsetY)
            if (model.includes('b')) partHeight -= (2 - offsetX)

            context.fillRect(now[0] * blockSize + offsetX, now[1] * blockSize + offsetY, partWidth, partHeight)
        }
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

    function handleClick()
    {
        textOff = !textOff

        draw()
    }

    // #CYCLE

    onMount(setCanvas)
</script>

<!-- #HTML -->

<div
class="snake-game"
>
    <canvas
    bind:this={canvas}
    >
    </canvas>

    <div
    class="infos"
    style:transform="translateY({translateY}px)"
    bind:this={infos}
    >
        <p
        class="score"
        >
            SCORE
            <span
            bind:this={score}
            >
                0
            </span>
        </p>

        <nav>
            <ul>
                <li>
                    <Cell
                    on:click={handleClick}
                    >
                        <Toggle>
                            MASQUER LE TEXTE
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
    '../../assets/scss/styles/font.scss';

    /* #COMMON */

    .snake-game,
    .infos
    { @include flex; }

    /* #GROUPS */

    .snake-game
    {
        canvas
        {
            @include absolute;

            bottom: 0;
            left: 0;
        }

        .infos
        {
            @include xy-start(true);
            @include any-w;

            justify-content: space-between;

            z-index: 1;

            padding: 30px;

            box-sizing: border-box;

            .score { @include text-info; }

            ul { text-align: right; }
        }
    }
</style>