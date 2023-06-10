<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // #PROPS
        export let
        _colors,
        _lock = false

        // #BINDS

        export let xy = []

        export function scroll()
        {
            boundingClientRect = canvas.getBoundingClientRect()

            move()
        }

        export function mouseMove(e)
        {
            clientX = e.clientX
            clientY = e.clientY
    
            move()
        }

    // #IMPORTS

        // #JS
        import Success from '../../assets/js/success'

        // #SVELTE
        import { onMount } from 'svelte'

        // #ELEMENT
        import Toggle from '../elements/Toggle.svelte'

        // #COVER
        import Cell from '../covers/Cell.svelte'

    // #CONSTANTES

    const
    snake = [],
    apple = []

    // #VARIABLES

    let
    blockSize = 27,
    offsetX = 0,
    offsetY = 0,
    width,
    height

    let
    canvas,
    columns,
    rows,
    context,
    boundingClientRect,
    clientX = 0,
    clientY = 0,
    x = 0,
    y = 0,
    outside = true

    let
    score = 0,
    textOff = false

    // #REACTIVES

    $: xScope = x >= 0 && x < columns
    $: yScope = y >= 0 && y < rows

    // #FUNCTIONS

    function addCommand()
    {
        app.blockSize = (size) =>
        {
            if (isNaN(parseInt(size, 10))) app.log(new TypeError('la valeur doit être un nombre'))
            else if (size < 10 || size > 50) app.log(new RangeError('nombre compris entre 10 et 50 inclus'))
            else
            {
                blockSize = size

                set()
    
                app.log(new Success('blockSize = ' + size))
            }
        }
    }

    function set()
    {
        offsetX = window.innerWidth % blockSize
        offsetY = window.innerHeight % blockSize / 2

        width = window.innerWidth - offsetX
        height = window.innerHeight - offsetY * 2

        setCanvas()
        initApple()
        initSnake()
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

    function initSnake()
    {
        if (!snake.length)
            for (let i = 0; i < 10; i++) snake.push([x - i, y - i])
    }

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
        console.log('check')
        for (let i = 0; i < snake.length; i++)
        {
            const part = snake[i]
    
            if (part[0] >= 0 && part[0] < columns && part[1] >= 0 && part[1] < rows) return outside = false
        }

        return outside = true
    }

    function draw()
    {
        console.log('draw')
        if (outside) outside = false

        const [snakeX, snakeY] = [snake[0][0], snake[0][1]]

        let
        gapX = snakeX - x,
        gapY = snakeY - y,
        i = 0

        while(i++ < 30)
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
        const lastPart = snake[snake.length - 1]

        xy = [lastPart[0] * blockSize, lastPart[1] * blockSize]
    
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

            if (xScope && yScope && snakeX === x && snakeY === y) snake.pop()
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

    function handleClick() { textOff = !textOff }

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
    <canvas
    style:width="{width}px"
    style:height="{height}px"
    bind:this={canvas}
    >
    </canvas>

    <div
    class="frame"
    style:padding="{30 - offsetY}px {50 - offsetX}px 0 50px"
    >
        <p
        class="score"
        >
            SCORE {score}
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

    /* #GROUPS */

    .snake-game
    {
        @include relative;

        display: inline-block;

        .frame
        {
            @include flex;
            @include xy-start(true);
            @include any;

            justify-content: space-between;

            z-index: 2;

            box-sizing: border-box;
            box-shadow: inset -15px -15px 15px $dark, inset 15px 15px 15px $dark;

            .score { @include text-info; }

            ul { text-align: right; }
        }
    }
</style>