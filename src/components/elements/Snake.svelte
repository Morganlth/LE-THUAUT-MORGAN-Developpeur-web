<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _size,
        _options,
        _modes,
        _cards,
        _gameOver,
        _lock,
        _invincible,
        _colors

        // --BIND
        export let score = 10

    // #IMPORTS

        // #CONTEXTS
        import { app } from '../field/Main.svelte'
        import { event } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // #SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTES

        // --ARRAY
        const
        snake = [],
        apple = []

    // #VARIABLES

        // --THIS
        let
        canvas,
        columns,
        rows,
        context,
        boundingClientRect,
        clientX,
        clientY,
        x = -1,
        y = -1,
        blockSize = _size,
        scope = false,
        outside = true

        // --STYLES
        let
        offsetX,
        offsetY,
        width,
        height

        // --CARDS
        let i = 0

    let
    textOff = false,
    snakeOff = false,
    fpsOn = false,
    noneOn = false,
    normalOn = true,
    challengeOn = false

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

        // --SET
        function set()
        {
            reset()

            context = canvas.getContext('2d')

            setSnake()
            setCommand()
            setEvent()
        }

        function setCanvas()
        {
            canvas.width = width
            canvas.height = height

            columns = width / blockSize
            rows = height / blockSize

            boundingClientRect = canvas.getBoundingClientRect()
        }

        function setApple()
        {
            const
            appleX = Math.floor(Math.random() * (columns - 2) + 1), // ne prend pas les bordure
            appleY = Math.floor(Math.random() * (rows - 2) + 1)

            if (snake.find(part => part[0] === appleX && part[1] === appleY)) return setApple() // probleme si snake trop grand

            apple[0] = appleX
            apple[1] = appleY
        }

        function setSnake()
        {
            const startY = Math.floor(rows / 2)
    
            for (let i = 0; i < 10; i++) snake.push([-1 - i, startY])
        }

        function setCommand() { app.add('snakeSize', snakeSize, true) }

        function setEvent()
        {
            event.add('scroll', snake_scroll)
            event.add('mouseMove', snake_mouseMove)
            event.add('mouseDown', snake_mouseDown)
        }

        // --GET
        function getModel(pre, current, next)
        {
            const
            currentX = current[0],
            currentY = current[1],
            positions =
            [
                ['a', 'b', 'c'],
                ['d', 'e', 'f'],
                ['g', 'h', 'i']
            ],
            model = [null, null]
        
            if (pre) model[0] = positions[pre[1] - currentY][pre[0] - currentX]
            if (next) model[1] = positions[next[1] - currentY][next[0] - currentX]

            return model
        }

        function getDimensions(model)
        {
            let
            offsetX = 1,
            offsetY = 1,
            blockWidth = blockSize - 1,
            blockHeight = blockSize - 1

            for (const m of model)
            {
                switch (m)
                {
                    case 'a':
                        offsetX = 0
                        offsetY = 0
                        break
                    case 'b':
                        offsetY = 0
                        break
                    case 'c':
                        offsetY = 0
                        blockWidth = blockSize
                        break
                    case 'd':
                        offsetX = 0
                        break
                    case 'f':
                        blockWidth = blockSize
                        break
                    case 'g':
                        offsetX = 0
                        blockHeight = blockSize
                        break
                    case 'h':
                        blockHeight = blockSize
                        break
                    case 'i':
                        blockWidth = blockSize
                        blockHeight = blockSize
                        break
                    default:
                        break
                }
            }

            return [offsetX, offsetY, blockWidth - offsetX, blockHeight - offsetY]
        }

        // --RESET
        function reset()
        {
            offsetX = window.innerWidth % blockSize
            offsetY = window.innerHeight % blockSize / 2

            width = window.innerWidth - offsetX
            height = window.innerHeight - offsetY * 2

            setCanvas()
            setApple()
        }
    
        function resetGame() /* reset game over */
        {
            update()
            resetSnake()
            moveSnake()
            setApple()

            _gameOver.update(false)
        }

        function resetSnake() // reset le serpent
        {
            if (snake.length > 10)
            {
                animation(false, 10)
                snake.length = 10
                score = 10
            }
        }
    
        // --UPDATE
        function update()
        {
            score = snake.length
    
            x = Math.floor((clientX - boundingClientRect.left) / blockSize)
            y = Math.floor((clientY - boundingClientRect.top) / blockSize)

            scope = x >= 0 && x < columns && y >= 0 && y < rows
        }

        function updateGamePlan()
        {
            if (options.text) updateCard()
        
            setApple()

            snake.push([])
        }

        function updateCard()
        {
            const [cardX, cardY] = snake[snake.length - 1]
    
            if (i === _cards.length) i = 0

            const j = i - 1

            _cards[j < 0 ? _cards.length - 1 : j].hidden()
            _cards[i++].update(cardX * blockSize, cardY * blockSize, 100)
        }

        // --COMMAND
        async function snakeSize(size)
        {
            size = app.testDefault(size) ? _size : app.testNumber(size, 10, 70)

            blockSize = size
            localStorage.setItem('snakeSize', size)
            reset()
    
            app.success('snakeSize ' + size)
        }
    
        // --EVENTS
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

        async function snake_mouseDown(e) // click pour reset apres un gameOver
        {
            if (_gameOver.on && e.target.classList.contains('frame'))
            {
                clientX = e.clientX
                clientY = e.clientY

                resetGame()
            }
        }

        function snake_mouseLeave()
        {
            spring.spring_mouseLeave()

            if (_modes.challenge) _gameOver.update(true)
        }

        // --MOVE
        function move()
        {
            if (test())
            {
                update()
            
                if (check()) draw()
            }
        }

        function moveSnake() // deplace le serpent en conservant sa position initiale
        {
            const [gapX, gapY] = [x - snake[0][0], y - snake[0][1]]

            for (let i = 0; i < snake.length; i++)
            {
                const part = snake[i]

                part[0] = part[0] + gapX
                part[1] = part[1] + gapY
            }
        }

        // --TEST-CHECK
        function test()
        {
            return !(
               _lock
            || _gameOver.on
            || event.grabbing
            || (snake.length && snake[0][0] === x && snake[0][1] === y))
        }

        function check()
        {
            if (scope) checkInside()
            else
            {
                if (outside || checkOutside()) return false
            }
    
            if (!options.snake) return false

            return true
        }

        function checkInside()
        {
            if (outside) outside = false
    
            if (!options.snake)
            {
                if (spring.lock) spring.spring_mouseLeave()
            }
            else if (!spring.lock) spring.spring_mouseEnter()
        }

        function checkOutside()
        {
            for (let i = 0; i < snake.length; i++)
            {
                const part = snake[i]
        
                if (part[0] >= 0 && part[0] < columns && part[1] >= 0 && part[1] < rows) return false
            }

            return outside = true
        }

        function checkSnakePart(part)
        {
            const [snakeX, snakeY] = [part[0], part[1]]
    
            if (snakeX === apple[0] && snakeY === apple[1]) updateGamePlan()
            if (!_invincible && scope && snakeX === x && snakeY === y) _modes.challenge ? _gameOver.update(true) : snake.pop()
        }

        // --DRAW-CLEAR
        function draw()
        {
            const [snakeX, snakeY] = [snake[0][0], snake[0][1]]

            let
            gapX = snakeX - x,
            gapY = snakeY - y,
            // step = Math.max(Math.abs(gapX), Math.abs(gapY)),
            i = 0

            // console.log(step + ' - ' + (gapX / step) + ' - ' + (gapY / step))

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

        function clear() { context.clearRect(0, 0, width, height) }

        function drawApple()
        {
            context.fillStyle = _colors.indicator
            context.fillRect(apple[0] * blockSize, apple[1] * blockSize, blockSize, blockSize)
        }

        function drawSnake(x, y)
        {
            context.fillStyle = _colors.oPrimary

            for (let i = snake.length - 1; i > 0; i--)
            {
                snake[i] = snake[i-1]

                const part = snake[i]

                checkSnakePart(part)
                drawSnakeBody(part, i)
            }

            drawSnakeHead(x, y)
        }

        function drawSnakeBody(part, i)
        {
            const
            model = getModel(snake[i+1], part, snake[i-2]),
            [offsetX, offsetY, blockWidth, blockHeight] = getDimensions(model)

            context.fillRect(part[0] * blockSize + offsetX, part[1] * blockSize + offsetY, blockWidth, blockHeight)
        }

        function drawSnakeHead(x, y)
        {
            if (x === apple[0] && y === apple[1]) updateGamePlan()

            snake[0] = [x, y]
        
            context.fillStyle = _colors.primary
            context.fillRect(snake[0][0] * blockSize, snake[0][1] * blockSize, blockSize, blockSize)
        }

        // --CODE
        function animation(draw, max = -1) // dessine ou supprime de façon animé (serpent et pomme)
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




    
    

    



    

    function hidden() { for (let i = 0; i < cards.length; i++) cards[i].hidden() }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<div
class="snake-game"
style:height="{height}px"
style:margin="{offsetY}px {offsetX}px {offsetY}px 0"
on:mouseleave={snake_mouseLeave}
>
    <canvas
    style:width="{width}px"
    style:height="{height}px"
    bind:this={canvas}
    >
    </canvas>
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